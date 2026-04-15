/**
 * /sitemap.xml — static-ish sitemap built from the products catalogue.
 * Oxygen will cache this at the edge; re-deploy invalidates.
 */
import {products} from '~/lib/products';

const BASE = 'https://maisonmasque.com';

const STATIC_ROUTES = [
  '/',
  '/collections/the-evening-ritual',
  '/collections/the-morning-veil',
  '/collections/elixirs',
  '/products/the-complete-ritual',
  '/the-practice',
  '/philosophy',
  '/ingredients',
  '/quiz',
  '/faq',
  '/contact',
  '/build-your-own',
];

const POLICY_PAGES = [
  '/policies/privacy-policy',
  '/policies/terms-of-service',
  '/policies/refund-policy',
  '/policies/shipping-policy',
];

function urlEntry(loc: string, priority = '0.7', changefreq = 'weekly') {
  return `  <url>
    <loc>${BASE}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function loader() {
  const entries: string[] = [];

  // Homepage first, highest priority
  entries.push(urlEntry('/', '1.0', 'daily'));

  // Static pages
  for (const route of STATIC_ROUTES.slice(1)) {
    entries.push(urlEntry(route, '0.7', 'weekly'));
  }

  // All products
  for (const p of products) {
    entries.push(urlEntry(`/products/${p.handle}`, '0.9', 'weekly'));
  }

  // Legal pages (lower priority, rarely change)
  for (const route of POLICY_PAGES) {
    entries.push(urlEntry(route, '0.3', 'yearly'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
