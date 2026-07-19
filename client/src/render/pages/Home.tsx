import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import { BasicStatus } from "../components/BasicStatus";
import { InvalidPath } from "../components/InvalidPath";
import { FindMissingMaps } from "../components/MissingMaps";
import { SampleFilters } from "../components/SampleFilters";
import { Settings } from "../components/Settings";
import { Temporary } from "../components/Temporary";
import { useSettings } from "../context/SettingsProvider";

export const Home = () => {
  const { settings } = useSettings();
  const { validPath, beatmapSetCount, maxConcurrentDownloads } = settings;

  return (
    <div className="page-stack">
      {!validPath && <InvalidPath />}

      <section className="hero-block">
        <div className="relative z-[1] max-w-2xl">
          <h2 className="max-w-xl text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
            Build the beatmap library you actually want.
          </h2>
          <p className="mt-3 max-w-xl text-[14px] leading-6 text-mute">
            Search by difficulty, metadata, mapper, and play style — then move thousands of sets through one focused queue.
          </p>
          <div className="mt-6 flex items-center gap-2.5">
            <Link to="/query" className="button-primary flex min-h-[38px] items-center gap-2 px-4 text-[13px] font-semibold">
              Discover beatmaps <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
            </Link>
            <Link to="/downloads" className="button-secondary flex min-h-[38px] items-center px-4 text-[13px] font-semibold">
              Open queue
            </Link>
          </div>
        </div>
      </section>

      <div className="metric-strip grid-cols-3">
        <div className="stat-card">
          <LibraryMusicRoundedIcon className="mb-3 text-faint" />
          <div className="stat-value">{beatmapSetCount.toLocaleString()}</div>
          <div className="stat-label">sets detected locally</div>
        </div>
        <div className="stat-card">
          <TuneRoundedIcon className="mb-3 text-faint" />
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
          <FindMissingMaps />
        </>
      )}
    </div>
  );
};
