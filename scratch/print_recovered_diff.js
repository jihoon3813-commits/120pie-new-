const fs = require('fs');

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\diff_franchise_recovered_utf8.txt', 'utf8');
  console.log("File length:", content.length);
  console.log("First 1500 chars:\n", content.substring(0, 1500));
} catch (e) {
  console.error(e);
}
