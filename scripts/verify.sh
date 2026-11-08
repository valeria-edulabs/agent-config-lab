#!/usr/bin/env bash
# Checks that your configuration files exist and are valid.
# It can't test the agent's behavior - that's what the "Prove it" steps are for.
# Usage: bash scripts/verify.sh        (all exercises)
#        bash scripts/verify.sh 4      (one exercise)
cd "$(dirname "$0")/.."
ONLY="${1:-}"
pass=0; fail=0

ok()   { echo "  ✅ $1"; pass=$((pass+1)); }
bad()  { echo "  ❌ $1"; fail=$((fail+1)); }
want() { [ -z "$ONLY" ] || [ "$ONLY" = "$1" ]; }

json_has() { # file, js expression on `s` (parsed settings) that must be truthy
  node -e "
    const fs=require('fs');
    let s; try { s=JSON.parse(fs.readFileSync('$1','utf8')); } catch(e) { process.exit(2); }
    process.exit(($2) ? 0 : 1);
  " 2>/dev/null
}

SETTINGS=.claude/settings.json

if want 1; then
  echo "Exercise 1 - CLAUDE.md"
  [ -f CLAUDE.md ] && ok "CLAUDE.md exists" || bad "CLAUDE.md is missing (project root)"
  grep -q "🟢" CLAUDE.md 2>/dev/null && ok "canary 🟢 found" || bad "add the 🟢 canary line"
fi

if want 2; then
  echo "Exercise 2 - path-scoped rule"
  f=$(ls .claude/rules/*.md 2>/dev/null | head -1)
  [ -n "$f" ] && ok "rule file found: $f" || bad "no .md file in .claude/rules/"
  [ -n "$f" ] && head -5 "$f" | grep -q "^paths:" && ok "rule has a paths: frontmatter" || bad "rule needs a 'paths:' frontmatter block at the top"
fi

if want 3; then
  echo "Exercise 3 - skill"
  SK=.claude/skills/release-notes
  [ -f $SK/SKILL.md ] && ok "SKILL.md exists" || bad "missing $SK/SKILL.md"
  grep -q "^description:" $SK/SKILL.md 2>/dev/null && ok "SKILL.md has a description" || bad "SKILL.md needs name + description frontmatter"
  [ -f $SK/scripts/collect-commits.sh ] && ok "helper script exists" || bad "missing $SK/scripts/collect-commits.sh"
  [ -d .git ] && ok "git history exists" || bad "run: bash scripts/setup.sh (creates git history)"
fi

if want 4; then
  echo "Exercise 4 - permissions"
  json_has $SETTINGS "true"; r=$?
  if [ $r -eq 2 ] || [ ! -f $SETTINGS ]; then bad "$SETTINGS missing or not valid JSON"; else
    ok "$SETTINGS is valid JSON"
    json_has $SETTINGS "(s.permissions?.deny||[]).some(x=>x.includes('.env'))" && ok "deny rule for .env" || bad "add a deny rule for Read(./.env)"
    json_has $SETTINGS "(s.permissions?.ask||[]).some(x=>x.includes('git push'))" && ok "ask rule for git push" || bad "add an ask rule for Bash(git push *)"
    json_has $SETTINGS "(s.permissions?.allow||[]).some(x=>x.includes('npm test'))" && ok "allow rule for npm test" || bad "add an allow rule for Bash(npm test)"
  fi
fi

if want 5; then
  echo "Exercise 5 - hooks"
  json_has $SETTINGS "(s.hooks?.PreToolUse||[]).some(h=>h.matcher==='Bash')" && ok "PreToolUse hook on Bash" || bad "add a PreToolUse hook with matcher 'Bash'"
  json_has $SETTINGS "(s.hooks?.PostToolUse||[]).length>0" && ok "PostToolUse hook configured" || bad "add a PostToolUse hook for Edit|Write"
  H=.claude/hooks/block-dangerous.js
  if [ -f $H ]; then
    echo '{"tool_input":{"command":"rm -rf build"}}' | node $H 2>/dev/null; [ $? -eq 2 ] && ok "block hook blocks 'rm -rf' (exit 2)" || bad "block hook should exit 2 for 'rm -rf build'"
    echo '{"tool_input":{"command":"ls -la"}}' | node $H 2>/dev/null; [ $? -eq 0 ] && ok "block hook allows 'ls' (exit 0)" || bad "block hook should exit 0 for 'ls -la'"
  else bad "missing $H"; fi
  [ -d node_modules/prettier ] && ok "prettier installed" || bad "run: npm install (the format hook needs Prettier)"
fi

if want 6; then
  echo "Exercise 6 - sandbox"
  json_has $SETTINGS "s.sandbox?.enabled===true" && ok "sandbox enabled in settings" \
    || echo "  ⚪ sandbox not in project settings (fine if you enabled it with /sandbox instead)"
fi

if want 7; then
  echo "Exercise 7 - subagent"
  A=.claude/agents/code-reviewer.md
  [ -f $A ] && ok "subagent file exists" || bad "missing $A"
  grep -q "^tools:" $A 2>/dev/null && ok "subagent has a tools: list" || bad "add a tools: line (e.g. Read, Grep, Glob)"
  grep -Eq "^tools:.*(Edit|Write|Bash)" $A 2>/dev/null && bad "tools should be read-only (no Edit/Write/Bash)" || true
fi

echo
echo "Passed: $pass   Failed: $fail"
[ $fail -eq 0 ] && echo "Config looks good. Now run the 'Prove it' steps in HANDOUT.md." || exit 1
