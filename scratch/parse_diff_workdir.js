const fs = require('fs');

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\diff_workdir_decoded.txt', 'utf8');
  const lines = content.split('\n');
  console.log("Total lines in diff:", lines.length);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('MODEL A') || lines[i].includes('MODEL B') || lines[i].includes('MODEL C') || lines[i].includes('PROCESS')) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
    }
  }
} catch (e) {
  console.error(e);
}
