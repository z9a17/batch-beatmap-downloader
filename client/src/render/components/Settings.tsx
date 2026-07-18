import React from "react";
import Switch from "react-switch";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

import { useSettings } from "../context/SettingsProvider";
import { Browse } from "./Browse";
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
  const { settings, setPath, setAltPathEnabled, setAltPath, setMaxConcurrentDownloads } = useSettings();
  const { path, altPathEnabled, altPath, beatmapSetCount, maxConcurrentDownloads } = settings;

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Library</div>
          <h2 className="panel-title mt-1">Storage and delivery</h2>
          <p className="panel-description mt-1">Choose where beatmaps land and how aggressively transfers run.</p>
        </div>
        <div className="icon-plain">
          <FolderRoundedIcon />
        </div>
      </div>

      <div className="divide-y divide-[#334055]">
        <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
          <div>
            <div className="text-sm font-semibold text-white">osu! installation</div>
            <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">The stable client folder containing collection.db.</div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Browse path={path} update={setPath} />
            {!altPathEnabled && (
              <span className="pill"><span className="status-dot text-cyan-400" />{beatmapSetCount.toLocaleString()} sets found</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
          <div>
            <div className="text-sm font-semibold text-white">Alternate songs folder</div>
            <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Store downloads outside the detected osu! location.</div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Switch {...switchColors} onChange={setAltPathEnabled} checked={altPathEnabled} />
            {altPathEnabled && <Browse path={altPath} update={setAltPath} />}
            {altPathEnabled && (
              <span className="pill">{altPath ? beatmapSetCount.toLocaleString() : 0} sets found</span>
            )}
          </div>
        </div>

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
    </section>
  );
};
