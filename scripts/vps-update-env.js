const fs = require('fs');
const path = require('path');
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

const localEnvPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(localEnvPath, 'utf-8');

const tokenMatch = envContent.match(/^INSTAGRAM_ACCESS_TOKEN=(.*)$/m);
if (!tokenMatch) {
  console.error('Could not find INSTAGRAM_ACCESS_TOKEN in local .env');
  process.exit(1);
}

const localToken = tokenMatch[1].trim();
console.log('Picked local INSTAGRAM_ACCESS_TOKEN (length: ' + localToken.length + ')');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS via SSH');
  
  // Bash script to safely update INSTAGRAM_ACCESS_TOKEN in /var/www/pink-papaya/.env
  const script = `
    ENV_FILE="/var/www/pink-papaya/.env"
    NEW_TOKEN="${localToken}"

    if [ -f "$ENV_FILE" ]; then
      if grep -q "^INSTAGRAM_ACCESS_TOKEN=" "$ENV_FILE"; then
        sed -i 's|^INSTAGRAM_ACCESS_TOKEN=.*|INSTAGRAM_ACCESS_TOKEN='"$NEW_TOKEN"'|' "$ENV_FILE"
      else
        echo "INSTAGRAM_ACCESS_TOKEN=$NEW_TOKEN" >> "$ENV_FILE"
      fi
    else
      echo "INSTAGRAM_ACCESS_TOKEN=$NEW_TOKEN" > "$ENV_FILE"
    fi

    chown papaya:papaya "$ENV_FILE"
    chmod 600 "$ENV_FILE"

    echo "Updated VPS .env file successfully."
    echo "Restarting PM2 process..."

    su - papaya -c "cd /var/www/pink-papaya && pm2 restart all --update-env"
    
    sleep 3
    echo "Testing VPS Instagram API Endpoint..."
    curl -s http://localhost:3000/api/instagram | head -c 300
    echo ""
  `;

  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Process completed with code: ' + code);
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
