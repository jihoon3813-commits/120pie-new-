const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../app/v3/HomeV3.tsx'), 'utf-8');
const lines = content.split('\n');

console.log('--- Videos in app/v3/HomeV3.tsx ---');
lines.forEach((line, index) => {
  if (line.includes('.mp4')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
