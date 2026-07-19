import React from "react";
import { CircularProgress } from "@mui/material";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import { Link } from "react-router-dom";
import { useStatus } from "../context/StatusProvider";

interface Props {
  compact?: boolean;
}

export const BasicStatus = ({ compact = false }: Props) => {
  const { loading, online, metrics } = useStatus();
  const active = (metrics?.Download?.CurrentDownloads ?? []).filter((item) => item.Active).length;

  if (compact) {
    return (
      <Link
        to="/status"
        className="stat-card panel-interactive block"
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : online ? (
          <CloudDoneRoundedIcon className="mb-4 text-emerald-300" />
        ) : (
          <CloudOffRoundedIcon className="mb-4 text-rose-300" />
        )}
        <div className="stat-value">{loading ? "Checking" : online ? "Online" : "Offline"}</div>
        <div className="stat-label">{online ? `${active} active public transfer${active === 1 ? "" : "s"}` : "inherited backend unavailable"}</div>
      </Link>
    );
  }

  return (
    <section className="content-box">
      <div className="panel-header mb-0">
        <div>
          <h2 className="panel-title mt-1">Inherited service</h2>
          <p className="panel-description mt-1">This alpha still uses the original metadata and delivery backend.</p>
        </div>
        <span className={`pill ${loading ? "pill-checking" : online ? "pill-online" : "pill-offline"}`}>
          <span className="status-dot" />{loading ? "Checking" : online ? "Online" : "Offline"}
        </span>
      </div>
    </section>
  );
};
