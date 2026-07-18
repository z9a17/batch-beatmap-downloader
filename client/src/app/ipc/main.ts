import { app, ipcMain, shell } from "electron";
import { loadClientId, loadDownloads } from "../download/settings";
import {
  handleCreateDownload,
  handleDeleteDownload,
  handleGetDownloadsStatus,
  handleMoveAllDownloads,
  handlePauseDownload,
  handlePauseDownloads,
  handleResumeDownload,
  handleResumeDownloads,
  handleStartDownload
} from "./downloads";
import {
  handleBrowse,
  handleBrowseExecutable,
  handleCheckCollections,
  handleGetPlatform,
  handleGetSettings,
  handleGetTempData,
  handleLoadBeatmaps,
  handleResetTempPath,
  handleSetSetting,
  handleSetSettings,
} from "./settings";
import { handleGetBeatmapDetails, handleGetMetrics, handleQuery } from "./query";

export const serverUri = process.env.BBD_API_URL ?? "https://v2.nzbasic.com";
export type E = Electron.IpcMainInvokeEvent

loadDownloads()
loadClientId()

ipcMain.on("quit", () => app.quit());
ipcMain.handle("get-version", () => app.getVersion())
ipcMain.handle("open-url", async (_event, value: unknown) => {
  if (typeof value !== "string") {
    throw new TypeError("External URL must be a string");
  }

  const url = new URL(value);
  if (url.protocol !== "https:") {
    throw new Error("Only secure external links are allowed");
  }

  await shell.openExternal(url.toString());
});

ipcMain.handle("start-download", handleStartDownload)
ipcMain.handle("get-downloads-status", handleGetDownloadsStatus)
ipcMain.handle("create-download", handleCreateDownload);
ipcMain.handle("resume-download", handleResumeDownload);
ipcMain.handle("resume-downloads", handleResumeDownloads);
ipcMain.handle("pause-download", handlePauseDownload);
ipcMain.handle("pause-downloads", handlePauseDownloads)
ipcMain.handle("delete-download", handleDeleteDownload);
ipcMain.handle("move-all-downloads", handleMoveAllDownloads);

ipcMain.handle("set-setting", handleSetSetting);
ipcMain.handle("get-settings", handleGetSettings);
ipcMain.handle("set-settings", handleSetSettings);
ipcMain.handle("browse", handleBrowse);
ipcMain.handle("browse-executable", handleBrowseExecutable);
ipcMain.handle("load-beatmaps", handleLoadBeatmaps);
ipcMain.handle("check-collections", handleCheckCollections)
ipcMain.handle("reset-temp-path", handleResetTempPath);
ipcMain.handle("get-temp-data", handleGetTempData);
ipcMain.handle("get-platform", handleGetPlatform);

ipcMain.handle("query", handleQuery);
ipcMain.handle("get-metrics", handleGetMetrics)
ipcMain.handle("get-beatmap-details", handleGetBeatmapDetails);
