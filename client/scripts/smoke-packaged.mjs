import { spawn, spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";

const executablePath = process.env.BBD_SMOKE_EXECUTABLE
  ? path.resolve(process.env.BBD_SMOKE_EXECUTABLE)
  : path.resolve(
    "out",
    "Batch Beatmap Downloader Community-win32-x64",
    "bbd-community.exe",
  );

await access(executablePath);

const port = await new Promise((resolve, reject) => {
  const server = createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const address = server.address();
    if (!address || typeof address === "string") {
      server.close();
      reject(new Error("Could not reserve a debugging port"));
      return;
    }

    server.close((error) => {
      if (error) reject(error);
      else resolve(address.port);
    });
  });
});

const output = [];
const application = spawn(
  executablePath,
  [`--remote-debugging-port=${port}`, "--enable-logging"],
  {
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  },
);

application.stdout.on("data", (chunk) => output.push(chunk.toString()));
application.stderr.on("data", (chunk) => output.push(chunk.toString()));

const stopApplication = () => {
  if (application.exitCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(application.pid), "/t", "/f"], {
      stdio: "ignore",
      windowsHide: true,
    });
  } else {
    application.kill("SIGKILL");
  }
};

const wait = (milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

const evaluate = (webSocketDebuggerUrl, expression) => new Promise((resolve, reject) => {
  const socket = new WebSocket(webSocketDebuggerUrl);
  const timeout = setTimeout(() => {
    socket.close();
    reject(new Error("Timed out while evaluating the packaged renderer"));
  }, 10_000);

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({
      id: 1,
      method: "Runtime.evaluate",
      params: {
        expression,
        returnByValue: true,
      },
    }));
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id !== 1) return;

    clearTimeout(timeout);
    socket.close();

    if (message.result?.exceptionDetails) {
      reject(new Error(message.result.exceptionDetails.text));
      return;
    }

    resolve(message.result?.result?.value);
  });

  socket.addEventListener("error", () => {
    clearTimeout(timeout);
    reject(new Error("Could not connect to the packaged renderer"));
  });
});

try {
  const deadline = Date.now() + 45_000;
  let target;

  while (Date.now() < deadline && !target) {
    if (application.exitCode !== null) {
      throw new Error(`Application exited during startup.\n${output.join("")}`);
    }

    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      target = targets.find((candidate) => candidate.type === "page");
    } catch {
      // The debugging endpoint is not ready yet.
    }

    if (!target) await wait(250);
  }

  if (!target) {
    throw new Error(`Packaged renderer did not become available.\n${output.join("")}`);
  }

  let state;
  while (Date.now() < deadline) {
    try {
      state = await evaluate(
        target.webSocketDebuggerUrl,
        `({
          bridgeAvailable: typeof window.electron === "object",
          rootChildren: document.getElementById("root")?.childElementCount ?? 0,
          shellMounted: Boolean(document.querySelector(".app-shell")),
          sidebarText: document.querySelector(".app-sidebar")?.textContent ?? ""
        })`,
      );
    } catch (error) {
      output.push(`Renderer inspection retry: ${error}\n`);

      try {
        const response = await fetch(`http://127.0.0.1:${port}/json/list`);
        const targets = await response.json();
        target = targets.find((candidate) => candidate.type === "page") ?? target;
      } catch {
        // Keep the last known target and retry while the application is alive.
      }

      await wait(250);
      continue;
    }

    if (
      state?.bridgeAvailable
      && state.rootChildren > 0
      && state.shellMounted
      && state.sidebarText.includes("Beatmap Downloader")
    ) {
      break;
    }

    await wait(250);
  }

  if (
    !state?.bridgeAvailable
    || state.rootChildren < 1
    || !state.shellMounted
    || !state.sidebarText.includes("Beatmap Downloader")
  ) {
    throw new Error(
      `Packaged renderer did not mount correctly: ${JSON.stringify(state)}\n${output.join("")}`,
    );
  }

  console.log(`Packaged renderer smoke test passed: ${JSON.stringify(state)}`);
} finally {
  stopApplication();
}
