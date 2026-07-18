import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
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

      <section className="rounded-[18px] border border-[#2a3150] bg-[#111524] p-7">
        <div className="max-w-3xl">
          <div className="pill mb-5 border-violet-500/25 bg-violet-500/10 text-violet-200">
            <BoltRoundedIcon sx={{ fontSize: 15 }} />
            Community preview
          </div>
          <h2 className="max-w-2xl text-[36px] font-semibold leading-[1.08] tracking-[-0.055em] text-white">
            Build the beatmap library you actually want.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#9ca5bc]">
            Search by difficulty, metadata, mapper, and play style—then move thousands of sets through one focused queue.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/query" className="flex min-h-[42px] items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500">
              Discover beatmaps <ArrowForwardRoundedIcon fontSize="small" />
            </Link>
            <Link to="/downloads" className="button-secondary flex min-h-[42px] items-center rounded-xl px-5 text-sm font-semibold">
              Open queue
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <LibraryMusicRoundedIcon className="mb-4 text-[#a6aec2]" />
          <div className="stat-value">{beatmapSetCount.toLocaleString()}</div>
          <div className="stat-label">sets detected locally</div>
        </div>
        <div className="stat-card">
          <TuneRoundedIcon className="mb-4 text-violet-300" />
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
