# Batch Beatmap Downloader — Community Edition

A dark-first desktop application for discovering and downloading osu! beatmaps in bulk.

This repository is a community-maintained fork of
[`nzbasic/batch-beatmap-downloader`](https://github.com/nzbasic/batch-beatmap-downloader).
The upstream history is preserved, including the original MIT license.

## Current release

`1.4.0-alpha.1` is the first community preview. It focuses on:

- a complete dark-only interface redesign;
- a current supported Electron runtime and reproducible Windows packaging;
- new overview, discovery, queue, service, and release-note workspaces;
- clearer search, result review, transfer setup, and download progress;
- release ownership and update metadata belonging to this fork.

## Important infrastructure note

This preview still uses the original hosted services by default:

- metadata and filtering: `https://v2.nzbasic.com`
- beatmap archives and helper binaries: `https://direct.nzbasic.com`

Those services are not operated by this fork. Override their locations for
development with:

```text
BBD_API_URL=https://your-api.example
BBD_DIRECT_URL=https://your-download-provider.example
```

Database independence and a provider-based archive system are planned follow-up
work. The interface labels inherited service data accordingly.

## Requirements

- Windows 10 or newer for the primary supported build
- Node.js 22
- npm 10
- An existing osu!stable installation, or a compatible folder containing
  `collection.db`

osu!lazer-native storage is not supported in this alpha.

## Development

```powershell
cd client
npm ci
npm run typecheck
npm run lint
npm start
```

Create a packaged Windows directory:

```powershell
npm run package:win
```

Create the Squirrel installer:

```powershell
npm run make:win
```

## Repository layout

```text
api/       Original Go metadata and filter service
client/    Electron, React, and TypeScript desktop application
download/  Original Go download helper
```

The public repository does not contain the production database, private
environment configuration, or deployment credentials.

## Baseline preservation

- `upstream-v1.3.0` points to the original v1.3.0 release.
- `upstream-main-2023-05-08` points to the upstream branch state used to begin
  this community fork.

## License

MIT. See [LICENSE](LICENSE).
