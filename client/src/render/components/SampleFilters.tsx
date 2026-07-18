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
  { name: "Ranked essentials", detail: "All ranked osu!standard sets", tree: allRankedOsu, accent: "#22d3ee" },
  { name: "Loved catalogue", detail: "Community-loved beatmaps", tree: allLoved, accent: "#fb7185" },
  { name: "Sotarks collection", detail: "Every indexed Sotarks set", tree: allSotarks, accent: "#a78bfa" },
  { name: "Seven star range", detail: "Ranked maps from 7★ to 8★", tree: allRanked7Star, accent: "#fb923c" },
  { name: "Stream maps", detail: "Sets tagged for stream patterns", tree: allStream, accent: "#60a5fa" },
  { name: "Farm maps", detail: "Sets tagged as performance farm", tree: allFarm, accent: "#f472b6" },
];

export const SampleFilters = () => {
  const loadFilter = (filter: Filter) => localStorage.setItem("tree", JSON.stringify(filter.tree));

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Quick starts</div>
          <h2 className="panel-title mt-1">Curated searches</h2>
          <p className="panel-description mt-1">Start from a useful filter and refine it in Discover.</p>
        </div>
        <AutoAwesomeRoundedIcon className="text-violet-300" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {filters.map((filter) => (
          <Link
            onClick={() => loadFilter(filter)}
            to="/query"
            key={filter.name}
            className="panel-interactive group relative overflow-hidden rounded-2xl border border-[#222a42] bg-[#0d111e] p-4"
          >
            <div className="mb-5 h-1 w-10 rounded-full" style={{ backgroundColor: filter.accent, boxShadow: `0 0 18px ${filter.accent}` }} />
            <div className="font-semibold text-white">{filter.name}</div>
            <div className="mt-1 text-[13px] leading-5 text-[#8791aa]">{filter.detail}</div>
            <ArrowForwardRoundedIcon className="absolute bottom-4 right-4 text-[#4f5871] transition group-hover:translate-x-0.5 group-hover:text-white" fontSize="small" />
          </Link>
        ))}
      </div>
    </section>
  );
};
