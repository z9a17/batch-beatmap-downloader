# Contributing

Thank you for helping maintain Batch Beatmap Downloader.

## Before opening a change

1. Keep the interface dark-only. Do not add a parallel light theme.
2. Preserve the existing filter, collection, and transfer behavior unless the
   change explicitly replaces it.
3. Do not commit service credentials, OAuth secrets, databases, or downloaded
   beatmap archives.
4. Keep inherited backend behavior clearly distinguished from community-owned
   infrastructure.

## Local checks

Run these from `client/`:

```powershell
npm ci
npm run typecheck
npm run lint
npm run package:win
```

Include screenshots for visible interface changes and describe any migration or
service impact in the pull request.
