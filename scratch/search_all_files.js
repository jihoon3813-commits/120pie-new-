const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

const utf8Query1 = '올인원 패키지';
const utf8Query2 = '에그120 프리미엄 패키지';
const utf8Query3 = '6,518';
const utf8Query4 = '신규 가맹 정식 창업';

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) return;
  
  try {
    const buf = fs.readFileSync(filePath);
    
    // Check if it contains query strings in any form
    const strUtf8 = buf.toString('utf8');
    const strLatin1 = buf.toString('latin1');
    const strUtf16 = buf.toString('utf16le');
    
    const matchesUtf8 = strUtf8.includes(utf8Query1) || strUtf8.includes(utf8Query2) || strUtf8.includes(utf8Query3) || strUtf8.includes(utf8Query4);
    const matchesLatin1 = strLatin1.includes(utf8Query1) || strLatin1.includes(utf8Query2) || strLatin1.includes(utf8Query3) || strLatin1.includes(utf8Query4);
    
    // Let's also check if it contains some mojibake versions, or if the file name has 'fcfe2e54'
    if (matchesUtf8 || matchesLatin1) {
      console.log(`Match found in file: ${file} (size: ${buf.length} bytes)`);
      if (strUtf8.includes(utf8Query1)) console.log(`  -> Contains: '${utf8Query1}' in UTF-8`);
      if (strUtf8.includes(utf8Query2)) console.log(`  -> Contains: '${utf8Query2}' in UTF-8`);
      if (strUtf8.includes(utf8Query3)) console.log(`  -> Contains: '${utf8Query3}' in UTF-8`);
      if (strUtf8.includes(utf8Query4)) console.log(`  -> Contains: '${utf8Query4}' in UTF-8`);
    }
  } catch (e) {
    // console.error(`Error reading ${file}:`, e.message);
  }
});
