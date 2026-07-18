import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import AutoAwesomeMotionRoundedIcon from "@mui/icons-material/AutoAwesomeMotionRounded";

import { Browse } from "./Browse";
import Button from "./util/Button";
import { Tooltip } from "./util/Tooltip";

const switchColors = {
  onColor: "#2563eb",
  offColor: "#354155",
  onHandleColor: "#ffffff",
  offHandleColor: "#8f9bad",
  uncheckedIcon: false,
  checkedIcon: false,
  height: 22,
  width: 42,
};

export const Temporary = () => {
  const [temp, setTemp] = useState(true);
  const [tempCount, setTempCount] = useState(0);
  const [tempPath, setTempPath] = useState("");
  const [tempAuto, setTempAuto] = useState(false);
  const [moving, setMoving] = useState(false);
  const [tempValid, setTempValid] = useState(true);
  const [isWindows, setIsWindows] = useState(true);

  const updateData = () => {
    window.electron.getTempData().then((data) => {
      setTemp(data.enabled);
      setTempPath(data.path);
      setTempCount(data.count);
      setTempValid(data.valid);
      setTempAuto(data.auto);
    });
  };

  useEffect(() => {
    updateData();
    window.electron.getPlatform().then((platform) => setIsWindows(platform === "win32"));
  }, []);

  const handleToggle = () => window.electron.setSetting("temp", !temp).then(updateData);
  const handleSetTempPath = (path: string) => window.electron.setSetting("tempPath", path).then(updateData);
  const handleResetPath = () => window.electron.resetTempPath().then(updateData);
  const handleSetTempAuto = (auto: boolean) => window.electron.setSetting("autoTemp", auto).then(updateData);

  const handleMoveDownloads = () => {
    setMoving(true);
    window.electron.moveTempDownloads().then(() => {
      updateData();
      setMoving(false);
    });
  };

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Staging</div>
          <h2 className="panel-title mt-1">Quiet import</h2>
          <p className="panel-description mt-1">
            Stage incoming archives away from Songs, then move them together to avoid interrupting song selection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="pill">{tempCount} waiting</span>
          <div className="icon-plain text-cyan-300">
            <AutoAwesomeMotionRoundedIcon />
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#334055]">
        <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
          <div>
            <div className="text-sm font-semibold text-white">Use staging folder</div>
            <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Recommended for large queues.</div>
          </div>
          <Switch {...switchColors} checked={temp} onChange={handleToggle} />
        </div>

        {temp && (
          <>
            <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
              <div>
                <div className="text-sm font-semibold text-white">Staging location</div>
                <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Must share a drive with your Songs folder.</div>
              </div>
              <div className="flex min-w-0 items-center gap-3">
                <Browse path={tempPath} update={handleSetTempPath} />
                <Button color="none" className="button-secondary shrink-0" onClick={handleResetPath}>Reset</Button>
                {!tempValid && <span className="pill pill-offline">Invalid path</span>}
              </div>
            </div>

            <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  Auto transfer
                  <Tooltip title="Move completed archives into the Songs folder automatically when a queue finishes." />
                </div>
                <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Finish without another manual step.</div>
              </div>
              <Switch {...switchColors} checked={tempAuto} onChange={handleSetTempAuto} />
            </div>
          </>
        )}
      </div>

      {!isWindows && (
        <div className="mt-4 border-l-2 border-amber-400 px-4 py-2 text-[13px] leading-5 text-amber-200/80">
          Cross-filesystem moves behave differently outside Windows; verify the destination before transferring.
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <Button disabled={tempCount === 0 || moving} onClick={handleMoveDownloads}>
          {moving ? "Moving archives…" : "Move staged archives"}
        </Button>
      </div>
    </section>
  );
};
