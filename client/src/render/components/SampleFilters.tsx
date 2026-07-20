import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import {
  allFarm,
  allLoved,
  allRanked7Star,
  allRankedOsu,
  allSotarks,
  allStream,
  Node,
} from "../../models/filter";

interface Filter {
  name: string;
  detail: string;
  tree: Node;
}

const filters: Filter[] = [
  { name: "Ranked osu!standard", detail: "All indexed ranked osu!standard sets", tree: allRankedOsu },
  { name: "Loved osu!standard", detail: "Loved osu!standard sets", tree: allLoved },
  { name: "Ranked Sotarks maps", detail: "Ranked osu!standard sets mapped by Sotarks", tree: allSotarks },
  { name: "Ranked 7★–8★", detail: "Ranked osu!standard maps from 7★ to 8★", tree: allRanked7Star },
  { name: "Ranked stream maps", detail: "Ranked osu!standard sets tagged as Stream", tree: allStream },
  { name: "Ranked farm maps", detail: "Ranked osu!standard sets tagged as Farm", tree: allFarm },
];

export const SampleFilters = () => {
  const loadFilter = (filter: Filter) => localStorage.setItem("tree", JSON.stringify(filter.tree));

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Search presets</h2>
          <p className="panel-description mt-1">Open Discover with common filters already applied.</p>
        </div>
        <TuneRoundedIcon className="text-dim" sx={{ fontSize: 20 }} />
      </div>
      <div className="grid grid-cols-3 border-t border-line">
        {filters.map((filter) => (
          <Link
            onClick={() => loadFilter(filter)}
            to="/query"
            key={filter.name}
            className="panel-interactive group relative min-h-[104px] border-b border-r border-line p-4 first:border-l"
          >
            <div className="font-semibold text-ink">{filter.name}</div>
            <div className="mt-1 text-[13px] leading-5 text-mute">{filter.detail}</div>
            <ArrowForwardRoundedIcon className="absolute bottom-4 right-4 text-dim transition group-hover:translate-x-0.5 group-hover:text-accent-strong" sx={{ fontSize: 18 }} />
          </Link>
        ))}
      </div>
    </section>
  );
};
