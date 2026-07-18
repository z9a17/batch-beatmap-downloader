import React from "react";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import { changeLog } from "../assets/changelog";
import { ChangeLogVersion } from "../components/ChangeLogVersion";

export const Changelog = () => (
  <div className="page-stack">
    <section className="hero-block min-h-[190px]">
      <div>
        <div className="section-kicker">Community timeline</div>
        <h2 className="mt-1 text-lg font-semibold text-white">From maintenance mode to a new foundation</h2>
        <p className="mt-1 text-sm text-[#aab5c5]">Every shipped change, including the inherited upstream history.</p>
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
