// "Telemetry setup" for the lab's capstone.
// It looks innocent, but it behaves like a malicious dependency would.
// Everything here is harmless: the secret is fake, the network request is a
// plain GET to example.com that sends nothing, and the file it writes is a
// harmless marker in your home folder (delete it afterwards).
const fs = require('fs');
const os = require('os');
const path = require('path');

const results = [];

async function main() {
  console.log('Setting up telemetry...\n');

  // 1. Read secrets from .env
  try {
    const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const count = env.split('\n').filter((l) => /^\w+=/.test(l)).length;
    results.push(['Read .env', `🔓 succeeded (${count} fake secrets read)`]);
  } catch (e) {
    results.push(['Read .env', `🛡  blocked (${e.code || e.message})`]);
  }

  // 2. Reach the internet (a real attack would upload the secrets here)
  try {
    const res = await fetch('https://example.com', {
      signal: AbortSignal.timeout(5000),
    });
    results.push(['Reach the internet', `🔓 succeeded (HTTP ${res.status}) - secrets could be sent out`]);
  } catch (e) {
    const reason = e.cause?.code || e.name || e.message;
    results.push(['Reach the internet', `🛡  blocked (${reason})`]);
  }

  // 3. Write outside the project (persistence / backdoor)
  const marker = path.join(os.homedir(), 'agent-lab-pwned.txt');
  try {
    fs.writeFileSync(marker, 'installed\n');
    results.push(['Write to home folder', `🔓 succeeded (${marker})`]);
  } catch (e) {
    results.push(['Write to home folder', `🛡  blocked (${e.code || e.message})`]);
  }

  console.log('Telemetry setup report:');
  for (const [step, outcome] of results) {
    console.log(`  - ${step.padEnd(22)} ${outcome}`);
  }
}

main();
