const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const buf = fs.readFileSync('d:/anti-gv/25. 120pie(new)_2/hoon/260611_120pie-가맹-제안_막장있음_수정.pdf');

async function main() {
  console.log("Initializing PDFParse...");
  const parser = new PDFParse({ data: buf });
  console.log("Rendering screenshots...");
  const result = await parser.getScreenshot({ scale: 1.0 });
  console.log("Rendered pages:", result.pages.length);
  for (let i = 0; i < result.pages.length; i++) {
    const page = result.pages[i];
    const outPath = path.join('d:/anti-gv/25. 120pie(new)_2/scratch', `page_${i + 1}.png`);
    fs.writeFileSync(outPath, page.data);
    console.log(`Saved page ${i + 1} to ${outPath}`);
  }
  await parser.destroy();
}

main().catch(e => console.error("Error:", e));
