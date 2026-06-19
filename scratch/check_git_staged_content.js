const fs = require('fs');
const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_git.tsx', 'utf8');
const lines = content.split('\n');
console.log("Lines in git staged file:");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('창업모델 A') || lines[i].includes('모델 A') || lines[i].includes('Franchise Process')) {
    console.log(`${i + 1}: ${lines[i].trim()}`);
  }
}
