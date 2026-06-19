const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fa5f2b96-9c7f-4245-b7c6-72c405a822ad\\.system_generated\\logs\\transcript.jsonl';

async function processLineByLine() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let writes = [];

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      if (entry.tool_calls) {
        for (const call of entry.tool_calls) {
          if (call.name === 'write_to_file' || call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
            const args = call.args || {};
            if (args.TargetFile && args.TargetFile.includes('proposal2\\\\page.tsx')) {
              writes.push({
                step: entry.step_index,
                type: call.name,
                content: args.CodeContent || args.ReplacementContent || args.ReplacementChunks,
                timestamp: entry.created_at
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  // We want to find the last complete write to proposal2/page.tsx
  console.log("Found " + writes.length + " edits to proposal2/page.tsx");
  if (writes.length > 0) {
      for(let w of writes) {
          console.log(`Step ${w.step} [${w.timestamp}] - ${w.type}`);
          // write the content to a file for review
          if (w.content) {
              const outPath = `d:\\anti-gv\\25. 120pie(new)_2\\scratch\\proposal2_step_${w.step}.txt`;
              fs.writeFileSync(outPath, typeof w.content === 'string' ? w.content : JSON.stringify(w.content, null, 2));
              console.log(`Saved to ${outPath}`);
          }
      }
  }
}

processLineByLine();
