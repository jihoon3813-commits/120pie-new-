const fs = require('fs');
const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_git.tsx', 'utf8');
const lines = content.split('\n');
console.log("Lines in franchise_staged_git.tsx from 1180 to 1350:");
for (let i = 1175; i < 1350; i++) {
  if (lines[i] !== undefined) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
