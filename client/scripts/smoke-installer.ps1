$ErrorActionPreference = "Stop"

$packageVersion = (Get-Content package.json | ConvertFrom-Json).version
$installer = Get-ChildItem -Path "out/make" -Filter "BBDCommunity-Setup-$packageVersion.exe" -File
if ($installer.Count -ne 1) {
  throw "Expected exactly one versioned NSIS installer, found $($installer.Count)."
}

$installDirectory = Join-Path $env:RUNNER_TEMP "bbd-community-installer-smoke"
$expectedExecutable = Join-Path $installDirectory "bbd-community.exe"
$expectedLazerReader = Join-Path $installDirectory "resources\lazer-library-reader.exe"

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

if (-not (Test-Path -LiteralPath $expectedLazerReader -PathType Leaf)) {
  throw "Installer did not include the osu!lazer library reader: $expectedLazerReader"
}

$readerVersion = & $expectedLazerReader --version | ConvertFrom-Json
if ($readerVersion.protocolVersion -ne 1) {
  throw "Installed osu!lazer library reader returned an unexpected protocol version."
}

$readerSelfTest = & $expectedLazerReader --self-test | ConvertFrom-Json
if (-not $readerSelfTest.realmAvailable) {
  throw "Installed osu!lazer library reader could not initialize Realm."
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
    $_.DisplayVersion -eq $packageVersion
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
