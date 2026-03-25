import {createRequestHandler} from '@remix-run/node';
import {createServer} from 'http';
import {readFileSync, existsSync, statSync} from 'fs';
import {join, extname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3333;

const MIME_TYPES = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
};

function serveStatic(pathname, res) {
  const filePath = join(__dirname, 'dist/client', pathname);
  if (!existsSync(filePath)) return false;
  const stat = statSync(filePath);
  if (!stat.isFile()) return false;

  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Content-Length': content.length,
      'Cache-Control': pathname.startsWith('/assets/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600',
    });
    res.end(content);
    return true;
  } catch {
    return false;
  }
}

async function startServer() {
  // Import the SSR build
  const build = await import('./dist/server/index.js');

  const handler = createRequestHandler(build, 'production');

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    // Try static files first
    if (serveStatic(url.pathname, res)) return;

    // Build Web Request from Node request
    const headers = new Headers();
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      headers.append(req.rawHeaders[i], req.rawHeaders[i + 1]);
    }

    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await new Promise((resolve) => {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => resolve(Buffer.concat(chunks)));
      });
    }

    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    try {
      const response = await handler(request, {
        env: {
          SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret',
          PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
          PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || 'maisonmasque.myshopify.com',
        },
        storefront: {
          query: async () => {
            throw new Error('Storefront API not configured');
          },
        },
        cart: null,
        waitUntil: () => {},
      });

      const respHeaders = {};
      response.headers.forEach((value, key) => {
        respHeaders[key] = value;
      });
      res.writeHead(response.status, respHeaders);

      const arrayBuffer = await response.arrayBuffer();
      res.end(Buffer.from(arrayBuffer));
    } catch (error) {
      console.error('Request error:', error.message);
      res.writeHead(500, {'Content-Type': 'text/html'});
      res.end('<h1>500 — Internal Server Error</h1>');
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Maison Masque running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
