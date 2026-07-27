const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB_NAME;

mongoose.connect(uri, { dbName }).then(async () => {
  const collection = mongoose.connection.db.collection('stays');
  
  const allStays = await collection.find({}).toArray();
  console.log(`TOTAL_STAYS_COUNT: ${allStays.length}`);
  
  const matches = allStays.filter(s => 
    (s.title && s.title.toLowerCase().includes('olive')) || 
    (s.title && s.title.toLowerCase().includes('nook')) ||
    (s.id && s.id.toLowerCase().includes('olive')) ||
    (s.id && s.id.toLowerCase().includes('nook'))
  );

  console.log('SEARCH_MATCHES:', JSON.stringify(matches, null, 2));

  console.log('\nALL_STAY_TITLES:');
  allStays.forEach(s => console.log(`- ${s.title} (ID: ${s.id || s._id})`));

  process.exit(0);
}).catch(err => {
  console.error('DB Error:', err);
  process.exit(1);
});
