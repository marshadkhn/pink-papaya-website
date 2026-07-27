const fs = require('fs');
const path = require('path');
let Client;
try {
  Client = require('ssh2').Client;
} catch (e) {
  Client = require('C:/Users/marsh/.gemini/antigravity-ide/brain/0c16d623-1655-4866-8347-89711b6c8257/scratch/node_modules/ssh2').Client;
}

const localScript = path.join(__dirname, 'sync_mongo_media_urls.js');
const vpsScript = '/var/www/pink-papaya/scripts/sync_mongo_media_urls.js';

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    sftp.fastPut(localScript, vpsScript, (putErr) => {
      if (putErr) console.error('Upload script error:', putErr);
      else console.log('Script uploaded to VPS successfully!');
      conn.end();
    });
  });
}).connect({
  host: '187.127.187.184',
  port: 22,
  username: 'root',
  password: 'P+,1fLHpL22/A9+;'
});
