let Client;
try {
  Client = require('ssh2').Client;
} catch (e) {
  try {
    Client = require('C:/Users/marsh/.gemini/antigravity-ide/brain/0c16d623-1655-4866-8347-89711b6c8257/scratch/node_modules/ssh2').Client;
  } catch (err) {
    console.error('ssh2 package not found');
    process.exit(1);
  }
}

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: Connected to VPS');
  const commands = `su - papaya -c "cd /var/www/pink-papaya && git fetch origin && git reset --hard origin/main && npm install && npm run build && pm2 restart all && sleep 2 && pm2 list && curl -sI http://localhost:3000"`;
  
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: closed with code: ' + code);
      conn.end();
      if (code !== 0) process.exit(code);
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
}).connect({
  host: '187.127.187.184',
  port: 22,
  username: 'root',
  password: 'P+,1fLHpL22/A9+;'
});
