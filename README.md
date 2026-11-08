# agent-config-lab

Starter repo for the hands-on **"Configure your agent, then prove it."**

A tiny Node.js todo API with a few things planted on purpose:

| File | Why it's here |
|---|---|
| `.env` | a **fake** secret the agent should never read |
| `test/todos.test.js` | one test **fails on purpose** (bug in `src/api/todos.js`) |
| `src/utils/format-date.js` | **messy formatting** for the formatter hook to clean up |
| `ATTACK.md` | a planted **prompt injection** for the capstone (fake secret, unresolvable URL) |

## Prerequisites

- Node.js 18+ and git
- Claude Code installed and signed in
- macOS, Linux or WSL2 for the sandbox exercise (native Windows isn't supported)

## Setup

```bash
npm install            # installs Prettier for the formatter hook
bash scripts/setup.sh  # creates a small git history for the release-notes skill
npm test               # 2 pass, 1 fails on purpose
```

Then open **[HANDOUT.md](HANDOUT.md)** and start with exercise 1.

## Checking your work

```bash
bash scripts/verify.sh      # all exercises
bash scripts/verify.sh 4    # just one
```

`verify.sh` checks your files; the **Prove it** steps in the handout check the agent's behavior.

## Solutions

Reference solutions live on the **`solutions` branch**, not on `main`, so the agent
can't find them (or load them as live config) while you work.

Stuck? Ask the instructor, or browse the `solutions` branch on GitHub and copy
just the file you need. Don't check out the whole branch into your working folder.
