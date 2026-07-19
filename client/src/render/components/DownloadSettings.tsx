import React, { useMemo, useState } from "react";
import Switch from "react-switch";
import { Link } from "react-router-dom";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { toast } from "react-toastify";

import { DownloadDetails } from "../../models/api";
import { bytesToFileSize } from "../util/fileSize";
import Button from "./util/Button";

interface PropTypes {
  result: DownloadDetails;
}

const switchColors = {
  onColor: "#3b82f6",
  offColor: "#262d3d",
  onHandleColor: "#ffffff",
  offHandleColor: "#8a93a6",
  uncheckedIcon: false,
  checkedIcon: false,
  height: 22,
  width: 42,
};

export const DownloadSettings = ({ result }: PropTypes) => {
  const [force, setForce] = useState(false);
  const [collection, setCollection] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const download = () => {
    toast.success("Download queued");
    window.electron.startDownload(force, collectionName);
  };

  const downloadDisabled = useMemo(() => collection && collectionName.trim() === "", [collection, collectionName]);
  const fileSize = useMemo(
    () => bytesToFileSize(force ? result.totalSizeForce : result.totalSize),
    [force, result.totalSizeForce, result.totalSize],
  );
  const setCount = force ? result.setsForce : result.sets;

  return (
    <div>
      <h2 className="panel-title">Download selection</h2>
      <p className="panel-description mt-1">Review this batch before handing it to the transfer queue.</p>

      <div className="mt-5 grid grid-cols-2 border-y border-line">
        <div className="py-4 pr-4">
          <div className="text-lg font-semibold text-ink">{setCount.toLocaleString()}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.08em] text-mute">sets to fetch</div>
        </div>
        <div className="border-l border-line py-4 pl-4">
          <div className="text-lg font-semibold text-ink">{fileSize}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.08em] text-mute">estimated size</div>
        </div>
      </div>

      <div className="mt-5 divide-y divide-line border-y border-line">
        <div className="flex items-center gap-3 py-4">
          <div className="icon-plain">
            <ReplayRoundedIcon fontSize="small" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink">Force every matched set</div>
            <div className="mt-1 text-[13px] leading-5 text-mute">Include archives already detected locally.</div>
          </div>
          <Switch {...switchColors} checked={force} onChange={setForce} />
        </div>

        <div className="py-4">
          <div className="flex items-center gap-3">
            <div className="icon-plain text-faint">
              <PlaylistAddRoundedIcon fontSize="small" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-ink">Create a collection</div>
              <div className="mt-1 text-[13px] leading-5 text-mute">Group downloaded difficulties in osu!stable.</div>
            </div>
            <Switch {...switchColors} checked={collection} onChange={setCollection} />
          </div>
          {collection && (
            <input
              className="mt-3"
              placeholder="Collection name"
              value={collectionName}
              onChange={(event) => setCollectionName(event.target.value)}
            />
          )}
        </div>
      </div>

      {downloadDisabled && <div className="mt-3 text-[13px] text-rose-300">Add a collection name before starting.</div>}

      <Link className={`mt-5 block ${downloadDisabled ? "pointer-events-none" : ""}`} to="/downloads">
        <Button color="green" className="flex w-full items-center justify-center gap-2 py-2.5" onClick={download} disabled={downloadDisabled}>
          <DownloadRoundedIcon sx={{ fontSize: 18 }} />
          Queue {setCount.toLocaleString()} sets
        </Button>
      </Link>
    </div>
  );
};
