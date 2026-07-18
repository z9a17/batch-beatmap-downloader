import { execFileSync } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";

const executable = process.env.BBD_LAZER_READER
  ? path.resolve(process.env.BBD_LAZER_READER)
  : path.resolve(
    "out",
    "Batch Beatmap Downloader Community-win32-x64",
    "resources",
    "lazer-library-reader.exe",
  );

await access(executable);
const output = execFileSync(executable, ["--version"], {
  encoding: "utf8",
  windowsHide: true,
});
const version = JSON.parse(output);

if (version.protocolVersion !== 1) {
  throw new Error(`Unexpected lazer reader protocol: ${output}`);
}

const selfTestOutput = execFileSync(executable, ["--self-test"], {
  encoding: "utf8",
  windowsHide: true,
});
const selfTest = JSON.parse(selfTestOutput);

if (selfTest.protocolVersion !== 1 || selfTest.realmAvailable !== true) {
  throw new Error(`osu!lazer Realm self-test failed: ${selfTestOutput}`);
}

console.log(`osu!lazer library reader smoke test passed: ${selfTestOutput}`);
