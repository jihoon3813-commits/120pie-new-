const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

for (const f of files) {
  if (f.startsWith('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_') && f.endsWith('.json')) {
    const fullPath = path.join(scratchDir, f);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const content = data.ReplacementContent || '';
    
    for (let i = 11; i <= 14; i++) {
      if (content.includes(`{/* SECTION ${i}.`)) {
        console.log(`File ${f} contains SECTION ${i} replacement!`);
        console.log(`StartLine: ${data.StartLine}, EndLine: ${data.EndLine}`);
        const outPath = path.join(scratchDir, `section_${i}_from_${f}.txt`);
        fs.writeFileSync(outPath, content);
        console.log(`Saved section content to ${outPath}`);
      }
    }
  }
}
