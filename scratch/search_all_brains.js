const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain';
const keywords = ["6,518", "올인원", "5-STEP", "6518만"];

function walk(dir, results = []) {
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

console.log("Scanning brain directory...");
const files = walk(brainDir);
console.log(`Found ${files.length} candidate files. Searching for keywords...`);

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
