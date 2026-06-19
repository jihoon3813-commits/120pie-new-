const fs = require('fs');

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\diff_franchise_utf8.txt', 'utf8');
  console.log("diff_franchise_utf8 length:", content.length);
  const lines = content.split('\n');
  console.log("Lines in diff:", lines.length);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@@') || lines[i].includes('MODEL') || lines[i].includes('Model')) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
    }
  }
} catch (e) {
  console.error(e);
}
