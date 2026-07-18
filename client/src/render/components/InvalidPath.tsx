import React from "react";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

export const InvalidPath = () => (
  <div className="flex items-center gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-5">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
      <ErrorOutlineRoundedIcon />
    </div>
    <div>
      <div className="font-semibold text-amber-100">Connect your osu! installation</div>
      <div className="mt-1 text-sm text-amber-100/55">Choose a valid folder above before searching, comparing collections, or starting downloads.</div>
    </div>
  </div>
);
