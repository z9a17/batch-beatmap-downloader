import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import AutoAwesomeMotionRoundedIcon from "@mui/icons-material/AutoAwesomeMotionRounded";
import { toast } from "react-toastify";

import { useSettings } from "../context/SettingsProvider";
import { Browse } from "./Browse";
import Button from "./util/Button";
import { Tooltip } from "./util/Tooltip";

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

export const Temporary = () => {
  const { settings } = useSettings();
  const isLazer = settings.clientMode === "lazer";
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
  }, [settings.clientMode]);

  const handleToggle = () => {
    if (isLazer) return;
    window.electron.setSetting("temp", !temp).then(updateData);
  };
  const handleSetTempPath = (path: string) => window.electron.setSetting("tempPath", path).then(updateData);
  const handleResetPath = () => window.electron.resetTempPath().then(updateData);
  const handleSetTempAuto = (auto: boolean) => window.electron.setSetting("autoTemp", auto).then(updateData);

  const handleMoveDownloads = async () => {
    setMoving(true);
    try {
      const result = await window.electron.moveTempDownloads();
      if (result.mode === "lazer") {
        if (result.remaining === 0) {
          toast.success(`${result.imported.toLocaleString()} sets imported into osu!lazer`);
        } else {
          toast.warning(`${result.imported.toLocaleString()} imported; ${result.remaining.toLocaleString()} remain in staging`);
        }
      } else {
        toast.success(`${result.imported.toLocaleString()} archives moved into Songs`);
      }
      updateData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setMoving(false);
    }
  };

  return (
    <section className="content-box">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">{isLazer ? "lazer import staging" : "Temporary download folder"}</h2>
          <p className="panel-description mt-1">
            {isLazer
              ? "Downloads remain here until osu!lazer confirms that they were imported."
              : "Stage incoming archives away from Songs, then move them together to avoid interrupting song selection."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="pill">{tempCount} waiting</span>
          <div className="icon-plain text-faint">
            <AutoAwesomeMotionRoundedIcon />
          </div>
        </div>
      </div>

      <div className="divide-y divide-line">
        <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
          <div>
            <div className="text-sm font-semibold text-ink">Use staging folder</div>
            <div className="mt-1 text-[13px] leading-5 text-mute">{isLazer ? "Required because lazer manages its own file storage." : "Recommended for large queues."}</div>
          </div>
          <Switch {...switchColors} checked={isLazer || temp} disabled={isLazer} onChange={handleToggle} />
        </div>

        {temp && (
          <>
            <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
              <div>
                <div className="text-sm font-semibold text-ink">Staging location</div>
                <div className="mt-1 text-[13px] leading-5 text-mute">{isLazer ? "Any writable folder can be used." : "Must share a drive with your Songs folder."}</div>
              </div>
              <div className="flex min-w-0 items-center gap-3">
                <Browse path={tempPath} update={handleSetTempPath} />
                <Button color="none" className="button-secondary shrink-0" onClick={handleResetPath}>Reset</Button>
                {!tempValid && <span className="pill pill-offline">Invalid path</span>}
              </div>
            </div>

            <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {isLazer ? "Auto import" : "Auto transfer"}
                  <Tooltip title={isLazer ? "Launch osu!lazer and import completed downloads when a queue finishes." : "Move completed archives into the Songs folder automatically when a queue finishes."} />
                </div>
                <div className="mt-1 text-[13px] leading-5 text-mute">{isLazer ? "Import files automatically when the queue finishes." : "Move files automatically when the queue finishes."}</div>
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
          {moving ? (isLazer ? "Importing archives…" : "Moving archives…") : (isLazer ? "Import into osu!lazer" : "Move staged archives")}
        </Button>
      </div>
    </section>
  );
};
