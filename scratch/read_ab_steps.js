const fs = require('fs');

const stepFiles = [
  'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_345.json',
  'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_388.json',
  'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_390.json',
  'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json',
  'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_404.json'
];

for (const sf of stepFiles) {
  const data = JSON.parse(fs.readFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\${sf}`, 'utf8'));
  console.log(`\n=== File: ${sf} ===`);
  console.log("StartLine:", data.StartLine, "EndLine:", data.EndLine);
  if (data.ReplacementContent) {
    console.log("Length:", data.ReplacementContent.length);
    console.log("Sample:", data.ReplacementContent.substring(0, 1000));
  } else if (data.CodeContent) {
    console.log("CodeContent Length:", data.CodeContent.length);
    console.log("Sample:", data.CodeContent.substring(0, 1000));
  } else if (data.ReplacementChunks) {
    console.log("Chunks:", data.ReplacementChunks.length);
  }
}
