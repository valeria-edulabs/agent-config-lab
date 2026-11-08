#!/usr/bin/env bash
# Creates a small git history (with a tag) so the release-notes skill has
# something to summarize. Safe to run more than once.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -d .git ]; then
  echo "git repo already exists, skipping history setup."
  exit 0
fi

git init -q
git config user.name >/dev/null 2>&1 || git config user.name "Lab Participant"
git config user.email >/dev/null 2>&1 || git config user.email "participant@example.com"

git add -A
git commit -q -m "chore: initial todo API"
git tag v0.1.0

git commit -q --allow-empty -m "feat: add due dates to todos"
git commit -q --allow-empty -m "fix: return 404 for unknown todo ids"
git commit -q --allow-empty -m "feat: add date formatting helper"
git commit -q --allow-empty -m "docs: describe the architecture"
git commit -q --allow-empty -m "refactor: simplify the in-memory store"

echo "Git history created:"
git log --oneline
