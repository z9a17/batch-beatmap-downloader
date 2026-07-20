import { app } from "electron";
import settings from "electron-settings";
import fs from "fs";
import os from "os";
import path from "path";

import { OsuClientMode } from "../models/client";

const pathExists = async (target: string, filename: string) => {
  if (!target) return false;

  try {
    return (await fs.promises.stat(path.join(target, filename))).isFile();
  } catch {
    return false;
  }
};

export const getClientMode = async (): Promise<OsuClientMode> => {
  const mode = await settings.get("clientMode");
  return mode === "lazer" ? "lazer" : "stable";
};

export const setClientMode = (mode: OsuClientMode) => settings.set("clientMode", mode);

const readLazerStorageRedirect = async () => {
  const storagePath = path.join(app.getPath("appData"), "osu", "storage.ini");

  try {
    const storage = await fs.promises.readFile(storagePath, "utf8");
    const fullPath = /^\s*FullPath\s*=\s*(.+?)\s*$/im.exec(storage)?.[1]?.trim();
    return fullPath ?? "";
  } catch {
    return "";
  }
};

export const findDefaultLazerPath = async () => {
  const redirected = await readLazerStorageRedirect();
  const candidates = [
    redirected,
    path.join(app.getPath("appData"), "osu"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await pathExists(candidate, "client.realm")) return candidate;
  }

  return "";
};

export const findDefaultLazerExecutable = async () => {
  if (process.platform !== "win32") return "";

  const localAppData = process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local");
  const candidates = [
    path.join(localAppData, "osulazer", "current", "osu!.exe"),
    path.join(localAppData, "osu!", "current", "osu!.exe"),
  ];

  for (const candidate of candidates) {
    if (await pathExists(path.dirname(candidate), path.basename(candidate))) return candidate;
  }

  return "";
};

export const getStablePath = async () => {
  const stablePath = await settings.get("stablePath");
  if (typeof stablePath === "string" && stablePath) return stablePath;

  // Preserve installations configured before client profiles were introduced.
  const legacyPath = await settings.get("path");
  return typeof legacyPath === "string" ? legacyPath : "";
};

export const getLazerPath = async () => {
  const lazerPath = await settings.get("lazerPath");
  if (typeof lazerPath === "string" && lazerPath) return lazerPath;
  return findDefaultLazerPath();
};

export const getClientPath = async (mode?: OsuClientMode) => {
  const selectedMode = mode ?? await getClientMode();
  return selectedMode === "lazer" ? getLazerPath() : getStablePath();
};

export const setClientPath = async (mode: OsuClientMode, value: string) => {
  if (mode === "lazer") {
    await settings.set("lazerPath", value);
    return;
  }

  await settings.set("stablePath", value);
  // Keep the legacy key while older alpha builds may still be used with this config.
  await settings.set("path", value);
};

export const getLazerExecutablePath = async () => {
  const executable = await settings.get("lazerExecutablePath");
  if (typeof executable === "string" && executable) return executable;
  return findDefaultLazerExecutable();
};

export const setLazerExecutablePath = (value: string) => settings.set("lazerExecutablePath", value);

export const checkValidPath = async (
  target: string,
  mode?: OsuClientMode,
) => {
  const selectedMode = mode ?? await getClientMode();
  return pathExists(target, selectedMode === "lazer" ? "client.realm" : "collection.db");
};

export const checkValidLazerExecutable = async (executable?: string) => {
  const resolvedExecutable = executable ?? await getLazerExecutablePath();
  if (process.platform !== "win32" || !resolvedExecutable) return false;
  return pathExists(path.dirname(resolvedExecutable), path.basename(resolvedExecutable));
};

export const getSongsFolder = async () => {
  const mode = await getClientMode();
  if (mode === "lazer") return getLazerPath();

  const altPathEnabled = await settings.get("altPathEnabled") as boolean;
  if (altPathEnabled) {
    const altPath = await settings.get("altPath") as string;
    return typeof altPath === "string" ? altPath : "";
  }

  const osuPath = await getStablePath();
  return osuPath ? path.join(osuPath, "Songs") : "";
};

export const getDefaultTempPath = async () => {
  const mode = await getClientMode();

  if (mode === "lazer") {
    return path.join(os.homedir(), "Downloads", "BBD Community", "lazer-imports");
  }

  const altPathEnabled = await settings.get("altPathEnabled") as boolean;
  if (altPathEnabled) return "";

  const osuPath = await getStablePath();
  return osuPath ? path.join(osuPath, "bbd-temp") : "";
};

const getTempPathKey = async () => (
  (await getClientMode()) === "lazer" ? "lazerTempPath" : "tempPath"
);

export const getTempPath = async () => {
  const tempPath = await settings.get(await getTempPathKey());
  const resolved = typeof tempPath === "string" && tempPath
    ? tempPath
    : await getDefaultTempPath();

  if (resolved) await fs.promises.mkdir(resolved, { recursive: true });
  return resolved;
};

export const setTempPath = async (value: string) => settings.set(await getTempPathKey(), value);
export const resetTempPath = async () => settings.unset(await getTempPathKey());

export const checkValidTempPath = async (target: string) => {
  if (!target) return false;

  try {
    await fs.promises.mkdir(target, { recursive: true });
    await fs.promises.access(target, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    return false;
  }

  const mode = await getClientMode();
  if (mode === "lazer" || process.platform !== "win32") return true;

  const songsPath = await getSongsFolder();
  if (!songsPath) return false;
  return path.parse(songsPath).root.toLowerCase() === path.parse(target).root.toLowerCase();
};

export const getDownloadPath = async () => {
  const mode = await getClientMode();
  if (mode === "lazer") return getTempPath();

  const temp = await settings.get("temp") as boolean;
  return temp ? getTempPath() : getSongsFolder();
};

export const getMaxConcurrentDownloads = async () => {
  return (await settings.get("maxConcurrentDownloads") as number) ?? 3;
};
