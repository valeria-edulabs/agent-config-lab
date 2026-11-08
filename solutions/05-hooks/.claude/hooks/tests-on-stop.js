// BONUS Stop hook: runs the tests before Claude finishes.
// Exit 2 on a Stop hook = "don't stop yet", and stderr tells Claude why.
const { spawnSync } = require('child_process');

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let input = {};
  try {
    input = JSON.parse(raw);
  } catch {}

  // Avoid infinite loops: if we already sent Claude back once, let it stop.
  if (input.stop_hook_active) process.exit(0);

  const result = spawnSync('npm', ['test', '--silent'], { encoding: 'utf8' });
  if (result.status !== 0) {
    const output = `${result.stdout || ''}${result.stderr || ''}`.slice(-1500);
    console.error(`Tests are failing. Fix them before finishing:\n${output}`);
    process.exit(2);
  }
  process.exit(0);
});
