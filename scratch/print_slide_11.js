const fs = require('fs');
const path = require('path');

const filePath = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_utf8.tsx';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log("Length:", content.length);
  
  const lines = content.split('\n');
  console.log("Total lines:", lines.length);
  
  // Slide 11 is around index 67142. Let's find which line index it is
  let accum = 0;
  let s11Line = 0;
  for (let i = 0; i < lines.length; i++) {
    accum += lines[i].length + 1; // +1 for newline
    if (accum >= 67142) {
      s11Line = i;
      break;
    }
  }
  
  console.log("Slide 11 line number (approx):", s11Line + 1);
  console.log("Snippet:\n", lines.slice(s11Line - 2, s11Line + 30).join('\n'));
} catch (e) {
  console.error(e);
}
