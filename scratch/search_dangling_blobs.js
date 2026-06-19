const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const hashes = [
  '4ff1771bfba88d51dd0f2e3aa2af124e3dfede81',
  'a521f14752aa4a15728decc599528fb382cdcb38',
  '22b2c94443aa5a4d72a965b18cc3c2a9ee1c83a5',
  '53d23fb4ea694458e63035fcb865c789086d03ab',
  'd8139d7a4a7857d909a09ffc981b7b09b4eb2663',
  'ef53f2f1125736dd369bbfe1f3f3f9cfa53ce93d',
  '6c25b5c4dc7912defdcff3623fc51115243eae9c',
  'cee52630db3edd73c854c0f1d9df70d3f32bc446',
  'f145020e22261809da66660dad845e1d03ca6bb7',
  '0b76e533d0bd8f8fd24855d9816271b1dcce637d',
  '2886cdf6b2d9c36d771f01fd392ee1b8a8d17fb5',
  '77464eda66eccd14abf8bda3f5f402450f14b139',
  'a636dea602f1d6e4dbb394d8c830ab8dc8385064',
  '1aa8a1bd8e2e92ddae5a651e484cec0f40ef3158',
  '31e8ef1e73f81aee78df8a7f87b03d556caaa654',
  '44b9757dcd58841be97d58191fcf8072d6177d28',
  '6739bbeae1524e32b064938fa8b9074e10a26185',
  'bb3900155f930812a4da1b3a6ad4cf2a5738801b',
  '2c7a238a6b4b181699c712dc02d4bb1feb455b41',
  '486a499c212b9f3fba890e87051ed0860730ea7d',
  '049b20cf25c690cc76f5a9e973bf19aacb5780b3',
  '182c18c519246f237fa7483e1e5cccc39192144b',
  '1e7cb4fca0471d7b293dfabc67773865c79033e6',
  '31bcd35ba2d2b8249e5b54cd50181e6f45f90de8',
  '388c99244e6ee9fb712263b02b0b4bc7415bbc29',
  '2dad2866457c1255a4a11648c5cb614ae2b0c453',
  'd66eee36e99c08e386710e32f8f5d1560cb33bf0',
  '5bdf2cb5dfe1d143d553526210e97d9674a25145',
  '752f12e6c266b4972ea2df5ab22b8c454730d1be',
  '7d9f3dba3d5653dcab1a6f0ee650e8a3078a9d23'
];

console.log(`Checking ${hashes.length} dangling blobs...`);

hashes.forEach(hash => {
  try {
    const content = cp.execSync(`git show ${hash}`).toString('utf8');
    const matchesKeyword = content.includes('올인원') || content.includes('기본 비용') || content.includes('하이브리드 창업');
    
    if (matchesKeyword) {
      console.log(`\n[MATCH] Blob: ${hash}`);
      console.log(`  Size: ${content.length} characters`);
      console.log(`  Preview: ${JSON.stringify(content.substring(0, 150))}`);
      
      const outPath = path.join('scratch', `recovered_blob_${hash.substring(0, 7)}.tsx`);
      fs.writeFileSync(outPath, content, 'utf8');
      console.log(`  Saved to ${outPath}`);
    }
  } catch (e) {
    console.error(`Error reading blob ${hash}:`, e.message);
  }
});
