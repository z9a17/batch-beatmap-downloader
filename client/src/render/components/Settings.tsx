import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import React from "react";
import Switch from "react-switch";
import { toast } from "react-toastify";

import { useSettings } from "../context/SettingsProvider";
import { Browse } from "./Browse";
import Button from "./util/Button";
import { NumericInput } from "./util/NumericInput";
import { Tooltip } from "./util/Tooltip";

const parallelTooltip = `The number of simultaneous download requests. Higher values can improve throughput, but may saturate your connection. Pause and resume active jobs after changing this value.`;

const switchColors = {
  onColor: "#2563eb",
  offColor: "#354155",
  onHandleColor: "#ffffff",
  offHandleColor: "#8f9bad",
  uncheckedIcon: false,
  checkedIcon: false,
  height: 22,
  width: 42,
};

export const Settings = () => {
  const {
    settings,
    setClientMode,
    setPath,
    setLazerExecutablePath,
    setAltPathEnabled,
    setAltPath,
    setMaxConcurrentDownloads,
  } = useSettings();
  const {
    clientMode,
    path,
    validPath,
    lazerExecutablePath,
    validLazerExecutable,
    altPathEnabled,
    altPath,
    beatmapSetCount,
    maxConcurrentDownloads,
    beatmapScanError,
  } = settings;
  const isLazer = clientMode === "lazer";

  const browseExecutable = async () => {
    const result = await window.electron.browseExecutable();
    if (result.canceled) return;

    await setLazerExecutablePath(result.filePaths[0]);
    toast.success("osu!lazer executable updated");
  };

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Library</div>
          <h2 className="panel-title mt-1">osu! client</h2>
          <p className="panel-description mt-1">Select the client whose local library and import flow should be used.</p>
        </div>
        <div className="icon-plain">
          <FolderRoundedIcon />
        </div>
      </div>

      <div className="divide-y divide-[#334055]">
        <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
          <div>
            <div className="text-sm font-semibold text-white">Client</div>
            <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Switching keeps each client’s path.</div>
          </div>
          <div className="segmented w-fit">
            <button
              className={`segmented-item ${!isLazer ? "segmented-item-active" : ""}`}
              onClick={() => setClientMode("stable")}
            >
              osu!stable
            </button>
            <button
              className={`segmented-item ${isLazer ? "segmented-item-active" : ""}`}
              onClick={() => setClientMode("lazer")}
            >
              osu!lazer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
          <div>
            <div className="text-sm font-semibold text-white">{isLazer ? "lazer data folder" : "stable installation"}</div>
            <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">
              {isLazer ? "Folder containing client.realm." : "Folder containing collection.db and Songs."}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Browse path={path} update={setPath} />
            <span className={validPath ? "text-[13px] text-emerald-300" : "text-[13px] text-rose-300"}>
              {validPath ? `${beatmapSetCount.toLocaleString()} sets detected` : "Path not connected"}
            </span>
          </div>
        </div>

        {isLazer && (
          <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
            <div>
              <div className="text-sm font-semibold text-white">lazer executable</div>
              <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Used to import completed `.osz` files.</div>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <input className="input-height min-w-[220px] flex-1" value={lazerExecutablePath} disabled />
              <Button color="none" className="button-secondary shrink-0" onClick={browseExecutable}>Browse</Button>
              <span className={validLazerExecutable ? "text-[13px] text-emerald-300" : "text-[13px] text-rose-300"}>
                {validLazerExecutable ? "Ready" : "Not found"}
              </span>
            </div>
          </div>
        )}

        {!isLazer && (
          <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
            <div>
              <div className="text-sm font-semibold text-white">Alternate songs folder</div>
              <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Store downloads outside the detected stable location.</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Switch {...switchColors} onChange={setAltPathEnabled} checked={altPathEnabled} />
              {altPathEnabled && <Browse path={altPath} update={setAltPath} />}
              {altPathEnabled && <span className="text-[13px] text-[#a4b0c2]">{altPath ? `${beatmapSetCount.toLocaleString()} sets detected` : "No folder selected"}</span>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              Parallel transfers
              <Tooltip title={parallelTooltip} />
            </div>
            <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Applies the next time a job starts or resumes.</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="icon-plain text-cyan-300">
              <SpeedRoundedIcon fontSize="small" />
            </div>
            <NumericInput
              className="w-20"
              max={25}
              min={1}
              value={maxConcurrentDownloads ?? 5}
              onChange={(value) => setMaxConcurrentDownloads(Math.max(1, Math.min(25, value)))}
            />
            <span className="text-[13px] text-[#a4b0c2]">connections</span>
          </div>
        </div>
      </div>

      {beatmapScanError && (
        <div className="mt-4 border-l-2 border-rose-400 px-4 py-2 text-[13px] leading-5 text-rose-200">
          Local library scan failed: {beatmapScanError}
        </div>
      )}
    </section>
  );
};
