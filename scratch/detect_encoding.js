const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const filePath = path.join(scratchDir, 'franchise_staged_recovered_fixed.tsx');

try {
  const buf = fs.readFileSync(filePath);
  console.log("Buffer length:", buf.length);
  
  // Search for the index of SECTION 11 as raw bytes
  const searchStr = 'SECTION 11';
  const searchBuf = Buffer.from(searchStr);
  const s11Idx = buf.indexOf(searchBuf);
  console.log("Raw byte index of SECTION 11:", s11Idx);
  
  if (s11Idx !== -1) {
    // Let's print the next 200 bytes as hex and as different encodings
    const snippet = buf.slice(s11Idx, s11Idx + 500);
    console.log("Snippet (latin1):", snippet.toString('latin1'));
    console.log("Snippet (utf8):", snippet.toString('utf8'));
    console.log("Snippet (utf16le):", snippet.toString('utf16le'));
    
    // If it is EUC-KR/CP949, we can try to decode using iconv-lite if available
    try {
      const iconv = require('iconv-lite');
      console.log("Snippet (euc-kr):", iconv.decode(snippet, 'euc-kr'));
    } catch (e) {
      console.log("iconv-lite not loaded, let's see if we can decode by running a python script or similar");
    }
  }
} catch (err) {
  console.error("Error:", err.message);
}
