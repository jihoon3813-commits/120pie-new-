const fs = require('fs');
const path = require('path');

const previousScratch = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\scratch';
const currentScratch = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

const filesToCopy = [
  'apply_section_14_redesign.js',
  'apply_perfect_contrast.js',
  'apply_important_styles.js'
];

filesToCopy.forEach(file => {
  const src = path.join(previousScratch, file);
  const dest = path.join(currentScratch, file);
  if (fs.existsSync(src)) {
    try {
      const content = fs.readFileSync(src, 'utf8');
      fs.writeFileSync(dest, content, 'utf8');
      console.log(`Copied ${file} (length: ${content.length})`);
    } catch (e) {
      console.error(`Error copying ${file}:`, e.message);
    }
  } else {
    console.log(`Source does not exist: ${src}`);
  }
});
