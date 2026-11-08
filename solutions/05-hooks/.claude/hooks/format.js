// PostToolUse hook (matcher: Edit|Write).
// Formats the file Claude just changed with the project's local Prettier.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  try {
    filePath = JSON.parse(raw).tool_input?.file_path || '';
  } catch {
    process.exit(0);
  }
  if (!/\.(js|json|md)$/.test(filePath)) process.exit(0);

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const prettier = path.join(projectDir, 'node_modules', '.bin', 'prettier');
  if (!fs.existsSync(prettier)) {
    console.error('format hook: Prettier not found, run `npm install` first.');
    process.exit(0); // non-blocking: just skip formatting
  }

  try {
    execFileSync(prettier, ['--write', filePath], { stdio: 'ignore' });
  } catch {
    console.error(`format hook: could not format ${filePath}`);
  }
  process.exit(0);
});
