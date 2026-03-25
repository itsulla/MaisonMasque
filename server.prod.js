// Canonical production server for Node.js deployment (not Shopify Oxygen)
import {createRequestHandler} from '@remix-run/node';
import {createServer} from 'http';
import {readFileSync, existsSync, statSync} from 'fs';
import {join, extname} from 'path';
import {fileURLToPath} from 'url';
import {randomBytes} from 'crypto';

// ---------------------------------------------------------------------------
// P0 — Env validation (fail fast on missing vars)
// ---------------------------------------------------------------------------
const REQUIRED_ENV_VARS = [
  'SESSION_SECRET',
  'PUBLIC_STOREFRONT_API_TOKEN',
  'PUBLIC_STORE_DOMAIN',
];

const isProduction = process.env.NODE_ENV === 'production';

const missingVars = REQUIRED_ENV_VARS.filter((name) => {
  const val = process.env[name];
  return !val || val.trim() === '';
});

if (missingVars.length > 0) {
  if (isProduction) {
    console.error(
      `\n[FATAL] Missing required environment variables in production:\n` +
        missingVars.map((v) => `  - ${v}`).join('\n') +
        `\n\nSet these variables before starting the server.\n`
    );
    process.exit(1);
  }

  // Development: warn and provide fallback for SESSION_SECRET only
  const nonSessionMissing = missingVars.filter((v) => v !== 'SESSION_SECRET');
  if (nonSessionMissing.length > 0) {
    console.warn(
      `[WARN] Missing environment variables (dev mode):\n` +
        nonSessionMissing.map((v) => `  - ${v}`).join('\n')
    );
  }
  if (missingVars.includes('SESSION_SECRET')) {
    const fallback = randomBytes(32).toString('hex');
    process.env.SESSION_SECRET = fallback;
    console.warn(
      `[WARN] SESSION_SECRET not set — using random fallback for this dev session.`
    );
  }
}

// ---------------------------------------------------------------------------
// P2 — Security headers
// ---------------------------------------------------------------------------
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.shopify.com https://www.google-analytics.com; " +
    "frame-ancestors 'none'",
};

// ---------------------------------------------------------------------------
// Static file serving
// ---------------------------------------------------------------------------
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 3333;

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
      ...SECURITY_HEADERS,
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

// ---------------------------------------------------------------------------
// Server startup
// ---------------------------------------------------------------------------
async function startServer() {
  // Import the built Remix SSR app
  const build = await import('./dist/server/index.js');

  const handler = createRequestHandler(build, 'production');

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    // Try static files first (served from ./dist/client/)
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
          SESSION_SECRET: process.env.SESSION_SECRET,
          PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
          PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || '',
        },
        storefront: {
          query: async () => {
            throw new Error('Storefront API not configured');
          },
        },
        cart: null,
        waitUntil: () => {},
      });

      // Merge security headers with response headers
      const respHeaders = {...SECURITY_HEADERS};
      response.headers.forEach((value, key) => {
        respHeaders[key] = value;
      });
      res.writeHead(response.status, respHeaders);

      const arrayBuffer = await response.arrayBuffer();
      res.end(Buffer.from(arrayBuffer));
    } catch (error) {
      console.error('Request error:', error.message);
      res.writeHead(500, {
        ...SECURITY_HEADERS,
        'Content-Type': 'text/html',
      });
      res.end('<h1>500 — Internal Server Error</h1>');
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Maison Masque running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
