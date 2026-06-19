const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain';

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
      if (file.startsWith('dom_') && file.endsWith('.txt')) {
        results.push(filePath);
      }
    }
  }
  return results;
}

console.log("Searching for DOM text dumps...");
const domFiles = walk(brainDir);
console.log(`Found ${domFiles.length} DOM dump files.`);

for (const file of domFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes("6,518") || content.includes("What is Hybrid?")) {
      console.log(`MATCH found in DOM dump: ${file} (size: ${content.length} bytes)`);
    }
  } catch (e) {}
}
