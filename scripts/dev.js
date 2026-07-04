#!/usr/bin/env node
const net = require('net');
const { spawn } = require('child_process');

function isPortFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => srv.close(() => resolve(true)));
    srv.listen(port, '0.0.0.0');
  });
}

async function findFreePort(start, maxTries = 100) {
  for (let i = 0; i < maxTries; i++) {
    const p = start + i;
    if (await isPortFree(p)) return p;
  }
  return null;
}

function parseStartPort(argv) {
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) return Number(args[i + 1]);
    const n = Number(args[i]);
    if (!Number.isNaN(n)) return n;
  }
  if (process.env.PORT) return Number(process.env.PORT);
  return 3000;
}

(async () => {
  const startPort = parseStartPort(process.argv);
  const port = await findFreePort(startPort, 100);
  if (!port) {
    console.error(`No available port found starting from ${startPort}`);
    process.exit(1);
  }
  console.log(`Starting Next dev on port ${port} (start ${startPort})`);

  const userArgs = process.argv.slice(2);
  const args = ['next', 'dev', '--turbopack', '--port', String(port)];
  for (let i = 0; i < userArgs.length; i++) {
    if (userArgs[i] === '--port') { i++; continue; }
    args.push(userArgs[i]);
  }

  const child = spawn('npx', args, { stdio: 'inherit', shell: true });
  child.on('close', (code) => process.exit(code === null ? 0 : code));
  child.on('error', (err) => { console.error(err); process.exit(1); });
})();
