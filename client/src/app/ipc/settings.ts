import { dialog } from "electron";
import settings from "electron-settings";
import fs from "fs";
import os from "os";
import path from "path";

import { SettingsObject } from "../../global";
import { OsuClientMode } from "../../models/client";
import { SettingType } from "../../models/settings";
import { beatmapIds, lastBeatmapScanError, loadBeatmaps } from "../beatmaps";
import { checkCollections } from "../collection/collection";
import {
  checkValidLazerExecutable,
  checkValidPath,
  checkValidTempPath,
  getClientMode,
  getClientPath,
  getLazerExecutablePath,
  getLazerPath,
  getStablePath,
  getTempPath,
  resetTempPath,
  setClientMode,
  setClientPath,
  setLazerExecutablePath,
  setTempPath,
} from "../settings";
import { window } from "../../main";
import { E } from "./main";

export const handleGetSettings = async () => {
  const clientMode = await getClientMode();
  const clientPath = await getClientPath(clientMode);
  const stablePath = await getStablePath();
  const lazerPath = await getLazerPath();
  const lazerExecutablePath = await getLazerExecutablePath();
  const validPath = await checkValidPath(clientPath, clientMode);
  const validLazerExecutable = await checkValidLazerExecutable(lazerExecutablePath);

  await loadBeatmaps();
  const data = await settings.get();
  return {
    ...data,
    clientMode,
    path: clientPath,
    stablePath,
    lazerPath,
    lazerExecutablePath,
    validLazerExecutable,
    validPath,
    sets: beatmapIds.size,
    beatmapScanError: lastBeatmapScanError,
  };
};

export const handleSetSettings = (_event: E, value: SettingsObject) => settings.set(value);

export const handleSetSetting = async <T extends keyof SettingType>(
  _event: E,
  key: T,
  value: Parameters<SettingType[T]>[0],
) => {
  switch (key) {
    case "darkMode":
      return settings.set("darkMode", value);
    case "maxConcurrentDownloads":
      return settings.set("maxConcurrentDownloads", value);
    case "clientMode":
      return handleSetClientMode(value as OsuClientMode);
    case "path":
      return handleSetPath(value as string);
    case "lazerExecutablePath":
      return handleSetLazerExecutablePath(value as string);
    case "altPath":
      return handleSetAltPath(value as string);
    case "altPathEnabled":
      return handleSetAltPathEnabled(value as boolean);
    case "temp":
      return settings.set("temp", value);
    case "tempPath":
      return setTempPath(value as string);
    case "autoTemp":
      return settings.set("autoTemp", value);
  }
};

export const handleLoadBeatmaps = loadBeatmaps;
export const handleCheckCollections = checkCollections;

export const handleSetClientMode = async (mode: OsuClientMode) => {
  await setClientMode(mode);
  return loadBeatmaps();
};

export const handleSetPath = async (clientPath: string): Promise<[boolean, number]> => {
  const mode = await getClientMode();
  const validPath = await checkValidPath(clientPath, mode);

  if (!validPath) {
    const requiredFile = mode === "lazer" ? "client.realm" : "collection.db";
    window?.webContents.send("error", `Could not find ${requiredFile}`);
    return [false, 0];
  }

  if (mode === "stable") {
    const source = path.join(clientPath, "collection.db");
    const backup = path.join(clientPath, "collection-bbd-backup.db");
    await fs.promises.copyFile(source, backup);
  }

  await setClientPath(mode, clientPath);
  await loadBeatmaps();
  return [true, beatmapIds.size];
};

export const handleSetLazerExecutablePath = async (executable: string) => {
  const valid = await checkValidLazerExecutable(executable);
  if (!valid) {
    window?.webContents.send("error", "Choose osu!.exe from the osu!lazer installation");
    return false;
  }

  await setLazerExecutablePath(executable);
  return true;
};

export const handleSetAltPath = async (alternatePath: string): Promise<number> => {
  await settings.set("altPath", alternatePath);
  await loadBeatmaps();
  return beatmapIds.size;
};

export const handleSetAltPathEnabled = async (enabled: boolean) => {
  await settings.set("altPathEnabled", enabled);
  await loadBeatmaps();
  return beatmapIds.size;
};

export const handleBrowse = () => dialog.showOpenDialog({
  properties: ["openDirectory"],
});

export const handleBrowseExecutable = () => dialog.showOpenDialog({
  properties: ["openFile"],
  filters: [
    { name: "osu! executable", extensions: ["exe"] },
  ],
});

export const handleResetTempPath = resetTempPath;

export const handleGetTempData = async () => {
  const mode = await getClientMode();
  const tempEnabled = mode === "lazer" || await settings.get("temp") as boolean;
  const tempAuto = await settings.get("autoTemp") as boolean;
  const tempPath = await getTempPath();
  const files = tempPath
    ? await fs.promises.readdir(tempPath).catch(() => [])
    : [];
  const valid = await checkValidTempPath(tempPath);

  return {
    valid,
    enabled: tempEnabled ?? false,
    path: tempPath,
    count: files.filter((file) => file.toLowerCase().endsWith(".osz")).length,
    auto: tempAuto ?? false,
    mode,
  };
};

export const handleGetPlatform = () => os.platform();
