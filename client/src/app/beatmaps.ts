import { app } from "electron";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

import { LazerLibraryReaderResponse } from "../models/client";
import {
  checkValidPath,
  getClientMode,
  getClientPath,
  getSongsFolder,
  getTempPath,
} from "./settings";

const execFileAsync = promisify(execFile);

export let beatmapIds: Set<number> = new Set();
export let lastBeatmapScanError = "";

export const getLazerReaderPath = () => (
  app.isPackaged
    ? path.join(process.resourcesPath, "lazer-library-reader.exe")
    : path.join(app.getAppPath(), "bin", "lazer-library-reader", "win-x64", "lazer-library-reader.exe")
);

const readStableBeatmaps = async () => {
  const songsPath = await getSongsFolder();
  const entries = await fs.promises.readdir(songsPath);
  return entries
    .map((entry) => /^\d+/.exec(entry)?.[0])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .filter((value) => value > 0);
};

const readStagedBeatmaps = async () => {
  const tempPath = await getTempPath();

  try {
    const entries = await fs.promises.readdir(tempPath);
    return entries
      .map((entry) => /^(\d+)\.osz$/i.exec(entry)?.[1])
      .filter((value): value is string => Boolean(value))
      .map(Number)
      .filter((value) => value > 0);
  } catch {
    return [];
  }
};

export const readLazerBeatmaps = async () => {
  if (process.platform !== "win32") {
    throw new Error("osu!lazer library detection is currently available on Windows only.");
  }

  const lazerPath = await getClientPath("lazer");
  const realmPath = path.join(lazerPath, "client.realm");
  const readerPath = getLazerReaderPath();
  const { stdout } = await execFileAsync(readerPath, [realmPath], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    timeout: 60_000,
    windowsHide: true,
  });
  const response = JSON.parse(stdout) as LazerLibraryReaderResponse;

  if (response.protocolVersion !== 1 || !Array.isArray(response.setIds)) {
    throw new Error("The osu!lazer library reader returned an unsupported response.");
  }

  return response.setIds.filter((setId) => Number.isInteger(setId) && setId > 0);
};

export const loadBeatmaps = async () => {
  const mode = await getClientMode();
  const clientPath = await getClientPath(mode);

  if (!await checkValidPath(clientPath, mode)) {
    beatmapIds = new Set();
    lastBeatmapScanError = "";
    return 0;
  }

  try {
    const installed = mode === "lazer"
      ? await readLazerBeatmaps()
      : await readStableBeatmaps();
    const staged = mode === "lazer" ? await readStagedBeatmaps() : [];

    beatmapIds = new Set([...installed, ...staged]);
    lastBeatmapScanError = "";
  } catch (error) {
    beatmapIds = new Set();
    lastBeatmapScanError = error instanceof Error ? error.message : String(error);
    console.error("Could not load local beatmaps", error);
  }

  return beatmapIds.size;
};
