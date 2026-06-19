const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\.system_generated\\logs\\transcript.jsonl';
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

function sanitize(str) {
  return str.replace(/[\x00-\x1F]/g, c => {
    if (c === '\n') return '\\n';
    if (c === '\r') return '\\r';
    if (c === '\t') return '\\t';
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  });
}

for (let line of lines) {
  if (line.includes('"step_index":477')) {
    console.log('Found line 477, length:', line.length);
    try {
      const obj = JSON.parse(sanitize(line));
      const tc = obj.tool_calls[0];
      let chunks = tc.args.ReplacementChunks;
      if (typeof chunks === 'string') {
        chunks = JSON.parse(sanitize(chunks));
      }
      console.log('Chunks count:', chunks.length);
      chunks.forEach((chunk, idx) => {
        console.log(`Chunk ${idx} length:`, chunk.ReplacementContent.length);
        console.log(`  starts with:`, JSON.stringify(chunk.ReplacementContent.substring(0, 200)));
        // Save chunk
        fs.writeFileSync(path.join('scratch', `chunk_477_${idx}.tsx`), chunk.ReplacementContent, 'utf8');
        console.log(`  Saved to scratch/chunk_477_${idx}.tsx`);
      });
    } catch (e) {
      console.log('Error parsing:', e.message);
    }
  }
}
