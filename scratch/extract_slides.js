const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

function extractAndLog(filename, outName) {
  try {
    const raw = fs.readFileSync(path.join(scratchDir, filename), 'utf8');
    const data = JSON.parse(raw);
    let content = data.ReplacementContent || data.ReplacementChunks?.[0]?.ReplacementContent || '';
    if (!content && data.tool_calls) {
      const call = data.tool_calls.find(c => c.name === 'replace_file_content' || c.name === 'multi_replace_file_content');
      if (call) {
        content = call.args.ReplacementContent || call.args.ReplacementChunks?.[0]?.ReplacementContent || '';
      }
    }
    if (content) {
      fs.writeFileSync(path.join(scratchDir, outName), content, 'utf8');
      console.log(`Successfully extracted ${filename} -> ${outName}`);
    } else {
      console.log(`No content found in ${filename}`);
    }
  } catch (err) {
    console.error(`Error processing ${filename}:`, err.message);
  }
}

extractAndLog('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json', 'slide_11_12_extracted.txt');
extractAndLog('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_241.json', 'slide_13_extracted.txt');
extractAndLog('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_943.json', 'slide_14_extracted.txt');
