import http from 'node:http';
import fs from 'node:fs/promises';

const port = Number(process.env.PORT || 4173);
// Serve only public files. Do not expose source documents or the Git directory.
const server = http.createServer(async (req, res) => {
  const files = { '/': 'index.html', '/index.html': 'index.html', '/LICENSE': 'LICENSE', '/THIRD_PARTY_NOTICES.md': 'THIRD_PARTY_NOTICES.md' };
  if (!Object.hasOwn(files, req.url)) {
    res.writeHead(404).end('Not found');
    return;
  }
  try {
    const name = files[req.url];
    const data = await fs.readFile(new URL(`../${name}`, import.meta.url));
    const type = name.endsWith('.html') ? 'text/html' : 'text/plain';
    res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' }).end(data);
  } catch {
    res.writeHead(500).end('Cannot read index.html');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
