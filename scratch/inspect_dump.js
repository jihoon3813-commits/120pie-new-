const fs = require('fs');

try {
  const buf = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\git_staged_dump.tsx');
  console.log("Raw buffer length:", buf.length);
  
  // Try decoding as UTF-16LE
  const content = buf.toString('utf16le');
  console.log("Decoded string length:", content.length);
  
  // Let's search for "창업 모델 A" or "모델 A" or "MODEL A" or "Slide 11"
  console.log("Includes '창업 모델 A'?", content.includes("창업 모델 A"));
  console.log("Includes 'Model A'?", content.includes("Model A"));
  console.log("Includes 'MODEL A'?", content.includes("MODEL A"));
  console.log("Includes 'Slide 11'?", content.includes("Slide 11"));
  
  const lines = content.split('\n');
  console.log("Total lines:", lines.length);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Slide 11') || lines[i].includes('창업모델 A') || lines[i].includes('MODEL A')) {
      console.log(`\n--- Match at Line ${i + 1} ---`);
      for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 15); j++) {
        console.log(`${j + 1}: ${lines[j]}`);
      }
    }
  }
} catch (err) {
  console.error("Error:", err);
}
