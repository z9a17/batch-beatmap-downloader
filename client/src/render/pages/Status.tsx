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
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="text-center">
            <CircularProgress size={30} />
            <div className="mt-4 text-sm text-faint">Checking service…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!online || !metrics) {
    return (
      <div className="page-stack">
        <div className="flat-alert text-rose-300">
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
      <section className="flat-alert justify-between text-emerald-300">
        <div className="flex items-center gap-4">
          <div className="icon-plain text-emerald-300">
            <CloudDoneRoundedIcon />
          </div>
          <div>
            <div className="font-semibold text-emerald-100">Service online</div>
            <div className="mt-1 text-sm text-emerald-100/50">Metadata queries and archive delivery are responding.</div>
          </div>
        </div>
        <span className="pill pill-online"><span className="status-dot" />Live</span>
      </section>

      <div className="metric-strip grid-cols-4">
        <div className="stat-card">
          <DownloadingRoundedIcon className="mb-3 text-faint" sx={{ fontSize: 20 }} />
          <div className="stat-value">{activeDownloads.length}</div>
          <div className="stat-label">public active downloads</div>
        </div>
        <div className="stat-card">
          <SpeedRoundedIcon className="mb-3 text-faint" sx={{ fontSize: 20 }} />
          <div className="stat-value">{bytesToFileSize(currentBandwidth)}/s</div>
          <div className="stat-label">current public throughput</div>
        </div>
        <div className="stat-card">
          <DataObjectRoundedIcon className="mb-3 text-faint" sx={{ fontSize: 20 }} />
          <div className="stat-value">{databaseTotal.toLocaleString()}</div>
          <div className="stat-label">indexed difficulties</div>
        </div>
        <div className="stat-card">
          <CloudDoneRoundedIcon className="mb-3 text-faint" sx={{ fontSize: 20 }} />
          <div className="stat-value">{metrics.Download.DailyStats.Maps.toLocaleString()}</div>
          <div className="stat-label">sets delivered today</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <section className="content-box">
          <h2 className="panel-title">Indexed content</h2>
          <div className="mt-5">
            {[
              ["Ranked", metrics.Database.NumberStoredRanked, "bg-accent"],
              ["Loved", metrics.Database.NumberStoredLoved, "bg-rose-400"],
              ["Unranked", metrics.Database.NumberStoredUnranked, "bg-slate-500"],
            ].map(([label, value, color]) => (
              <div key={label as string} className="data-row">
                <span className="flex items-center gap-2 text-sm font-semibold text-mute"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</span>
                <span className="text-sm font-semibold text-ink">{(value as number).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 border-l-2 border-amber-400 px-4 py-2 text-[13px] leading-5 text-amber-100/70">
            <WarningAmberRoundedIcon sx={{ fontSize: 16, flexShrink: 0, marginTop: "2px" }} />
            The legacy “last beatmap added” value is the newest approval date, not proof that every status was fully ingested.
          </div>
        </section>

        <section className="content-box">
          <h2 className="panel-title">Network activity</h2>
          <div className="mt-5 grid grid-cols-2 border-y border-line">
            <div className="border-r border-line p-4 pl-0">
              <div className="text-lg font-semibold text-ink">{bytesToFileSize(metrics.Download.DailyStats.Size)}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.08em] text-faint">data delivered</div>
            </div>
            <div className="p-4">
              <div className="text-lg font-semibold text-ink">{metrics.Download.DailyStats.Completed.toLocaleString()}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.08em] text-faint">completed jobs</div>
            </div>
            <div className="col-span-2 border-t border-line p-4 pl-0">
              <div className="text-lg font-semibold text-ink">{bytesToFileSize(metrics.Download.DailyStats.Speed)}/s</div>
              <div className="mt-1 text-xs uppercase tracking-[0.08em] text-faint">average completed speed</div>
            </div>
          </div>
        </section>
      </div>

      <section className="content-box no-pad">
        <div className="border-b border-line px-6 py-5">
          <div className="flex items-baseline justify-between">
            <h2 className="panel-title">Current downloads</h2>
            <span className="text-[13px] text-mute">All users of the inherited service</span>
          </div>
        </div>
        {activeDownloads.length ? (
          <Table data={activeDownloads} headers={headers} RenderRow={StatusTableRow} />
        ) : (
          <div className="px-6 py-10 text-center text-[13px] text-mute">No public downloads are active right now.</div>
        )}
      </section>
    </div>
  );
};
