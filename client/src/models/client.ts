export type OsuClientMode = "stable" | "lazer";

export interface LazerLibraryReaderResponse {
  protocolVersion: number;
  setIds: number[];
  ignoredLocalSets: number;
}

export interface TransferResult {
  requested: number;
  imported: number;
  remaining: number;
  mode: OsuClientMode;
}
