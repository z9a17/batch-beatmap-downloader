import React from "react";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { useSettings } from "../context/SettingsProvider";

export const InvalidPath = () => {
  const { settings } = useSettings();
  const isLazer = settings.clientMode === "lazer";

  return (
    <div className="flat-alert text-amber-300">
      <ErrorOutlineRoundedIcon className="mt-0.5 shrink-0" />
      <div>
        <div className="font-semibold text-amber-100">Connect your osu! installation</div>
        <div className="mt-1 text-sm leading-6 text-amber-100/75">
          {isLazer
            ? "Choose the osu!lazer data folder containing client.realm before searching or starting downloads."
            : "Choose the osu!stable folder containing collection.db before searching, comparing collections, or starting downloads."}
        </div>
      </div>
    </div>
  );
};
