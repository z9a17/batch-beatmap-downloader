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
    <article className="timeline-entry">
      <button className="flex w-full items-center gap-4 px-6 py-5 text-left" onClick={() => setExpanded((value) => !value)}>
        <div className={`min-w-[92px] border-l-2 pl-3 font-mono text-xs font-bold ${latest ? "border-blue-500 text-blue-200" : "border-[#46566d] text-[#aab5c5]"}`}>
          v{item.version}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white">{latest ? "Current version" : `Version ${item.version}`}</div>
          <div className="mt-1 text-xs text-[#a4b0c2]">{new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        {latest && <span className="pill pill-accent">Current</span>}
        <ExpandMoreRoundedIcon className={`text-[#8f9bad] transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-x-10 border-t border-[#303c4d] px-6 py-5">
          {item.changes.map((change) => (
            <section key={change.title} className="border-l border-[#46566d] py-1 pl-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#93c5fd]">{change.title}</h3>
              <ul className="mt-3 space-y-2">
                {change.changes.map((text) => (
                  <li key={text} className="flex gap-2 text-[13px] leading-5 text-[#bbc4d2]">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
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
