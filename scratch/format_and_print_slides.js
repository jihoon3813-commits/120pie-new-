const fs = require('fs');
const path = require('path');

const files = ['slide_11_12_clean.txt', 'slide_13_clean.txt', 'slide_14_clean.txt'];

for (const fn of files) {
  let content = fs.readFileSync(path.join('d:\\anti-gv\\25. 120pie(new)_2\\scratch', fn), 'utf8');
  
  // Unescape any double escaped newlines or quotes
  // Check if it starts with a quote and ends with a quote (like a raw JSON string)
  if (content.startsWith('"') && content.endsWith('"')) {
    content = JSON.parse(content);
  } else {
    // Manually replace literal \n and \" if needed
    content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  }
  
  const outPath = path.join('d:\\anti-gv\\25. 120pie(new)_2\\scratch', `formatted_${fn}`);
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Saved formatted content to ${outPath}`);
}
