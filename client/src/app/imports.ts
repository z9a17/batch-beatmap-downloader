import { spawn } from "child_process";
import fs from "fs";
import path from "path";

import { TransferResult } from "../models/client";
import { loadBeatmaps, readLazerBeatmaps } from "./beatmaps";
import {
  checkValidLazerExecutable,
  getClientMode,
  getLazerExecutablePath,
  getSongsFolder,
  getTempPath,
} from "./settings";

const delay = (milliseconds: number) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

const getStagedArchives = async () => {
  const tempPath = await getTempPath();
  const entries = await fs.promises.readdir(tempPath);
  return entries
    .filter((entry) => entry.toLowerCase().endsWith(".osz"))
    .map((entry) => path.join(tempPath, entry));
};

const moveStableArchives = async (archives: string[]): Promise<TransferResult> => {
  const songsPath = await getSongsFolder();
  await fs.promises.mkdir(songsPath, { recursive: true });

  let imported = 0;
  for (const archive of archives) {
    const destination = path.join(songsPath, path.basename(archive));
    await fs.promises.copyFile(archive, destination);
    await fs.promises.unlink(archive);
    imported++;
  }

  await loadBeatmaps();
  return {
    requested: archives.length,
    imported,
    remaining: archives.length - imported,
    mode: "stable",
  };
};

const archiveSetId = (archive: string) => {
  const match = /^(\d+)\.osz$/i.exec(path.basename(archive));
  return match ? Number(match[1]) : null;
};

const launchLazerImports = async (executable: string, archives: string[]) => {
  const batchSize = 40;

  for (let index = 0; index < archives.length; index += batchSize) {
    const batch = archives.slice(index, index + batchSize);
    const child = spawn(executable, batch, {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();
    await delay(350);
  }
};

const importLazerArchives = async (archives: string[]): Promise<TransferResult> => {
  const executable = await getLazerExecutablePath();
  if (!await checkValidLazerExecutable(executable)) {
    throw new Error("Choose a valid osu!lazer executable before importing downloads.");
  }

  const installedBeforeImport = new Set(await readLazerBeatmaps());
  await launchLazerImports(executable, archives);

  const pending = new Map<number, string>();
  for (const archive of archives) {
    const setId = archiveSetId(archive);
    if (setId) pending.set(setId, archive);
  }

  const deadline = Date.now() + 60_000;
  while (pending.size > 0 && Date.now() < deadline) {
    await delay(1_000);

    try {
      const installed = new Set(await readLazerBeatmaps());
      for (const [setId, archive] of pending) {
        // A set that existed before launch cannot be distinguished from a
        // completed forced re-import. Keep that archive instead of deleting it
        // before lazer has definitely consumed it.
        if (installedBeforeImport.has(setId) || !installed.has(setId)) continue;

        await fs.promises.unlink(archive).catch(() => undefined);
        pending.delete(setId);
      }
    } catch {
      // lazer may briefly lock or replace the Realm file while importing.
    }
  }

  await loadBeatmaps();
  return {
    requested: archives.length,
    imported: archives.length - pending.size,
    remaining: pending.size,
    mode: "lazer",
  };
};

export const transferStagedArchives = async (): Promise<TransferResult> => {
  const mode = await getClientMode();
  const archives = await getStagedArchives();

  if (archives.length === 0) {
    return { requested: 0, imported: 0, remaining: 0, mode };
  }

  return mode === "lazer"
    ? importLazerArchives(archives)
    : moveStableArchives(archives);
};
