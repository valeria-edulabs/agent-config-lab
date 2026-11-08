// PreToolUse hook (matcher: Bash).
// Reads the tool call as JSON on stdin. Exit 2 = block the call and tell Claude why.
let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let command = '';
  try {
    command = JSON.parse(raw).tool_input?.command || '';
  } catch {
    process.exit(0); // not our business if the input is unexpected
  }

  const rules = [
    {
      pattern: /\brm\s+-[a-zA-Z]*r[a-zA-Z]*f|\brm\s+-[a-zA-Z]*f[a-zA-Z]*r/,
      message: 'rm -rf is blocked in this project. To remove build output, run `npm run clean` instead.',
    },
    {
      pattern: /\bgit\s+push\b.*(--force|-f\b)/,
      message: 'Force-pushing is blocked in this project.',
    },
  ];

  for (const rule of rules) {
    if (rule.pattern.test(command)) {
      console.error(`Blocked by hook: ${rule.message}`);
      process.exit(2);
    }
  }
  process.exit(0);
});
