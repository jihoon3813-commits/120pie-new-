const { execSync } = require('child_process');

try {
  const log = execSync('git log --all --oneline -n 100', { cwd: 'd:\\anti-gv\\25. 120pie(new)_2', encoding: 'utf8' });
  console.log("Git Log (all branches, first 100 commits):");
  console.log(log);
} catch (err) {
  console.error("Error running git log:", err);
}
