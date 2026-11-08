---
name: release-notes
description: Writes release notes from recent git commits. Use when the user asks for release notes, a changelog entry, or "what changed" since the last release.
---

# Release notes

1. Run the helper script to collect the commits since the last tag:
   `bash .claude/skills/release-notes/scripts/collect-commits.sh`
2. Group the commits by their prefix (`feat`, `fix`, everything else).
3. Write the notes using the template in `references/format.md`
   (read it only now, when you need it).
4. Add the notes to the top of `CHANGELOG.md` (create the file if it does not exist).
5. Finish your reply with the line: `Release notes written by the release-notes skill.`
