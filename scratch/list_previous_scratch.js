const fs = require('fs');
const path = require('path');

const prevScratchDir = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\scratch';

try {
  const files = fs.readdirSync(prevScratchDir);
  console.log(`Found ${files.length} files in previous scratch folder:`);
  files.forEach(file => {
    const filePath = path.join(prevScratchDir, file);
    const stat = fs.statSync(filePath);
    console.log(`- ${file} (${stat.size} bytes)`);
    if (file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.txt')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('120겹파이 올인원 패키지') || content.includes('하이브리드형 10평대')) {
        console.log(`  => MATCH in ${file}!`);
      }
    }
  });
} catch (err) {
  console.error("Error:", err.message);
}
