const fs = require('fs');
const path = require('path');

function printContext(filePath, lineNum) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const index = lineNum - 1;
  const start = Math.max(0, index - 4);
  const end = Math.min(lines.length - 1, index + 4);
  
  console.log(`=== Context for ${path.relative(path.join(__dirname, '..'), filePath)} Line ${lineNum} ===`);
  console.log(lines.slice(start, end + 1).map((l, i) => `${start + i + 1}: ${l}`).join('\n'));
  console.log('='.repeat(40));
}

const v3Path = path.join(__dirname, '../app/v3/HomeV3.tsx');
const hoonPath = path.join(__dirname, '../hoon/HomeV3.tsx');

console.log('--- SCANNING HOON HOMEV3 ---');
printContext(hoonPath, 639);
printContext(hoonPath, 712);
printContext(hoonPath, 812);
printContext(hoonPath, 824);
printContext(hoonPath, 836);

console.log('--- SCANNING V3 HOMEV3 ---');
printContext(v3Path, 639);
printContext(v3Path, 712);
printContext(v3Path, 812);
printContext(v3Path, 824);
printContext(v3Path, 836);
