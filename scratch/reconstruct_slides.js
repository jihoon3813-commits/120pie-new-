const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

// Slide 11 & 12
const data396 = JSON.parse(fs.readFileSync(path.join(scratchDir, 'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json'), 'utf8'));
const content396 = data396.ReplacementContent || '';
fs.writeFileSync(path.join(scratchDir, 'slide_11_12_clean.txt'), content396);
console.log("Saved Slide 11 & 12 to slide_11_12_clean.txt");

// Slide 13
const data241 = JSON.parse(fs.readFileSync(path.join(scratchDir, 'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_241.json'), 'utf8'));
const content241 = data241.ReplacementContent || '';
fs.writeFileSync(path.join(scratchDir, 'slide_13_clean.txt'), content241);
console.log("Saved Slide 13 to slide_13_clean.txt");

// Slide 14
const data943 = JSON.parse(fs.readFileSync(path.join(scratchDir, 'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_943.json'), 'utf8'));
const content943 = data943.ReplacementContent || '';
fs.writeFileSync(path.join(scratchDir, 'slide_14_clean.txt'), content943);
console.log("Saved Slide 14 to slide_14_clean.txt");
