import CircularProgress from "@mui/material/CircularProgress";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { MissingMaps } from "../../models/api";
import { bytesToFileSize } from "../util/fileSize";
import Button from "./util/Button";

export const FindMissingMaps = () => {
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState<MissingMaps | null>(null);

  const checkCollections = useCallback(async () => {
    setLoading(true);
    setMissing(null);
    setMissing(await window.electron.checkCollections());
    setLoading(false);
  }, []);

  const download = useCallback(() => {
    window.electron.createDownload(missing?.ids ?? [], missing?.totalSize ?? 0, false, [], "");
  }, [missing]);

  return (
    <section className="content-box">
      <div className="panel-header mb-0">
        <div>
          <h2 className="panel-title mt-1">Find missing beatmaps</h2>
          <p className="panel-description mt-1">Compare collection.db with your local Songs folder and recover indexed gaps.</p>
        </div>
        <div className="icon-plain text-emerald-300">
          <PlaylistAddCheckRoundedIcon />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={checkCollections} disabled={loading}>
          {loading ? "Scanning collections…" : "Scan collections"}
        </Button>
        {loading && <CircularProgress size={22} />}
        {missing && (
          <span className="pill">
            {missing.ids.length} available · {bytesToFileSize(missing.totalSize)}
          </span>
        )}
        {missing && missing.ids.length > 0 && (
          <Link className="ml-auto" to="/downloads">
            <Button onClick={download} disabled={loading} color="green">Queue missing sets</Button>
          </Link>
        )}
      </div>
    </section>
  );
};
