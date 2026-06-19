const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = [
  'franchise_staged_recovered_fixed.tsx',
  'franchise_recovered.tsx',
  'franchise_staged_utf8.tsx',
  'franchise_staged.tsx',
  'git_staged_dump.tsx',
  'diff_workdir_decoded.txt',
  'diff_workdir_utf8.txt',
  'diff_workdir.txt',
  'diff_franchise.txt',
  'diff_franchise_utf8.txt'
];

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`${file} does not exist`);
    return;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n--- File: ${file} (length: ${content.length}) ---`);
    const s11 = content.indexOf('SECTION 11');
    const s12 = content.indexOf('SECTION 12');
    const s13 = content.indexOf('SECTION 13');
    const s14 = content.indexOf('SECTION 14');
    const s15 = content.indexOf('SECTION 15');
    console.log(`  s11: ${s11}, s12: ${s12}, s13: ${s13}, s14: ${s14}, s15: ${s15}`);
    
    // Also search for Korean slide titles
    const hasAllInOne = content.includes('올인원');
    const hasHybrid = content.includes('하이브리드');
    const hasNewFranchise = content.includes('신규 가맹');
    console.log(`  hasAllInOne: ${hasAllInOne}, hasHybrid: ${hasHybrid}, hasNewFranchise: ${hasNewFranchise}`);
  } catch (e) {
    console.log(`Error reading ${file}: ${e.message}`);
  }
});
