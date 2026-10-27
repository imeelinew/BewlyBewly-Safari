# BewlyBewly Safari

This is a standalone Safari Web Extension project for [BewlyBewly](https://github.com/BewlyBewly/BewlyBewly). The web source follows upstream; the Safari host app and extension target are in `Safari/`.

## Safari adaptations

- Generated the macOS host app and extension target with Apple's Safari Web Extension Converter.
- Converted the Manifest V3 background service worker to a Safari-supported background script.
- Used a web-accessible resource to bridge page scripts in place of Safari's unsupported `content_scripts[].world = "MAIN"`.
- Removed unsupported, unnecessary `persistent` and `match_about_blank` manifest fields.
- Configured the local development team and `dev.eli.bewlybewly.safari` bundle ID for signing and installation.

## Build

Requirements: macOS 12.3 or later, Safari 15.4 or later, Xcode, Node.js, and pnpm 9.5.0 through Corepack.

```sh
pnpm install --frozen-lockfile
pnpm build-safari
pnpm sync-safari
xcodebuild \
  -project "Safari/BewlyBewly Safari/BewlyBewly Safari.xcodeproj" \
  -scheme "BewlyBewly Safari" \
  -configuration Debug \
  -derivedDataPath build/DerivedData \
  CODE_SIGNING_ALLOWED=NO \
  build
```

## Install

```sh
pnpm install-safari
```

The installation script regenerates extension resources, builds and signs with an Apple Development certificate, and installs to `/Applications/BewlyBewly Safari.app`.

After installation, enable **BewlyBewly Safari Extension** in Safari **Settings → Extensions** and choose **Always Allow** for Bilibili.

## Sync upstream

The `upstream` remote points to the original project. After merging upstream updates, run `pnpm install-safari` again to refresh the Safari version.
