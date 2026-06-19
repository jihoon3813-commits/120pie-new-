const fs = require('fs');

function decodeMojibake(str) {
  // Convert each UTF-16 char back to byte by taking character code (which was decoded as CP949 or ISO-8859-1)
  // Let's try two recovery methods:
  // Method A: ISO-8859-1 / Windows-1252 -> UTF-8
  const bytesA = [];
  for (let i = 0; i < str.length; i++) {
    bytesA.push(str.charCodeAt(i) & 0xff);
  }
  const decodedA = Buffer.from(bytesA).toString('utf-8');

  // Method B: UTF-8 read as CP949 (EUC-KR) -> UTF-8
  // Since euc-kr maps double bytes to one Hangul character, we need to convert Hangul characters back to their euc-kr bytes,
  // and then decode those bytes as UTF-8.
  // We can use iconv-lite if we install it, or let's see if there is iconv-lite.
  return { decodedA };
}

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_recovered_utf16le.tsx', 'utf8');
  console.log("Original content length:", content.length);
  const { decodedA } = decodeMojibake(content);
  console.log("Method A decoded sample:\n", decodedA.substring(0, 1000));
} catch (e) {
  console.error(e);
}
