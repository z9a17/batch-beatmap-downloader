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
  accent: string;
}

const filters: Filter[] = [
  { name: "Ranked essentials", detail: "All ranked osu!standard sets", tree: allRankedOsu, accent: "#ff66a3" },
  { name: "Loved catalogue", detail: "Community-loved beatmaps", tree: allLoved, accent: "#ff6f7d" },
  { name: "Sotarks collection", detail: "Every indexed Sotarks set", tree: allSotarks, accent: "#e8b25c" },
  { name: "Seven star range", detail: "Ranked maps from 7★ to 8★", tree: allRanked7Star, accent: "#e8d25c" },
  { name: "Stream maps", detail: "Sets tagged for stream patterns", tree: allStream, accent: "#56c98d" },
  { name: "Farm maps", detail: "Sets tagged as performance farm", tree: allFarm, accent: "#ff9e7a" },
];

export const SampleFilters = () => {
  const loadFilter = (filter: Filter) => localStorage.setItem("tree", JSON.stringify(filter.tree));

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <h2 className="panel-title mt-1">Curated searches</h2>
          <p className="panel-description mt-1">Start from a useful filter and refine it in Discover.</p>
        </div>
        <AutoAwesomeRoundedIcon className="text-dim" />
      </div>
      <div className="grid grid-cols-3 border-t border-line">
        {filters.map((filter) => (
          <Link
            onClick={() => loadFilter(filter)}
            to="/query"
            key={filter.name}
            className="panel-interactive group relative min-h-[116px] border-b border-r border-line p-4 first:border-l"
          >
            <div className="mb-4 h-[3px] w-7 rounded-full" style={{ backgroundColor: filter.accent }} />
            <div className="font-semibold text-ink">{filter.name}</div>
            <div className="mt-1 text-[13px] leading-5 text-faint">{filter.detail}</div>
            <ArrowForwardRoundedIcon className="absolute bottom-4 right-4 text-dim transition group-hover:translate-x-0.5 group-hover:text-ink" fontSize="small" />
          </Link>
        ))}
      </div>
    </section>
  );
};
