import React, { useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import { ChangeLogItem } from "../assets/changelog";

interface PropTypes {
  item: ChangeLogItem;
  latest?: boolean;
}

export const ChangeLogVersion = ({ item, latest = false }: PropTypes) => {
  const [expanded, setExpanded] = useState(latest);

  return (
    <article className="overflow-hidden rounded-2xl border border-[#222a42] bg-gradient-to-br from-[#131729] to-[#0e121f]">
      <button className="flex w-full items-center gap-4 px-6 py-5 text-left" onClick={() => setExpanded((value) => !value)}>
        <div className={`flex h-10 min-w-[78px] items-center justify-center rounded-xl text-xs font-bold ${latest ? "bg-violet-500/15 text-violet-200" : "bg-white/[0.035] text-[#8d96af]"}`}>
          v{item.version}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white">{latest ? "Latest community build" : `Version ${item.version}`}</div>
          <div className="mt-1 text-[11px] text-[#626b84]">{new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        {latest && <span className="pill border-violet-500/20 text-violet-200">Current</span>}
        <ExpandMoreRoundedIcon className={`text-[#68708a] transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-4 border-t border-[#222a42] bg-[#0a0e19]/45 p-6">
          {item.changes.map((change) => (
            <section key={change.title} className="rounded-xl border border-[#1d2438] bg-white/[0.015] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#b4a5ef]">{change.title}</h3>
              <ul className="mt-3 space-y-2">
                {change.changes.map((text) => (
                  <li key={text} className="flex gap-2 text-xs leading-5 text-[#8d96af]">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </article>
  );
};
