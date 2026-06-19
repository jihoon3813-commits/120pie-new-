const fs = require('fs');
const path = require('path');

const mappings = JSON.parse(fs.readFileSync(path.join(__dirname, 'image_mappings.json'), 'utf-8'));
const extracted = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_urls.json'), 'utf-8'));

// Function to extract public ID from a Cloudinary URL
function getPublicId(url) {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  // Cloudinary URL format: .../upload/(vXXXXXX/)?(transformations/)?public_id.ext
  // Let's get the part after /upload/ and remove version/transformations
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const pathPart = parts[1];
  
  // Find the last segment (public_id + extension)
  const segments = pathPart.split('/');
  const lastSegment = segments[segments.length - 1];
  
  // Remove extension
  const dotIndex = lastSegment.lastIndexOf('.');
  if (dotIndex === -1) return lastSegment;
  return lastSegment.substring(0, dotIndex);
}

const mappingPublicIds = [];
for (const m of mappings) {
  const existing = m["기존"];
  const replacement = m["변경"];
  
  const existingPublicId = getPublicId(existing);
  const replacementPublicId = getPublicId(replacement);
  
  mappingPublicIds.push({
    original: m,
    existingPublicId,
    replacementPublicId
  });
}

const matches = [];

for (const ext of extracted) {
  const codeUrl = ext.url;
  const codePublicId = getPublicId(codeUrl);
  
  if (!codePublicId) continue;
  
  // Find matching mappings by public ID
  const matchedMappings = mappingPublicIds.filter(m => m.existingPublicId && m.existingPublicId === codePublicId);
  
  if (matchedMappings.length > 0) {
    matches.push({
      code: ext,
      codePublicId,
      mappings: matchedMappings.map(m => m.original)
    });
  }
}

console.log(`Matched ${matches.length} URL instances in code by public ID.`);

// Write the matched list
fs.writeFileSync(path.join(__dirname, 'matches_by_id.json'), JSON.stringify(matches, null, 2), 'utf-8');

// Also print which mappings are still unmatched
const matchedMappingIndices = new Set();
for (const match of matches) {
  for (const m of match.mappings) {
    const idx = mappings.findIndex(orig => orig["기존"] === m["기존"] && orig["변경"] === m["변경"]);
    if (idx !== -1) matchedMappingIndices.add(idx);
  }
}

const unmatchedMappings = mappings.filter((m, idx) => !matchedMappingIndices.has(idx));
console.log(`Unmatched mappings: ${unmatchedMappings.length}`);

// Save unmatched mappings
fs.writeFileSync(path.join(__dirname, 'unmatched_mappings.json'), JSON.stringify(unmatchedMappings, null, 2), 'utf-8');

// Print a few unmatched mappings
console.log('\n--- Unmatched Mappings (First 10) ---');
unmatchedMappings.slice(0, 10).forEach((u, i) => {
  console.log(`${i+1}. 기존: "${u["기존"]}"`);
  console.log(`   변경: "${u["변경"]}"`);
});
