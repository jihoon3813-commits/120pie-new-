const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\.system_generated\\logs\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let lineIndex = 0;
rl.on('line', (line) => {
  lineIndex++;
  if (line.includes("6,518") || line.includes("What is Hybrid?") || line.includes("올인원 패키지") || line.includes("프리미엄 패키지")) {
    console.log(`Match at line index ${lineIndex} (Length: ${line.length})`);
    
    // Save to a text file
    fs.writeFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\transcript_match_${lineIndex}.txt`, line, 'utf8');
    
    // Try to decode cp949 Mojibake
    try {
      const iconv = require('iconv-lite');
      const buf = iconv.encode(line, 'cp949');
      const decoded = buf.toString('utf8');
      fs.writeFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\transcript_match_${lineIndex}_utf8.txt`, decoded, 'utf8');
      console.log(`  Saved decoded UTF-8 version.`);
    } catch (e) {
      console.log(`  Failed to decode CP949: ${e.message}`);
    }
  }
});

rl.on('close', () => {
  console.log("Finished searching transcript.");
});
