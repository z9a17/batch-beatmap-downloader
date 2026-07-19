import React from "react";

import { changeLog } from "../assets/changelog";
import { ChangeLogVersion } from "../components/ChangeLogVersion";

export const Changelog = () => (
  <div className="page-stack">
    <section className="hero-block min-h-[150px]">
      <div>
        <h2 className="text-lg font-semibold text-ink">Release notes</h2>
        <p className="mt-1.5 text-[13px] text-mute">Changes in each version, including the original project history.</p>
      </div>
    </section>
    <div>
      {changeLog.map((change, index) => (
        <ChangeLogVersion key={change.version} item={change} latest={index === 0} />
      ))}
    </div>
  </div>
);
