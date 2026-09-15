#!/bin/zsh

set -euo pipefail

repo_dir="${0:A:h:h}"
project_path="$repo_dir/Safari/BewlyBewly Safari/BewlyBewly Safari.xcodeproj"
derived_data="$repo_dir/build/Install"
product="$derived_data/Build/Products/Release/BewlyBewly Safari.app"
product_extension="$product/Contents/PlugIns/BewlyBewly Safari Extension.appex"
destination="/Applications/BewlyBewly Safari.app"
destination_extension="$destination/Contents/PlugIns/BewlyBewly Safari Extension.appex"
extension_identifier="dev.eli.bewlybewly.safari.Extension"

cd "$repo_dir"
pnpm build-safari
pnpm sync-safari

xcodebuild \
  -quiet \
  -project "$project_path" \
  -scheme "BewlyBewly Safari" \
  -configuration Release \
  -derivedDataPath "$derived_data" \
  build

codesign --verify --deep --strict "$product"

if [[ -e "$destination" ]]; then
  osascript -e 'tell application "BewlyBewly Safari" to quit' 2>/dev/null || true
  osascript -e 'tell application "Finder" to delete POSIX file "/Applications/BewlyBewly Safari.app"'
fi

ditto "$product" "$destination"
pluginkit -r "$product_extension" 2>/dev/null || true
pluginkit -a "$destination_extension"
pluginkit -e use -i "$extension_identifier"
open "$destination"

echo "Installed: $destination"
