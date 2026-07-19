import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

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
  { name: "Loved", detail: "All indexed Loved beatmaps", tree: allLoved },
  { name: "Sotarks", detail: "All indexed sets mapped by Sotarks", tree: allSotarks },
  { name: "Ranked 7★–8★", detail: "Ranked beatmaps from 7★ to 8★", tree: allRanked7Star },
  { name: "Stream maps", detail: "Sets tagged for stream patterns", tree: allStream },
  { name: "Farm maps", detail: "Sets tagged as performance farm", tree: allFarm },
];

export const SampleFilters = () => {
  const loadFilter = (filter: Filter) => localStorage.setItem("tree", JSON.stringify(filter.tree));

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Curated searches</h2>
          <p className="panel-description mt-1">Start from a useful filter and refine it in Discover.</p>
        </div>
        <AutoAwesomeRoundedIcon className="text-dim" sx={{ fontSize: 20 }} />
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
