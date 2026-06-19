const fs = require('fs');
const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_utf8.tsx', 'utf8');
const lines = content.split('\n');

console.log("File length:", content.length, "lines:", lines.length);

const keywords = ["11", "12", "13", "14", "model", "Model", "All-In-One", "all-in-one", "ALL-IN-ONE", "창업", "프로세스", "절차"];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const kw of keywords) {
    if (line.includes(kw)) {
      console.log(`Line ${i+1} matches "${kw}": ${line.trim().substring(0, 100)}`);
      break;
    }
  }
}
