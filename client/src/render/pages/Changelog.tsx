import React from "react";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import { changeLog } from "../assets/changelog";
import { ChangeLogVersion } from "../components/ChangeLogVersion";

export const Changelog = () => (
  <div className="page-stack">
    <section className="hero-block min-h-[190px]">
      <div>
        <div className="section-kicker">Version history</div>
        <h2 className="mt-1 text-lg font-semibold text-white">Release notes</h2>
        <p className="mt-1 text-sm text-[#aab5c5]">Changes in each version, including the original project history.</p>
      </div>
      <HistoryRoundedIcon className="ml-auto text-blue-300" />
    </section>
    <div>
      {changeLog.map((change, index) => (
        <ChangeLogVersion key={change.version} item={change} latest={index === 0} />
      ))}
    </div>
  </div>
);
