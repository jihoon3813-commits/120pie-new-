const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cwd = 'd:\\anti-gv\\25. 120pie(new)_2';
try {
  // Let's run git diff on the unstaged changes of FranchisePageClient.tsx
  const diffUnstaged = execSync('git diff app/franchise/FranchisePageClient.tsx', { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_unstaged_diff.txt', diffUnstaged, 'utf8');
  console.log("Wrote unstaged diff to franchise_unstaged_diff.txt. Length:", diffUnstaged.length);
  
  // Let's also run git diff --cached on the staged changes
  const diffStaged = execSync('git diff --cached app/franchise/FranchisePageClient.tsx', { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_diff.txt', diffStaged, 'utf8');
  console.log("Wrote staged diff to franchise_staged_diff.txt. Length:", diffStaged.length);
} catch (e) {
  console.error("Error:", e.message);
}
