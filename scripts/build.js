// Copies src/ into build/ so there is something to clean up in the lab.
const fs = require('fs');
fs.rmSync('build', { recursive: true, force: true });
fs.cpSync('src', 'build', { recursive: true });
console.log('Built into build/');
