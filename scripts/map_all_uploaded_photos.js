const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

async function main() {
  console.log('Fetching list of all 1559 uploaded WebP files from VPS...');
  const out = execSync(`node "${sshScript}" "ls /srv/papaya-media/uploads"`).toString();
  const files = out.trim().split('\n').map(f => f.trim()).filter(f => f.endsWith('.webp'));

  console.log(`Found ${files.length} total WebP files on VPS.`);

  // Group by timestamp prefix (first 13 digits)
  const timestampGroups = {};
  for (const f of files) {
    const match = f.match(/^(\d{13})/);
    if (match) {
      const ts = match[1];
      if (!timestampGroups[ts]) timestampGroups[ts] = [];
      timestampGroups[ts].push(f);
    }
  }

  console.log(`\nGrouped into ${Object.keys(timestampGroups).length} upload batches:`);
  for (const ts of Object.keys(timestampGroups)) {
    const group = timestampGroups[ts];
    console.log(`Timestamp: ${ts} (${new Date(parseInt(ts)).toISOString()}) -> ${group.length} files`);
    console.log(`  Sample 3 files:`, group.slice(0, 3));
  }
}

main().catch(console.error);
