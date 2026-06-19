const fs = require('fs');

function decodeMojibake(str) {
  try {
    // Convert U+XXXX string representing CP949 bytes back to raw bytes
    const buf = Buffer.from(str, 'binary'); // or another encoding
    // Let's try to convert each char to a byte
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      bytes.push(code & 0xff);
    }
    const decoded = Buffer.from(bytes).toString('utf-8');
    return decoded;
  } catch (e) {
    return str;
  }
}

const data = JSON.parse(fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json', 'utf8'));
const repl = data.ReplacementContent || '';
console.log("Length of ReplacementContent:", repl.length);
console.log("First 500 chars raw:\n", repl.substring(0, 500));
console.log("First 500 chars decoded:\n", decodeMojibake(repl.substring(0, 500)));
