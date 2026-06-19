const fs = require('fs');
const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_recovered.tsx', 'utf8');
const lines = content.split('\n');

console.log("franchise_recovered.tsx lines:", lines.length);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("SECTION 11") || line.includes("SECTION 12") || line.includes("SECTION 13") || line.includes("SECTION 14")) {
    console.log(`Line ${i+1}: ${line.trim()}`);
    // print next 10 lines
    for (let j = 1; j <= 10; j++) {
      if (lines[i+j]) {
        console.log(`  + ${i+1+j}: ${lines[i+j].trim()}`);
      }
    }
  }
}
