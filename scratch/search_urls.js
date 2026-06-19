const fs = require('fs');
const path = require('path');

const mappings = JSON.parse(fs.readFileSync(path.join(__dirname, 'image_mappings.json'), 'utf-8'));

// Find all files in app, components, and hoon directories
const targetDirs = [
  path.join(__dirname, '../app'),
  path.join(__dirname, '../components'),
  path.join(__dirname, '../hoon')
];

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        getFiles(filePath, files);
      }
    } else {
      if (/\.(tsx|ts|js|json|css|html)$/.test(file) && !file.endsWith('image_mappings.json') && !file.endsWith('search_results.json') && file !== 'read_excel.js') {
        files.push(filePath);
      }
    }
  }
  return files;
}

const allFiles = [];
for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    getFiles(dir, allFiles);
  }
}

console.log(`Found ${allFiles.length} source files to scan.`);

const results = [];

for (const mapping of mappings) {
  const existing = mapping["기존"];
  const replacement = mapping["변경"];
  
  if (!existing || !replacement) continue;
  
  const matches = [];
  
  for (const filePath of allFiles) {
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for exact URL/text match
    let count = 0;
    let index = content.indexOf(existing);
    while (index !== -1) {
      count++;
      index = content.indexOf(existing, index + existing.length);
    }
    
    if (count > 0) {
      matches.push({
        file: relativePath,
        count: count
      });
    }
  }
  
  results.push({
    기존: existing,
    변경: replacement,
    matches: matches
  });
}

const outputPath = path.join(__dirname, 'search_results.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');

const matchCount = results.filter(r => r.matches.length > 0).length;
console.log(`Search complete. ${matchCount} out of ${mappings.length} mappings had matches in source files. Results saved to ${outputPath}`);
