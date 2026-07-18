import React from "react";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

export const InvalidPath = () => (
  <div className="flat-alert text-amber-300">
    <ErrorOutlineRoundedIcon className="mt-0.5 shrink-0" />
    <div>
      <div className="font-semibold text-amber-100">Connect your osu! installation</div>
      <div className="mt-1 text-sm leading-6 text-amber-100/75">Choose a valid folder below before searching, comparing collections, or starting downloads.</div>
    </div>
  </div>
);
