const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  try {
    const obj = JSON.parse(line);
    // Look for tool calls that edit FranchisePageClient.tsx
    if (obj.tool_calls) {
      obj.tool_calls.forEach((tc, tcIdx) => {
        if (tc.name === 'replace_file_content' || tc.name === 'write_to_file' || tc.name === 'multi_replace_file_content') {
          const args = tc.args;
          const target = args.TargetFile || args.Target;
          if (target && target.includes('FranchisePageClient.tsx')) {
            console.log(`\nLine ${lineNum}: Step ${obj.step_index || 'unknown'} - Tool: ${tc.name}`);
            console.log(`  Args keys: ${Object.keys(args).join(', ')}`);
            const content = args.ReplacementContent || args.CodeContent;
            if (content) {
              console.log(`  Content length: ${content.length} chars`);
              console.log(`  Content preview: ${content.substring(0, 100)}...`);
              console.log(`  Is truncated marker present: ${content.includes('truncated')}`);
            }
          }
        }
      });
    }
  } catch (err) {
    // ignore parse errors on malformed lines
  }
});
