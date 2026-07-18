import React, { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";
import DownloadingRoundedIcon from "@mui/icons-material/DownloadingRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import StatusTableRow from "../components/StatusTableRow";
import Table from "../components/util/Table";
import { useStatus } from "../context/StatusProvider";
import { TableHeader } from "../types/table";
import { bytesToFileSize } from "../util/fileSize";

const headers: TableHeader[] = [
  { title: "Total size", key: "Size" },
  { title: "Progress", key: "Progress" },
  { title: "Transfer speed", key: "Speed" },
];

export const Status = () => {
  const { online, metrics, loading } = useStatus();

  const [activeDownloads, currentBandwidth] = useMemo(() => {
    const currentDownloads = metrics?.Download?.CurrentDownloads ?? [];
    return [currentDownloads.filter((item) => item.Active), metrics?.Download?.CurrentBandwidthUsage ?? 0];
  }, [metrics]);

  if (loading) {
    return (
      <div className="page-stack">
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#222a42] bg-white/[0.015]">
          <div className="text-center">
            <CircularProgress size={30} />
            <div className="mt-4 text-sm text-[#737d98]">Checking inherited infrastructure…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!online || !metrics) {
    return (
      <div className="page-stack">
        <div className="flex items-center gap-4 rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-6">
          <CloudOffRoundedIcon className="text-rose-300" />
          <div>
            <div className="font-semibold text-rose-100">Service unavailable</div>
            <div className="mt-1 text-sm text-rose-100/55">The original metadata API did not respond. Local settings and completed files remain untouched.</div>
          </div>
        </div>
      </div>
    );
  }

  const databaseTotal =
    metrics.Database.NumberStoredRanked +
    metrics.Database.NumberStoredLoved +
    metrics.Database.NumberStoredUnranked;

  return (
    <div className="page-stack">
      <section className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.055] px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <CloudDoneRoundedIcon />
          </div>
          <div>
            <div className="font-semibold text-emerald-100">Inherited service online</div>
            <div className="mt-1 text-sm text-emerald-100/50">Metadata queries and archive delivery are responding.</div>
          </div>
        </div>
        <span className="pill pill-online"><span className="status-dot" />Live</span>
      </section>

      <div className="grid grid-cols-4 gap-3">
        <div className="stat-card">
          <DownloadingRoundedIcon className="mb-4 text-blue-300" />
          <div className="stat-value">{activeDownloads.length}</div>
          <div className="stat-label">public active downloads</div>
        </div>
        <div className="stat-card">
          <SpeedRoundedIcon className="mb-4 text-cyan-300" />
          <div className="stat-value">{bytesToFileSize(currentBandwidth)}/s</div>
          <div className="stat-label">current public throughput</div>
        </div>
        <div className="stat-card">
          <DataObjectRoundedIcon className="mb-4 text-blue-300" />
          <div className="stat-value">{databaseTotal.toLocaleString()}</div>
          <div className="stat-label">indexed difficulties</div>
        </div>
        <div className="stat-card">
          <CloudDoneRoundedIcon className="mb-4 text-emerald-300" />
          <div className="stat-value">{metrics.Download.DailyStats.Maps.toLocaleString()}</div>
          <div className="stat-label">sets delivered today</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <section className="content-box">
          <div className="eyebrow">Catalogue snapshot</div>
          <h2 className="panel-title mt-1">Indexed content</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Ranked", metrics.Database.NumberStoredRanked, "bg-blue-400"],
              ["Loved", metrics.Database.NumberStoredLoved, "bg-rose-400"],
              ["Unranked", metrics.Database.NumberStoredUnranked, "bg-cyan-400"],
            ].map(([label, value, color]) => (
              <div key={label as string} className="flex items-center justify-between rounded-xl border border-[#222a42] bg-[#0b0f1b] px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-[#a6aec2]"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</span>
                <span className="text-sm font-semibold text-white">{(value as number).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3 text-[13px] leading-5 text-amber-100/70">
            <WarningAmberRoundedIcon sx={{ fontSize: 16, flexShrink: 0, marginTop: "2px" }} />
            The legacy “last beatmap added” value is the newest approval date, not proof that every status was fully ingested.
          </div>
        </section>

        <section className="content-box">
          <div className="eyebrow">Daily delivery</div>
          <h2 className="panel-title mt-1">Network activity</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#222a42] bg-[#0b0f1b] p-4">
              <div className="text-lg font-semibold text-white">{bytesToFileSize(metrics.Download.DailyStats.Size)}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#77819a]">data delivered</div>
            </div>
            <div className="rounded-xl border border-[#222a42] bg-[#0b0f1b] p-4">
              <div className="text-lg font-semibold text-white">{metrics.Download.DailyStats.Completed.toLocaleString()}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#77819a]">completed jobs</div>
            </div>
            <div className="col-span-2 rounded-xl border border-[#222a42] bg-[#0b0f1b] p-4">
              <div className="text-lg font-semibold text-white">{bytesToFileSize(metrics.Download.DailyStats.Speed)}/s</div>
              <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#77819a]">average completed speed</div>
            </div>
          </div>
        </section>
      </div>

      <section className="content-box no-pad">
        <div className="border-b border-[#222a42] px-6 py-5">
          <div className="eyebrow">Public load</div>
          <div className="mt-1 flex items-baseline justify-between">
            <h2 className="panel-title">Current downloads</h2>
            <span className="text-[13px] text-[#8791aa]">All users of the inherited service</span>
          </div>
        </div>
        {activeDownloads.length ? (
          <Table data={activeDownloads} headers={headers} RenderRow={StatusTableRow} />
        ) : (
          <div className="px-6 py-10 text-center text-[13px] text-[#8791aa]">No public downloads are active right now.</div>
        )}
      </section>
    </div>
  );
};
