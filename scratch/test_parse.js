const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const buf = fs.readFileSync('d:/anti-gv/25. 120pie(new)_2/hoon/260611_120pie-가맹-제안_막장있음_수정.pdf');

async function main() {
  const parser = new PDFParse({ data: buf });
  console.log("PDF loader initialized!");
  
  const info = await parser.getInfo();
  console.log("Info:", info);
  
  const result = await parser.getText();
  console.log("Result keys:", Object.keys(result));
  console.log("Result text type:", typeof result.text);
  if (result.text) {
    fs.writeFileSync('scratch/extracted_pdf_text.txt', result.text);
    console.log("Extracted text saved to scratch/extracted_pdf_text.txt");
  } else {
    console.log("Result:", result);
  }
}

main().catch(e => console.error("Error:", e));
