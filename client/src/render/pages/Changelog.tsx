import React from "react";

import { changeLog } from "../assets/changelog";
import { ChangeLogVersion } from "../components/ChangeLogVersion";

export const Changelog = () => (
  <div className="page-stack">
    <section className="hero-block min-h-[150px]">
      <div className="relative z-[1]">
        <h2 className="text-lg font-semibold text-ink">From maintenance mode to a new foundation</h2>
        <p className="mt-1.5 text-[13px] text-faint">Every shipped change, including the inherited upstream history.</p>
      </div>
    </section>
    <div className="content-box no-pad">
      {changeLog.map((change, index) => (
        <ChangeLogVersion key={change.version} item={change} latest={index === 0} />
      ))}
    </div>
  </div>
);
