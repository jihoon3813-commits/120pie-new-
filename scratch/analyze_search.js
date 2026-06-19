const fs = require('fs');
const path = require('path');

const results = JSON.parse(fs.readFileSync(path.join(__dirname, 'search_results.json'), 'utf-8'));

const matched = results.filter(r => r.matches.length > 0);
const unmatched = results.filter(r => r.matches.length === 0);

console.log('--- MATCHED MAPPINGS SUMMARY ---');
matched.forEach((r, idx) => {
  console.log(`${idx + 1}. Existing: "${r.기존.substring(0, 60)}"`);
  r.matches.forEach(m => {
    console.log(`   - File: ${m.file} (Count: ${m.count})`);
  });
});

console.log('\n--- UNMATCHED MAPPINGS (First 20) ---');
unmatched.slice(0, 20).forEach((r, idx) => {
  console.log(`${idx + 1}. Existing: "${r.기존}"`);
  console.log(`   New:      "${r.변경.substring(0, 60)}..."`);
});

console.log(`\nSummary: Total ${results.length}, Matched ${matched.length}, Unmatched ${unmatched.length}`);
