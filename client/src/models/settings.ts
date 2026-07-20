import { OsuClientMode } from "./client";

export type SettingType = {
  darkMode: (value: boolean) => Promise<void>
  maxConcurrentDownloads: (value: number) => Promise<void>
  altPath: (value: string) => Promise<number>
  altPathEnabled: (value: boolean) => Promise<number>
  clientMode: (value: OsuClientMode) => Promise<number>
  path: (value: string) => Promise<[boolean, number]>
  lazerExecutablePath: (value: string) => Promise<boolean>
  temp: (value: boolean) => Promise<void>
  tempPath: (value: string) => Promise<void>
  autoTemp: (value: boolean) => Promise<void>
}
