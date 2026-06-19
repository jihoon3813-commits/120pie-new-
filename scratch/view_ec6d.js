const fs = require('fs');

try {
  const content = fs.readFileSync('C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\ec6d75c3-aef7-4250-aa12-d4c57ea6ccec\\.system_generated\\steps\\27\\output.txt', 'utf8');
  console.log("File length:", content.length);
  
  // Let's find "올인원" in it
  const idx = content.indexOf("올인원");
  if (idx !== -1) {
    console.log("Found '올인원' at index:", idx);
    console.log("Context around '올인원':\n", content.substring(Math.max(0, idx - 200), Math.min(content.length, idx + 1500)));
  } else {
    console.log("Could not find '올인원' inside this file!");
  }
} catch (e) {
  console.error(e);
}
