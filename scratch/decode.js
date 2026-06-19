const fs = require('fs');

// Read the file as raw buffer
const buf = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\diff_franchise.txt');

console.log("Buffer length:", buf.length);

// Try decoding as UTF-16LE
const utf16leStr = buf.toString('utf16le');
console.log("UTF-16LE sample:", utf16leStr.substring(0, 500));

// Let's check if there are actual '?' characters (byte 0x3f) or if they are just display issues
let questionMarkCount = 0;
for (let i = 0; i < buf.length; i++) {
  if (buf[i] === 0x3f) questionMarkCount++;
}
console.log("Number of literal '?' bytes (0x3f):", questionMarkCount);

// Let's write the buffer as a raw binary file to scratch/diff_raw.txt
fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\diff_raw.txt', buf);
