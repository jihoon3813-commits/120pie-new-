const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\.system_generated\\logs\\transcript.jsonl';
const targetLines = [166, 186, 190, 192, 196, 234, 240, 244, 246, 379, 381, 385, 473, 512, 518];

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let lineIndex = 0;
rl.on('line', (line) => {
  lineIndex++;
  if (targetLines.includes(lineIndex)) {
    try {
      const obj = JSON.parse(line);
      console.log(`Processing Line ${lineIndex} (Type: ${obj.type}, Source: ${obj.source})`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach((tc, idx) => {
          const args = tc.args || tc.arguments || tc.Arguments;
          const name = tc.name || tc.ToolName;
          console.log(`  - Tool Call ${idx}: ${name}`);
          if (args) {
            fs.writeFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\args_line_${lineIndex}_${idx}.json`, JSON.stringify(args, null, 2), 'utf8');
            if (args.ReplacementContent) {
              fs.writeFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\replacement_line_${lineIndex}_${idx}.txt`, args.ReplacementContent, 'utf8');
              console.log(`    Saved ReplacementContent (${args.ReplacementContent.length} chars)`);
            }
            if (args.ReplacementChunks) {
              fs.writeFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\chunks_line_${lineIndex}_${idx}.json`, JSON.stringify(args.ReplacementChunks, null, 2), 'utf8');
              console.log(`    Saved ReplacementChunks (${args.ReplacementChunks.length} chunks)`);
            }
          }
        });
      }
    } catch (err) {
      console.error(`Error processing line ${lineIndex}:`, err.message);
    }
  }
});

rl.on('close', () => {
  console.log("Finished extraction.");
});
