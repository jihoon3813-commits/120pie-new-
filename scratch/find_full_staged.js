const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain';
const keywords = ["ALL-IN-ONE PACKAGE", " Hybrid ", "Start-up Costs", "Hybrid Costs", "hybrid", "올인원 패키지", "신규 가맹 정식 창업"];

function walk(dir, results = []) {
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        if (file !== '.git' && file !== 'node_modules') {
          walk(filePath, results);
        }
      } else {
        if (stat.size > 20000 && (file.endsWith('.tsx') || file.endsWith('.txt') || file.endsWith('.js') || file.endsWith('.json'))) {
          results.push({ path: filePath, size: stat.size });
        }
      }
    }
  } catch (e) {}
  return results;
}

console.log("Scanning brain directory for files > 20KB...");
const candidates = walk(brainDir);
console.log(`Found ${candidates.length} candidate files.`);

for (const c of candidates) {
  try {
    const content = fs.readFileSync(c.path, 'utf8');
    for (const kw of keywords) {
      if (content.includes(kw)) {
        console.log(`Match in: ${c.path} (size: ${c.size} bytes, keyword: "${kw}")`);
        // Print where the match is and print a 1000 char snippet
        const idx = content.indexOf(kw);
        console.log("Snippet:\n", content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 1200)));
        console.log("\n========================================================================\n");
        break;
      }
    }
  } catch (e) {}
}
