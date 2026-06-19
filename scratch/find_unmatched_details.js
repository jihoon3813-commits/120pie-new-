const fs = require('fs');
const path = require('path');

const extracted = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_urls.json'), 'utf-8'));

console.log('--- ALL EXTRACTED VIDEO & MOCKUP URLS WITH LINES ---');
extracted.forEach((ext, idx) => {
  // Print if it's a video or if it contains interesting keywords in the context
  const isVideo = ext.url.includes('/video/');
  const hasKorean = /[\uac00-\ud7a3]/.test(ext.context);
  
  if (isVideo || ext.line < 450 || ext.line > 1500) {
    console.log(`${idx + 1}. File: ${ext.file} | Line: ${ext.line}`);
    console.log(`   URL: ${ext.url}`);
    const firstLineOfContext = ext.context.split('\n')[2] || '';
    console.log(`   Context: ${firstLineOfContext.trim()}`);
    console.log('-');
  }
});
