const fs = require('fs');
const path = require('path');

function printContext(filePath, keyword) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  console.log(`=== Matches for "${keyword}" in ${path.relative(path.join(__dirname, '..'), filePath)} ===`);
  lines.forEach((line, index) => {
    if (line.includes(keyword)) {
      const start = Math.max(0, index - 5);
      const end = Math.min(lines.length - 1, index + 5);
      console.log(`Line ${index + 1}:`);
      console.log(lines.slice(start, end + 1).map((l, i) => `  ${start + i + 1}: ${l}`).join('\n'));
      console.log('-'.repeat(40));
    }
  });
}

printContext(path.join(__dirname, '../app/franchise/FranchisePageClient.tsx'), '로제미트');
printContext(path.join(__dirname, '../app/v3/HomeV3.tsx'), '로제미트');
