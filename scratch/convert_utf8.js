const fs = require('fs');
const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged.tsx', 'utf16le');
fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_utf8.tsx', content, 'utf8');
console.log("Converted franchise_staged.tsx to UTF-8.");
