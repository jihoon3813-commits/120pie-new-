const fs = require('fs');
const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_utf8.tsx', 'utf8');
const lines = content.split('\n');

console.log("Printing Section 11 (Lines 1185 - 1263):");
for (let i = 1184; i < 1263; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}

console.log("\nPrinting Section 12 (Lines 1264 - 1342):");
for (let i = 1263; i < 1342; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
