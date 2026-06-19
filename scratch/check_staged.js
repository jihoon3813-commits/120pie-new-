const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Extracting staged file from git index...");
  const content = execSync('git show :app/franchise/FranchisePageClient.tsx', { encoding: 'utf8' });
  fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_git.tsx', content, 'utf8');
  console.log("Saved staged file to franchise_staged_git.tsx. Size:", content.length);
} catch (err) {
  console.error("Error running git show:", err);
}
