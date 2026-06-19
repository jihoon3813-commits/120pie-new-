const fs = require('fs');
const path = require('path');

const results = JSON.parse(fs.readFileSync(path.join(__dirname, 'dry_run_results.json'), 'utf-8'));
const hoonFile = results.find(r => r.file.includes('hoon'));

if (hoonFile) {
  console.log('--- Proposed Changes for hoon/HomeV3.tsx ---');
  console.log(JSON.stringify(hoonFile, null, 2));
} else {
  console.log('No changes proposed for hoon/HomeV3.tsx!');
}
