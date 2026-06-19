const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

try {
  const filePath = path.join(__dirname, '../hoon/260611_이미지 변경작업.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  const outputPath = path.join(__dirname, 'image_mappings.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Successfully wrote ${data.length} mappings to ${outputPath}`);
} catch (error) {
  console.error('Error reading Excel file:', error);
}
