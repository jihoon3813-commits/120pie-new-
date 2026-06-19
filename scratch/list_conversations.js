const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain';

try {
  const files = fs.readdirSync(brainDir);
  console.log("Directories in brain:");
  for (const f of files) {
    const fullPath = path.join(brainDir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      console.log(`- ${f} [${stat.mtime}]`);
    }
  }
} catch (e) {
  console.error("Failed to list brain dir:", e);
}
