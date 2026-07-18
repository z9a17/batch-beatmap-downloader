import { spawnSync } from "node:child_process";
import path from "node:path";

if (process.platform !== "win32") {
  console.log("Skipping the Windows-only osu!lazer library reader build.");
  process.exit(0);
}

const project = path.resolve("native", "LazerLibraryReader", "LazerLibraryReader.csproj");
const output = path.resolve("bin", "lazer-library-reader", "win-x64");
const result = spawnSync(
  "dotnet",
  [
    "publish",
    project,
    "--configuration",
    "Release",
    "--runtime",
    "win-x64",
    "--self-contained",
    "true",
    "--output",
    output,
    "-p:PublishSingleFile=true",
    "-p:PublishTrimmed=false",
    "-p:DebugType=None",
    "-p:DebugSymbols=false",
  ],
  {
    cwd: process.cwd(),
    stdio: "inherit",
    windowsHide: true,
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
