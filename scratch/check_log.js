const fs = require('fs');
const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fa5f2b96-9c7f-4245-b7c6-72c405a822ad\\.system_generated\\logs\\transcript.jsonl';

const content = fs.readFileSync(logPath, 'utf8');
console.log('Log file size:', content.length, 'bytes');

// Check if string "truncated" is inside the file content
const hasTruncated = content.includes('truncated');
console.log('Contains the word "truncated":', hasTruncated);

if (hasTruncated) {
  // Let's find some occurrences
  let idx = 0;
  for (let i = 0; i < 5; i++) {
    idx = content.indexOf('truncated', idx);
    if (idx === -1) break;
    console.log(`Occurrence ${i}:`, content.substring(idx - 50, idx + 50));
    idx += 9;
  }
}
