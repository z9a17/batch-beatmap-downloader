import { debounce } from "lodash";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { OsuClientMode } from "../../models/client";

interface SettingsObject {
  clientMode: OsuClientMode;
  path: string;
  stablePath: string;
  lazerPath: string;
  lazerExecutablePath: string;
  validLazerExecutable: boolean;
  altPath: string;
  altPathEnabled: boolean;
  beatmapSetCount: number;
  maxConcurrentDownloads: number;
  validPath: boolean;
  autoTransfer: boolean;
  beatmapScanError: string;
}

export interface Settings {
  settings: SettingsObject
  refresh: () => Promise<void>;
  setClientMode: (mode: OsuClientMode) => Promise<void>;
  setPath: (path: string) => Promise<void>;
  setLazerExecutablePath: (path: string) => Promise<void>;
  setAltPathEnabled: (enabled: boolean) => void;
  setAltPath: (path: string) => void;
  setMaxConcurrentDownloads: (number: number) => void;
}

const defaultSettings: SettingsObject = {
  clientMode: "stable",
  path: "",
  stablePath: "",
  lazerPath: "",
  lazerExecutablePath: "",
  validLazerExecutable: false,
  altPath: "",
  altPathEnabled: false,
  beatmapSetCount: 0,
  maxConcurrentDownloads: 5,
  validPath: false,
  autoTransfer: false,
  beatmapScanError: "",
};

const defaultContext: Settings = {
  settings: defaultSettings,
  refresh: () => Promise.resolve(),
  setClientMode: () => Promise.resolve(),
  setPath: () => Promise.resolve(),
  setLazerExecutablePath: () => Promise.resolve(),
  setAltPathEnabled: () => undefined,
  setAltPath: () => undefined,
  setMaxConcurrentDownloads: () => undefined,
};

export const SettingsContext = createContext<Settings>(defaultContext);

const normalizeSettings = (value: unknown): SettingsObject => {
  const data = value as Record<string, unknown>;
  return {
    clientMode: data.clientMode === "lazer" ? "lazer" : "stable",
    path: data.path as string ?? "",
    stablePath: data.stablePath as string ?? "",
    lazerPath: data.lazerPath as string ?? "",
    lazerExecutablePath: data.lazerExecutablePath as string ?? "",
    validLazerExecutable: data.validLazerExecutable as boolean ?? false,
    altPath: data.altPath as string ?? "",
    altPathEnabled: data.altPathEnabled as boolean ?? false,
    beatmapSetCount: data.sets as number ?? 0,
    maxConcurrentDownloads: data.maxConcurrentDownloads as number ?? 5,
    validPath: data.validPath as boolean ?? false,
    autoTransfer: data.autoTransfer as boolean ?? false,
    beatmapScanError: data.beatmapScanError as string ?? "",
  };
};

const SettingsProvider = ({ children }: React.PropsWithChildren) => {
  const [currentSettings, setCurrentSettings] = useState(defaultSettings);

  const refresh = useCallback(async () => {
    const result = await window.electron.getSettings();
    setCurrentSettings(normalizeSettings(result));
  }, []);

  useEffect(() => {
    refresh();
    document.documentElement.classList.add("dark");
  }, [refresh]);

  const handleSetClientMode = async (clientMode: OsuClientMode) => {
    await window.electron.setSetting("clientMode", clientMode);
    await refresh();
  };

  const handleSetPath = async (clientPath: string) => {
    await window.electron.setSetting("path", clientPath);
    await refresh();
  };

  const handleSetLazerExecutablePath = async (executablePath: string) => {
    await window.electron.setSetting("lazerExecutablePath", executablePath);
    await refresh();
  };

  const handleSetAltPath = async (alternatePath: string) => {
    const beatmapSetCount = await window.electron.setSetting("altPath", alternatePath);
    setCurrentSettings((previous) => ({
      ...previous,
      altPath: alternatePath,
      beatmapSetCount,
    }));
  };

  const handleSetAltPathEnabled = async (enabled: boolean) => {
    const beatmapSetCount = await window.electron.setSetting("altPathEnabled", enabled);
    setCurrentSettings((previous) => ({
      ...previous,
      altPathEnabled: enabled,
      beatmapSetCount,
    }));
  };

  const debouncedSetMaxConcurrentDownloads = useMemo(
    () => debounce(
      (value: number) => window.electron.setSetting("maxConcurrentDownloads", value),
      500,
    ),
    [],
  );

  useEffect(() => () => debouncedSetMaxConcurrentDownloads.cancel(), [debouncedSetMaxConcurrentDownloads]);

  const handleSetMaxConcurrentDownloads = (number: number) => {
    debouncedSetMaxConcurrentDownloads(number);
    setCurrentSettings((previous) => ({
      ...previous,
      maxConcurrentDownloads: number,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        refresh,
        setClientMode: handleSetClientMode,
        setPath: handleSetPath,
        setLazerExecutablePath: handleSetLazerExecutablePath,
        setAltPathEnabled: handleSetAltPathEnabled,
        setAltPath: handleSetAltPath,
        setMaxConcurrentDownloads: handleSetMaxConcurrentDownloads,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsProvider;
