#!/bin/zsh

set -euo pipefail

repo_dir="${0:A:h:h}"
source_dir="$repo_dir/extension-safari"
resources_dir="$repo_dir/Safari/BewlyBewly Safari/BewlyBewly Safari Extension/Resources"

if [[ ! -f "$source_dir/manifest.json" ]]; then
  echo "Missing Safari build output. Run 'pnpm build-safari' first." >&2
  exit 1
fi

mkdir -p "$resources_dir"
rsync -a --delete "$source_dir/" "$resources_dir/"

echo "Synced Safari extension resources."
