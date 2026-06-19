const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fa5f2b96-9c7f-4245-b7c6-72c405a822ad\\.system_generated\\logs\\transcript.jsonl';

async function processLineByLine() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'USER_INPUT') {
          console.log(`[Step ${entry.step_index}] USER:`, entry.content);
      }
    } catch (e) {}
  }
}

processLineByLine();
