import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import { BasicStatus } from "../components/BasicStatus";
import { InvalidPath } from "../components/InvalidPath";
import { FindMissingMaps } from "../components/MissingMaps";
import { SampleFilters } from "../components/SampleFilters";
import { Settings } from "../components/Settings";
import { Temporary } from "../components/Temporary";
import { useSettings } from "../context/SettingsProvider";

export const Home = () => {
  const { settings } = useSettings();
  const { validPath, beatmapSetCount, maxConcurrentDownloads, clientMode, validLazerExecutable } = settings;
  const isLazer = clientMode === "lazer";

  return (
    <div className="page-stack">
      {!validPath && <InvalidPath />}
      {validPath && isLazer && !validLazerExecutable && (
        <div className="flat-alert text-amber-300">
          <ErrorOutlineRoundedIcon className="mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-amber-100">Select the osu!lazer executable</div>
            <div className="mt-1 text-sm leading-6 text-amber-100/75">Downloads can be staged, but they cannot be imported until osu!.exe is connected below.</div>
          </div>
        </div>
      )}

      <section className="hero-block">
        <div className="max-w-2xl">
          <h2 className="max-w-xl text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink">
            Search and download osu! beatmaps in bulk.
          </h2>
          <p className="mt-3 max-w-xl text-[14px] leading-6 text-mute">
            Configure {isLazer ? "the lazer data folder and executable" : "your stable folders"} below, then search the indexed catalogue by difficulty, metadata, mapper, or play style.
          </p>
          <div className="mt-6 flex items-center gap-2.5">
            <Link to="/query" className="button-primary flex min-h-[38px] items-center gap-2 px-4 text-[13px]">
              Search beatmaps <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
            </Link>
            <Link to="/downloads" className="button-secondary flex min-h-[38px] items-center px-4 text-[13px]">
              Open queue
            </Link>
          </div>
        </div>
      </section>

      <div className="metric-strip grid-cols-3">
        <div className="stat-card">
          <LibraryMusicRoundedIcon className="mb-3 text-faint" sx={{ fontSize: 20 }} />
          <div className="stat-value">{beatmapSetCount.toLocaleString()}</div>
          <div className="stat-label">sets detected in {isLazer ? "lazer" : "stable"}</div>
        </div>
        <div className="stat-card">
          <TuneRoundedIcon className="mb-3 text-faint" sx={{ fontSize: 20 }} />
          <div className="stat-value">{maxConcurrentDownloads ?? 5}</div>
          <div className="stat-label">parallel transfer slots</div>
        </div>
        <BasicStatus compact />
      </div>

      <Settings />
      <Temporary />

      {validPath && (
        <>
          <SampleFilters />
          {settings.clientMode === "stable" && <FindMissingMaps />}
        </>
      )}
    </div>
  );
};
