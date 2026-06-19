const fs = require('fs');
const path = require('path');

const files = [
  'diff_franchise_utf8.txt',
  'diff_raw_utf8.txt',
  'diff_franchise_recovered_utf8.txt',
  'franchise_staged_utf8.tsx'
];

const keywords = ["SECTION 11", "SECTION 12", "SECTION 13", "SECTION 14", "11 /", "12 /", "13 /", "14 /"];

for (const f of files) {
  const filePath = path.join('d:\\anti-gv\\25. 120pie(new)_2\\scratch', f);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${f}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`\n================ File: ${f} (lines: ${lines.length}) ================`);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const kw of keywords) {
      if (line.includes(kw)) {
        console.log(`Line ${i+1} matches "${kw}": ${line.trim()}`);
        break;
      }
    }
  }
}
