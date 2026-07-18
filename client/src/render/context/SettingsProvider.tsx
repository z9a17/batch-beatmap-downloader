import { debounce } from 'lodash';
import React, {
  useState, createContext, useEffect, useContext,
} from 'react';

interface SettingsObject {
  path: string;
  altPath: string;
  altPathEnabled: boolean;
  beatmapSetCount: number;
  maxConcurrentDownloads: number;
  validPath: boolean;
  autoTransfer: boolean;
}

export interface Settings {
  settings: SettingsObject

  setPath: (path: string) => void;
  setAltPathEnabled: (enabled: boolean) => void;
  setAltPath: (path: string) => void;
  setMaxConcurrentDownloads: (number: number) => void;
}

const defaultContext: Settings = {
  settings: {
    path: "",
    altPath: "",
    altPathEnabled: false,
    beatmapSetCount: 0,
    maxConcurrentDownloads: 5,
    validPath: false,
    autoTransfer: false,
  },

  setPath: () => null,
  setAltPathEnabled: () => null,
  setAltPath: () => null,
  setMaxConcurrentDownloads: () => null,
};

export const SettingsContext = createContext<Settings>(defaultContext);

const SettingsProvider = ({ children }: React.PropsWithChildren) => {
  const [settings, setSettings] = useState(defaultContext.settings)

  useEffect(() => {
    window.electron.getSettings().then((res) => {
      setSettings({
        path: res.path as string ?? "",
        altPath: res.altPath as string ?? "",
        altPathEnabled: res.altPathEnabled as boolean ?? false,
        beatmapSetCount: res.sets as number ?? 0,
        maxConcurrentDownloads: res.maxConcurrentDownloads as number ?? 5,
        validPath: res.validPath as boolean ?? false,
        autoTransfer: res.autoTransfer as boolean ?? false,
      })
      document.documentElement.classList.add("dark");
    })
  }, []);

  const handleSetPath = async (path: string) => {
    const [validPath, beatmapSetCount] = await window.electron.setSetting("path", path)
    setSettings(prev => ({
      ...prev,
      path,
      validPath,
      beatmapSetCount
    }))
  }

  const handleSetAltPath = async (path: string) => {
    const beatmapSetCount = await window.electron.setSetting("altPath", path)
    setSettings(prev => ({
      ...prev,
      altPath: path,
      beatmapSetCount
    }))
  }

  const handleSetAltPathEnabled = async (enabled: boolean) => {
    const beatmapSetCount = await window.electron.setSetting("altPathEnabled", enabled)
    setSettings(prev => ({
      ...prev,
      altPathEnabled: enabled,
      beatmapSetCount
    }))
  }

  const debouncedSetMaxConcurrentDownloads = debounce((value: number) => window.electron.setSetting("maxConcurrentDownloads", value), 500)

  const handleSetMaxConcurrentDownloads = (number: number) => {
    debouncedSetMaxConcurrentDownloads(number)
    setSettings(prev => ({
      ...prev,
      maxConcurrentDownloads: number
    }))
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setPath: handleSetPath,
        setAltPathEnabled: handleSetAltPathEnabled,
        setAltPath: handleSetAltPath,
        setMaxConcurrentDownloads: handleSetMaxConcurrentDownloads,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext)

export default SettingsProvider;
