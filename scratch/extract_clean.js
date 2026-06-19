const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

function cleanContent(content) {
  if (typeof content !== 'string') return '';
  let cleaned = content;
  // If it's double serialized (starts and ends with quote, or is double escaped)
  if (cleaned.trim().startsWith('"') && cleaned.trim().endsWith('"')) {
    try {
      cleaned = JSON.parse(cleaned.trim());
    } catch (e) {
      // fallback
    }
  }
  // Replace literal '\n' and '\t' with actual ones if they are still escape sequences
  cleaned = cleaned.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
  return cleaned;
}

function extractAndClean(filename, outName) {
  try {
    const raw = fs.readFileSync(path.join(scratchDir, filename), 'utf8');
    const data = JSON.parse(raw);
    
    let content = '';
    if (data.ReplacementContent) {
      content = data.ReplacementContent;
    } else if (data.ReplacementChunks && data.ReplacementChunks[0]) {
      content = data.ReplacementChunks[0].ReplacementContent;
    } else if (data.tool_calls) {
      const call = data.tool_calls.find(c => c.name === 'replace_file_content' || c.name === 'multi_replace_file_content');
      if (call) {
        content = call.args.ReplacementContent || call.args.ReplacementChunks?.[0]?.ReplacementContent || '';
      }
    }
    
    const cleaned = cleanContent(content);
    if (cleaned) {
      fs.writeFileSync(path.join(scratchDir, outName), cleaned, 'utf8');
      console.log(`Successfully extracted and cleaned ${filename} -> ${outName}`);
    } else {
      console.log(`No content found in ${filename}`);
    }
  } catch (err) {
    console.error(`Error processing ${filename}:`, err.message);
  }
}

extractAndClean('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json', 'slide_11_12_clean.tsx');
extractAndClean('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_241.json', 'slide_13_clean.tsx');
extractAndClean('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_943.json', 'slide_14_clean.tsx');
