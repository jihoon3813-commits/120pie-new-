const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba';

function scan(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      scan(fullPath);
    } else {
      const nameLower = entry.toLowerCase();
      if (nameLower.includes('redesign') || nameLower.includes('apply') || nameLower.includes('slide') || nameLower.includes('reconstruct') || stats.size > 10000) {
        if (entry.endsWith('.js') || entry.endsWith('.tsx') || entry.endsWith('.txt') || entry.endsWith('.md')) {
          console.log(`Matching File: ${fullPath} (${stats.size} bytes)`);
        }
      }
    }
  });
}

try {
  scan(targetDir);
} catch (e) {
  console.error(e);
}
