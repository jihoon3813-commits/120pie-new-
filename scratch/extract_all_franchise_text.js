const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

const franchiseSteps = [];

for (const f of files) {
  if (f.startsWith('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_') && f.endsWith('.json')) {
    const stepNum = parseInt(f.split('step_')[1].split('.json')[0]);
    franchiseSteps.push({ file: f, step: stepNum });
  }
}

franchiseSteps.sort((a, b) => a.step - b.step);

for (const s of franchiseSteps) {
  const data = JSON.parse(fs.readFileSync(path.join(scratchDir, s.file), 'utf8'));
  console.log(`\n==================================================`);
  console.log(`Step ${s.step}: StartLine=${data.StartLine}, EndLine=${data.EndLine}`);
  console.log(`Description: ${data.Description}`);
  console.log(`Instruction: ${data.Instruction}`);
  
  let code = data.ReplacementContent || '';
  if (!code && data.ReplacementChunks) {
    code = JSON.stringify(data.ReplacementChunks, null, 2);
  }
  
  console.log(`Content Length: ${code.length}`);
  
  // Let's search if it has SECTION 11, 12, 13, 14
  const sections = [];
  for (let i = 11; i <= 15; i++) {
    if (code.includes(`SECTION ${i}`)) sections.push(i);
  }
  console.log("Sections modified:", sections);
  
  if (code.length > 0) {
    const outPath = path.join(scratchDir, `content_step_${s.step}.txt`);
    fs.writeFileSync(outPath, code);
    console.log(`Saved code to ${outPath}`);
  }
}
