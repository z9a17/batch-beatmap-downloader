import { ipcRenderer } from "electron";

export const handleBrowse = () => ipcRenderer.invoke("browse") as Promise<Electron.OpenDialogReturnValue>;
export const handleOpenUrl = (url: string) => ipcRenderer.invoke("open-url", url) as Promise<void>;
export const handleQuit = () => ipcRenderer.send("quit");
export const handleListenForErrors = (callback: (error: string) => void) => {
  ipcRenderer.on("error", (event, error: string) => {
    callback(error);
  });
};

export const handleListenForServerDown = (callback: (down: boolean) => void) => {
  ipcRenderer.on("server-down", (event, down: boolean) => {
    callback(down);
  });
};

export const handleGetPlatform = () => ipcRenderer.invoke("get-platform") as Promise<NodeJS.Platform>;
