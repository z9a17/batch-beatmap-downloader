import React from "react";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import { changeLog } from "../assets/changelog";
import { ChangeLogVersion } from "../components/ChangeLogVersion";

export const Changelog = () => (
  <div className="page-stack">
    <section className="flex items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-500/[0.07] px-6 py-5">
      <div>
        <div className="eyebrow">Community timeline</div>
        <h2 className="mt-1 text-lg font-semibold text-white">From maintenance mode to a new foundation</h2>
        <p className="mt-1 text-sm text-[#8d96af]">Every shipped change, including the inherited upstream history.</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
        <HistoryRoundedIcon />
      </div>
    </section>
    <div className="space-y-3">
      {changeLog.map((change, index) => (
        <ChangeLogVersion key={change.date} item={change} latest={index === 0} />
      ))}
    </div>
  </div>
);
