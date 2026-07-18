import React, { useMemo } from "react";
import { LinearProgress } from "@mui/material";
import DownloadDoneRoundedIcon from "@mui/icons-material/DownloadDoneRounded";
import DownloadingRoundedIcon from "@mui/icons-material/DownloadingRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TimelapseRoundedIcon from "@mui/icons-material/TimelapseRounded";
import { Link } from "react-router-dom";

import { DownloadSummary } from "../components/DownloadSummary";
import { useDownload } from "../context/DownloadProvider";
import { useStatus } from "../context/StatusProvider";

export const Downloads = () => {
  const { downloads } = useDownload();
  const { online } = useStatus();

  const [maps, speed, remaining, progress, completed] = useMemo(() => {
    let maps = 0;
    let remaining = 0;
    let speed = 0;
    let completed = 0;

    for (const download of downloads) {
      maps += download.all;
      completed += download.completed;
      if (download.speed && !download.paused) speed += download.speed;
      remaining += download.all - download.completed - download.failed - download.skipped;
    }

    return [maps, speed, remaining, maps === 0 ? 0 : (maps - remaining) / maps, completed];
  }, [downloads]);

  if (!online) {
    return (
      <div className="page-stack">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] px-6 py-5 text-rose-100">
          <div className="font-semibold">Transfer service is offline</div>
          <div className="mt-1 text-sm text-rose-100/55">Active jobs will remain paused until the inherited backend responds.</div>
        </div>
      </div>
    );
  }

  if (!downloads.length) {
    return (
      <div className="page-stack">
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#303a5a] bg-white/[0.015] p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
            <DownloadingRoundedIcon sx={{ fontSize: 32 }} />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-white">Your queue is clear</h2>
          <p className="mt-2 max-w-md leading-6 text-[#737d98]">Run a catalogue search, review the matches, and send a batch here when it is ready.</p>
          <Link to="/query" className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500">
            Discover beatmaps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="grid grid-cols-4 gap-3">
        <div className="stat-card">
          <DownloadingRoundedIcon className="mb-4 text-violet-300" />
          <div className="stat-value">{maps.toLocaleString()}</div>
          <div className="stat-label">sets across all jobs</div>
        </div>
        <div className="stat-card">
          <TimelapseRoundedIcon className="mb-4 text-cyan-300" />
          <div className="stat-value">{remaining.toLocaleString()}</div>
          <div className="stat-label">sets remaining</div>
        </div>
        <div className="stat-card">
          <DownloadDoneRoundedIcon className="mb-4 text-emerald-300" />
          <div className="stat-value">{completed.toLocaleString()}</div>
          <div className="stat-label">sets completed</div>
        </div>
        <div className="stat-card">
          <SpeedRoundedIcon className="mb-4 text-blue-300" />
          <div className="stat-value">{speed.toFixed(2)}</div>
          <div className="stat-label">MB/s combined</div>
        </div>
      </div>

      <section className="content-box">
        <div className="flex items-center justify-between">
          <div>
            <div className="eyebrow">Aggregate progress</div>
            <div className="mt-1 text-sm font-semibold text-white">{(progress * 100).toFixed(0)}% of queued work resolved</div>
          </div>
          <span className="pill">{downloads.length} active job{downloads.length === 1 ? "" : "s"}</span>
        </div>
        <div className="mt-4"><LinearProgress value={progress * 100} variant="determinate" /></div>
      </section>

      <div className="space-y-3">
        {downloads.map((download) => <DownloadSummary key={download.id} status={download} />)}
      </div>
    </div>
  );
};
