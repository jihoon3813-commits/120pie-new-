const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba';

function scan(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return;
  }
  
  const entries = fs.readdirSync(dir);
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      console.log(`[DIR] ${fullPath}`);
      scan(fullPath);
    } else {
      console.log(`[FILE] ${fullPath} (${stats.size} bytes)`);
    }
  });
}

try {
  scan(targetDir);
} catch (e) {
  console.error("Error:", e.message);
}
