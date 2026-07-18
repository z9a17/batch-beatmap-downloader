import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";

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
  { name: "Ranked osu!standard", detail: "All indexed ranked osu!standard sets", tree: allRankedOsu, accent: "#22d3ee" },
  { name: "Loved", detail: "All indexed Loved beatmaps", tree: allLoved, accent: "#fb7185" },
  { name: "Sotarks", detail: "All indexed sets mapped by Sotarks", tree: allSotarks, accent: "#60a5fa" },
  { name: "Ranked 7★–8★", detail: "Ranked beatmaps from 7★ to 8★", tree: allRanked7Star, accent: "#fb923c" },
  { name: "Stream maps", detail: "Sets tagged for stream patterns", tree: allStream, accent: "#60a5fa" },
  { name: "Farm maps", detail: "Sets tagged as performance farm", tree: allFarm, accent: "#f472b6" },
];

export const SampleFilters = () => {
  const loadFilter = (filter: Filter) => localStorage.setItem("tree", JSON.stringify(filter.tree));

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Presets</div>
          <h2 className="panel-title mt-1">Example filters</h2>
          <p className="panel-description mt-1">Load a preset filter into Discover.</p>
        </div>
        <FilterAltRoundedIcon className="text-[#8d99ac]" />
      </div>
      <div className="grid grid-cols-3 border-t border-[#303c4d]">
        {filters.map((filter) => (
          <Link
            onClick={() => loadFilter(filter)}
            to="/query"
            key={filter.name}
            className="panel-interactive group relative min-h-[116px] border-b border-r border-[#303c4d] p-4 first:border-l"
          >
            <div className="mb-5 h-0.5 w-8" style={{ backgroundColor: filter.accent }} />
            <div className="font-semibold text-white">{filter.name}</div>
            <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">{filter.detail}</div>
            <ArrowForwardRoundedIcon className="absolute bottom-4 right-4 text-[#4f5871] transition group-hover:translate-x-0.5 group-hover:text-white" fontSize="small" />
          </Link>
        ))}
      </div>
    </section>
  );
};
