#!/usr/bin/env bash
# Prints commit subjects since the latest tag (or all commits if there is no tag).
set -euo pipefail
if last_tag=$(git describe --tags --abbrev=0 2>/dev/null); then
  echo "Commits since ${last_tag}:"
  git log "${last_tag}..HEAD" --pretty=format:'- %s' --no-merges
else
  echo "No tags found. All commits:"
  git log --pretty=format:'- %s' --no-merges
fi
echo
