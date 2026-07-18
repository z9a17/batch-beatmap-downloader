import React, { useMemo, useState } from "react";
import { LinearProgress } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import humanizeDuration from "humanize-duration";
import { toast } from "react-toastify";

import { ReportedDownloadStatus } from "../../models/api";
import { bytesToFileSize } from "../util/fileSize";

interface PropTypes {
  status: ReportedDownloadStatus;
}

export const DownloadSummary = ({ status }: PropTypes) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const estimatedTimeLeft = useMemo(() => {
    if (status.speed === 0) return "Calculating";
    const remainingSize = status.totalSize - status.totalProgress;
    const speed = status.speed * 1024 * 1024;
    return humanizeDuration((remainingSize / speed) * 1000, { round: true });
  }, [status.speed, status.totalSize, status.totalProgress]);

  const remove = () => {
    setLoading(true);
    window.electron.deleteDownload(status.id).then(() => {
      toast.success("Download removed");
      setLoading(false);
    });
  };

  const togglePause = async () => {
    setLoading(true);
    if (status.paused) {
      await window.electron.resumeDownload(status.id);
      toast.success("Download resumed");
    } else {
      await window.electron.pauseDownload(status.id);
      toast.success("Download paused");
    }
    setLoading(false);
  };

  const progress = status.totalSize === 0 ? 0 : (status.totalProgress / status.totalSize) * 100;
  const remaining = status.all - status.completed - status.skipped - status.failed;
  const finished = remaining === 0;
  const state = finished ? "Complete" : status.paused ? "Paused" : "Downloading";

  const details = [
    ["Downloaded", status.completed.toLocaleString()],
    ["Remaining", remaining.toLocaleString()],
    ["Skipped", status.skipped.toLocaleString()],
    ["Failed", status.failed.toLocaleString()],
    ["Throughput", `${status.speed.toFixed(2)} MB/s`],
    ["ETA", !status.paused && !finished ? estimatedTimeLeft : "—"],
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-[#222a42] bg-[#111524]">
      <div className="flex items-center gap-4 p-5">
        <button
          className="button-danger flex h-9 w-9 items-center justify-center rounded-xl"
          onClick={remove}
          disabled={loading}
          aria-label="Delete download"
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </button>

        {!finished && (
          <button
            className="button-secondary flex h-9 w-9 items-center justify-center rounded-xl"
            disabled={loading}
            onClick={togglePause}
            aria-label={status.paused ? "Resume download" : "Pause download"}
          >
            {status.paused ? <PlayArrowRoundedIcon fontSize="small" /> : <PauseRoundedIcon fontSize="small" />}
          </button>
        )}

        <div className="min-w-[170px]">
          <div className="flex items-center gap-2">
            <span className={`status-dot ${finished ? "text-emerald-400" : status.paused ? "text-amber-300" : "text-blue-400"}`} />
            <span className="text-sm font-semibold text-white">{state}</span>
          </div>
          <div className="mt-1 truncate text-xs text-[#8791aa]">Job {status.id.slice(0, 8)}</div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between text-xs text-[#8791aa]">
            <span>{bytesToFileSize(status.totalProgress)} of {bytesToFileSize(status.totalSize)}</span>
            <span className="font-semibold text-[#a6aec2]">{progress.toFixed(0)}%</span>
          </div>
          <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#68708a] transition hover:bg-white/[0.04] hover:text-white"
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          <ExpandMoreRoundedIcon className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-6 border-t border-[#222a42] bg-[#0a0e19]/55">
          {details.map(([label, value], index) => (
            <div key={label} className={`px-5 py-4 ${index > 0 ? "border-l border-[#1d2438]" : ""}`}>
              <div className="text-sm font-semibold text-white">{value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#77819a]">{label}</div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};
