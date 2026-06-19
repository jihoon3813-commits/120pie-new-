const fs = require('fs');

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\diff_workdir_utf8.txt', 'utf8');
  const lines = content.split('\n');
  console.log("Total lines:", lines.length);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('11 /') || lines[i].includes('12 /') || lines[i].includes('13 /') || lines[i].includes('14 /')) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
    }
  }
} catch (e) {
  console.error(e);
}
