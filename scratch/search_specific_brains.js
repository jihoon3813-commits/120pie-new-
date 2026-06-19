const fs = require('fs');
const path = require('path');

const targetDirs = [
  'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\a7d16e60-6a64-43a8-9037-063c51e7a7cf',
  'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba'
];

const keywords = ["6,518", "올인원", "5-STEP", "6518만", "창업 모델 C", "창업 모델 B", "hybrid"];

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== '.git' && file !== 'node_modules') {
        walk(filePath, results);
      }
    } else {
      if (file.endsWith('.txt') || file.endsWith('.json') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.md')) {
        results.push(filePath);
      }
    }
  }
  return results;
}

console.log("Scanning target brain directories...");
const files = [];
for (const d of targetDirs) {
  walk(d, files);
}
console.log(`Found ${files.length} candidate files.`);

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    for (const kw of keywords) {
      if (content.includes(kw)) {
        console.log(`Match in: ${file} (keyword: "${kw}", size: ${content.length} bytes)`);
        break;
      }
    }
  } catch (e) {
    // ignore
  }
}
