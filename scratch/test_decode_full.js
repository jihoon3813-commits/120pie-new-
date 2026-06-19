const fs = require('fs');

function tryRecover(content) {
  try {
    // If it was UTF-8 bytes decoded as CP949:
    // We can convert each character to a byte using CP949 encoding, then decode as UTF-8.
    const iconv = require('iconv-lite');
    const buf = iconv.encode(content, 'cp949');
    return buf.toString('utf8');
  } catch (e) {
    return null;
  }
}

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_utf8.tsx', 'utf8');
  console.log("Staged UTF8 file length:", content.length);
  const recovered = tryRecover(content);
  if (recovered) {
    console.log("Recovery with iconv-lite succeeded!");
    console.log("Sample:\n", recovered.substring(0, 1000));
  } else {
    console.log("Recovery with iconv-lite failed (module might not be installed).");
    // Fallback: character code translation
    const bytes = [];
    for (let i = 0; i < content.length; i++) {
      const code = content.charCodeAt(i);
      bytes.push(code & 0xff);
    }
    const decoded = Buffer.from(bytes).toString('utf-8');
    console.log("Manual decode sample:\n", decoded.substring(0, 1000));
  }
} catch (err) {
  console.error("Error:", err);
}
