import React from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";

import { useStatus } from "../../context/StatusProvider";

interface PropTypes {
  version: string;
}

const pages = [
  { link: "/", title: "Overview", description: "Setup and shortcuts", icon: <DashboardRoundedIcon /> },
  { link: "/query", title: "Discover", description: "Search the catalogue", icon: <ExploreRoundedIcon /> },
  { link: "/downloads", title: "Downloads", description: "Transfer activity", icon: <DownloadRoundedIcon /> },
  { link: "/status", title: "Service", description: "Backend health", icon: <StorageRoundedIcon /> },
  { link: "/changelog", title: "Release notes", description: "Version history", icon: <HistoryRoundedIcon /> },
];

export const Menu = ({ version }: PropTypes) => {
  const { pathname } = useLocation();
  const { online } = useStatus();

  return (
    <aside className="app-sidebar flex h-screen flex-col">
      <div className="flex h-[74px] items-center gap-3 border-b border-[#222a42]/60 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-black text-white shadow-lg shadow-violet-950/50">
          B
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold tracking-[-0.03em] text-white">Beatmap Downloader</div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#747d97]">Community edition</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-auto px-3 py-5">
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#545d77]">Workspace</div>
        {pages.map(({ link, title, description, icon }) => {
          const active = pathname === link;
          return (
            <Link
              key={link}
              to={link}
              className={classNames(
                "group flex items-center gap-3 rounded-xl border px-3 py-3 transition-all",
                active
                  ? "border-violet-500/25 bg-violet-500/10 text-white shadow-inner shadow-violet-500/5"
                  : "border-transparent text-[#8d96af] hover:border-[#222a42] hover:bg-white/[0.025] hover:text-white",
              )}
            >
              <span className={classNames("flex h-9 w-9 items-center justify-center rounded-lg", active ? "bg-violet-500/15 text-violet-300" : "bg-white/[0.03] text-[#68708a] group-hover:text-[#b1b8cc]")}>
                {icon}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold">{title}</span>
                <span className="mt-0.5 block truncate text-[10px] text-[#626b84]">{description}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-[#222a42]/60 p-4">
        <button
          onClick={() => window.electron.openUrl("https://github.com/z9a17/batch-beatmap-downloader")}
          className="flex w-full items-center justify-between rounded-xl border border-[#222a42] bg-white/[0.02] px-3 py-2.5 text-xs font-semibold text-[#a6aec2] transition hover:border-[#303a5a] hover:bg-white/[0.045] hover:text-white"
        >
          <span className="flex items-center gap-2"><GitHubIcon fontSize="small" />Project on GitHub</span>
          <span className="text-[10px] text-[#626b84]">↗</span>
        </button>
        <div className="flex items-center justify-between px-1">
          <span className={classNames("pill border-0 bg-transparent p-0", online ? "text-emerald-400" : "text-rose-400")}>
            <span className="status-dot" />
            {online ? "Service online" : "Service offline"}
          </span>
          <span className="text-[10px] font-medium text-[#545d77]">v{version}</span>
        </div>
      </div>
    </aside>
  );
};
