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
import appIcon from "../../assets/bbd.png";

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
  const { loading, online } = useStatus();

  return (
    <aside className="app-sidebar flex h-screen flex-col">
      <div className="flex h-[60px] items-center gap-3 border-b border-line px-4">
        <img src={appIcon} className="h-9 w-9 rounded-[9px]" alt="" />
        <div className="min-w-0">
          <div className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-ink">Beatmap Downloader</div>
          <div className="mt-px text-[11px] text-faint">Community edition</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-auto px-2.5 py-3">
        {pages.map(({ link, title, description, icon }) => {
          const active = pathname === link;
          return (
            <Link
              key={link}
              to={link}
              className={classNames("nav-entry", active && "nav-entry-active")}
            >
              <span className="nav-icon">{icon}</span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold">{title}</span>
                <span className={classNames("mt-px block truncate text-[11px]", active ? "text-accent/80" : "text-dim")}>{description}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line px-4 py-3.5">
        <button
          onClick={() => window.electron.openUrl("https://github.com/z9a17/batch-beatmap-downloader")}
          className="link-row border-t-0 pt-0"
        >
          <span className="flex items-center gap-2"><GitHubIcon sx={{ fontSize: 16 }} />Project on GitHub</span>
          <span className="text-xs text-dim">↗</span>
        </button>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className={classNames(
            "pill",
            loading
              ? "pill-checking"
              : online
              ? "pill-online"
              : "pill-offline",
          )}>
            <span className="status-dot" />
            {loading ? "Checking" : online ? "Online" : "Offline"}
          </span>
          <span className="font-mono text-[10px] text-dim">v{version}</span>
        </div>
      </div>
    </aside>
  );
};
