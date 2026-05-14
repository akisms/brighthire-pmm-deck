const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3030;
const ROOT = __dirname;
const EDITS_FILE = path.join(ROOT, 'edits.json');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

function readEdits() {
  try { return JSON.parse(fs.readFileSync(EDITS_FILE, 'utf8')); }
  catch { return {}; }
}

const server = http.createServer((req, res) => {
  // Save endpoint
  if (req.method === 'POST' && req.url === '/save-edits') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);
        const current = readEdits();
        const merged = { ...current, ...incoming };
        fs.writeFileSync(EDITS_FILE, JSON.stringify(merged, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, count: Object.keys(merged).length }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // Reset endpoint
  if (req.method === 'POST' && req.url === '/reset-edits') {
    try { fs.unlinkSync(EDITS_FILE); } catch {}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Static files
  const filePath = path.join(ROOT, req.url === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Return empty edits.json if missing
      if (req.url.endsWith('/edits.json')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{}');
        return;
      }
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`BrightHire presentation running at http://localhost:${PORT}`);
  console.log(`Edits persist to ${EDITS_FILE}`);
});
