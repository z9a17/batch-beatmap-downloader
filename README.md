# Batch Beatmap Downloader Community

A desktop application for discovering and downloading osu! beatmaps in bulk.

This repository is a community-maintained fork of
[`nzbasic/batch-beatmap-downloader`](https://github.com/nzbasic/batch-beatmap-downloader).
The upstream history is preserved, including the original MIT license.

## Current release

`1.4.0-alpha.6` is the current community preview. It includes:

- a complete blue interface redesign with a restrained, flatter visual system;
- a new blue application icon and a separate Windows application identity;
- a live service indicator that is green online and red offline;
- a current supported Electron runtime and reproducible Windows packaging;
- an NSIS setup wizard with a selectable installation folder;
- verified Windows shortcuts and uninstall metadata that target the installed executable;
- new overview, discovery, queue, service, and release-note workspaces;
- clearer search, result review, transfer setup, and download progress;
- release ownership and update metadata belonging to this fork;
- a packaged-renderer smoke test that prevents blank-window releases.

The current client foundation uses Electron 43, React 19, Material UI 9,
React Router 7, Tailwind CSS 4, TypeScript 6, and ESLint 10.

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

Create the Windows NSIS installer:

```powershell
npm run make:win
```

The community installer is produced as
`BBDCommunity-Setup-<version>.exe`. Its setup wizard lets users choose an
installation folder. It installs alongside the original application instead of
replacing or sharing its Windows application identity.

The NSIS installer replaces the Squirrel package used through
`1.4.0-alpha.3`. Existing alpha users must run the NSIS installer manually once;
subsequent NSIS releases can use the new update metadata.

## Repository layout

```text
api/       Original Go metadata and filter service
client/    Electron, React, and TypeScript desktop application
download/  Original Go download helper
```

The public repository does not contain the production database, private
environment configuration, or deployment credentials.

## AI assistance disclosure

The community redesign and modernization work in this fork has been created
with substantial generative AI assistance, including code, interface copy,
documentation, and release automation. The work is directed and reviewed by
the maintainer, but it can still contain mistakes. Please report anything
suspicious or broken through the repository issue tracker.

## Baseline preservation

- `upstream-v1.3.0` points to the original v1.3.0 release.
- `upstream-main-2023-05-08` points to the upstream branch state used to begin
  this community fork.

## License

MIT. See [LICENSE](LICENSE).
