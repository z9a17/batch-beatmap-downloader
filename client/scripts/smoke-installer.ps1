$ErrorActionPreference = "Stop"

$installer = Get-ChildItem -Path "out/make" -Filter "BBDCommunity-Setup-*.exe" -File
if ($installer.Count -ne 1) {
  throw "Expected exactly one versioned NSIS installer, found $($installer.Count)."
}

$installDirectory = Join-Path $env:RUNNER_TEMP "bbd-community-installer-smoke"
$expectedExecutable = Join-Path $installDirectory "bbd-community.exe"

$process = Start-Process `
  -FilePath $installer.FullName `
  -ArgumentList @("/S", "/D=$installDirectory") `
  -Wait `
  -PassThru

if ($process.ExitCode -ne 0) {
  throw "NSIS installer exited with code $($process.ExitCode)."
}

if (-not (Test-Path -LiteralPath $expectedExecutable -PathType Leaf)) {
  throw "Installer did not create the expected executable: $expectedExecutable"
}

$desktopShortcutPath = Join-Path ([Environment]::GetFolderPath("Desktop")) "Batch Beatmap Downloader Community.lnk"
if (-not (Test-Path -LiteralPath $desktopShortcutPath -PathType Leaf)) {
  throw "Installer did not create the expected desktop shortcut."
}

$shell = New-Object -ComObject WScript.Shell
$desktopShortcut = $shell.CreateShortcut($desktopShortcutPath)
$resolvedShortcutTarget = [IO.Path]::GetFullPath($desktopShortcut.TargetPath)
$resolvedExpectedExecutable = [IO.Path]::GetFullPath($expectedExecutable)

if ($resolvedShortcutTarget -ne $resolvedExpectedExecutable) {
  throw "Desktop shortcut targets '$resolvedShortcutTarget' instead of '$resolvedExpectedExecutable'."
}

$uninstallEntry = Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*" |
  Where-Object {
    $_.DisplayName -eq "Batch Beatmap Downloader Community" -and
    $_.DisplayVersion -eq (Get-Content package.json | ConvertFrom-Json).version
  } |
  Select-Object -First 1

if ($null -eq $uninstallEntry) {
  throw "Could not find the installed application in the current-user uninstall registry."
}

$displayIconPath = ($uninstallEntry.DisplayIcon -split ",")[0]
if (-not (Test-Path -LiteralPath $displayIconPath -PathType Leaf)) {
  throw "Uninstall metadata points to a missing display icon: $displayIconPath"
}

$env:BBD_SMOKE_EXECUTABLE = $expectedExecutable
& node "scripts/smoke-packaged.mjs"
if ($LASTEXITCODE -ne 0) {
  throw "Installed application smoke test failed with exit code $LASTEXITCODE."
}

Write-Host "Installed NSIS application and shortcut smoke test passed."
