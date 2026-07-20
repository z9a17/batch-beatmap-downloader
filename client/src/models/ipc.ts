import { OsuClientMode } from "./client";

export interface TempData {
  valid: boolean;
  path: string;
  count: number;
  enabled: boolean;
  auto: boolean;
  mode: OsuClientMode;
}
