const fs = require('fs');

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\diff_workdir_utf8.txt', 'utf8');
  const lines = content.split('\n');
  console.log("First 30 lines:\n", lines.slice(0, 30).join('\n'));
} catch (e) {
  console.error(e);
}
