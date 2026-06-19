const fs = require('fs');
const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged.tsx', 'utf16le');
const lines = content.split('\n');
console.log("Lines around 1186:");
for (let i = 1180; i < 1250; i++) {
  if (lines[i]) {
    console.log(`${i + 1}: ${lines[i].trim()}`);
  }
}
