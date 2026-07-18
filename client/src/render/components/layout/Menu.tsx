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
      <div className="flex h-[68px] items-center gap-3 border-b border-[#303c4d] px-[18px]">
        <img src={appIcon} className="h-8 w-8" alt="" />
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold tracking-[-0.025em] text-white">Beatmap Downloader</div>
          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8f9bad]">Community / Windows</div>
        </div>
      </div>

      <nav className="flex-1 overflow-auto px-3 py-6">
        <div className="mb-3 px-[18px] text-[10px] font-bold uppercase tracking-[0.16em] text-[#7d899e]">Workspace</div>
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
                <span className="mt-0.5 block truncate text-[11px] text-[#8d99ac]">{description}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#303c4d] px-[18px] py-4">
        <button
          onClick={() => window.electron.openUrl("https://github.com/z9a17/batch-beatmap-downloader")}
          className="link-row border-t-0 pt-0"
        >
          <span className="flex items-center gap-2"><GitHubIcon fontSize="small" />Project on GitHub</span>
          <span className="text-xs text-[#a4b0c2]">↗</span>
        </button>
        <div className="flex items-center justify-between border-t border-[#303c4d] pt-3">
          <span className={classNames(
            "pill",
            loading
              ? "pill-checking"
              : online
              ? "pill-online"
              : "pill-offline",
          )}>
            <span className="status-dot" />
            {loading ? "Checking service" : online ? "Service online" : "Service offline"}
          </span>
          <span className="font-mono text-[10px] text-[#7d899e]">v{version}</span>
        </div>
      </div>
    </aside>
  );
};
