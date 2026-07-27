let Client;
try {
  Client = require('ssh2').Client;
} catch (e) {
  Client = require('C:/Users/marsh/.gemini/antigravity-ide/brain/0c16d623-1655-4866-8347-89711b6c8257/scratch/node_modules/ssh2').Client;
}

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connected!');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP Error:', err);
      conn.end();
      return;
    }
    console.log('SFTP Session Started!');
    
    // Ensure directory exists
    conn.exec('mkdir -p /srv/papaya-media/uploads', (execErr) => {
      const stream = sftp.createWriteStream('/srv/papaya-media/uploads/test-sftp.txt');
      stream.on('close', () => {
        console.log('SFTP Test file written successfully!');
        conn.end();
      });
      stream.on('error', (e) => {
        console.error('Stream error:', e);
        conn.end();
      });
      stream.write('SFTP upload test ok');
      stream.end();
    });
  });
}).on('error', (e) => {
  console.error('Conn Error:', e);
}).connect({
  host: '187.127.187.184',
  port: 22,
  username: 'root',
  password: 'P+,1fLHpL22/A9+;'
});
