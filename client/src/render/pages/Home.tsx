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
        <div className="relative z-[1] max-w-3xl">
          <div className="section-kicker mb-5">Community preview</div>
          <h2 className="max-w-2xl text-[36px] font-semibold leading-[1.08] tracking-[-0.055em] text-white">
            Build the beatmap library you actually want.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#b6c0ce]">
            Search by difficulty, metadata, mapper, and play style—then move thousands of sets through one focused queue.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/query" className="flex min-h-[42px] items-center gap-2 rounded-[2px] bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500">
              Discover beatmaps <ArrowForwardRoundedIcon fontSize="small" />
            </Link>
            <Link to="/downloads" className="button-secondary flex min-h-[42px] items-center rounded-[2px] px-5 text-sm font-semibold">
              Open queue
            </Link>
          </div>
        </div>
      </section>

      <div className="metric-strip grid-cols-3">
        <div className="stat-card">
          <LibraryMusicRoundedIcon className="mb-4 text-[#8d99ac]" />
          <div className="stat-value">{beatmapSetCount.toLocaleString()}</div>
          <div className="stat-label">sets detected locally</div>
        </div>
        <div className="stat-card">
          <TuneRoundedIcon className="mb-4 text-blue-300" />
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
