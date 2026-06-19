const { execSync } = require('child_process');
const fs = require('fs');

try {
  const diff = execSync('git diff -- app/franchise/FranchisePageClient.tsx', { 
    cwd: 'd:\\anti-gv\\25. 120pie(new)_2',
    encoding: 'utf8', 
    maxBuffer: 10 * 1024 * 1024 
  });
  fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\diff_workdir.txt', diff, 'utf8');
  console.log("Saved git diff to diff_workdir.txt. Size:", diff.length);
} catch (err) {
  console.error("Error running git diff:", err);
}
