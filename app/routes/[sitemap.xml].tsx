/**
 * /sitemap.xml — product and collection URLs are derived from Shopify live
 * data (with `lastmod` reflecting real Shopify updatedAt), with a fallback
 * to the local products.ts catalogue on Storefront API failure.
 *
 * Oxygen caches this at the edge; re-deploy invalidates.
 */

import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {SITEMAP_QUERY} from '~/lib/queries';
import {products} from '~/lib/products';

const BASE = 'https://maisonmasque.com';

// NOTE: collection URLs must match real handles served by
// collections.$handle.tsx — otherwise Google sees a soft-404 and
// flags the sitemap entry as "Page with redirect" or indexes a bad
// canonical. `/collections/the-evening-ritual` and
// `/collections/the-morning-veil` previously pointed at routes that
// do not exist (the real routes are `/products/the-evening-ritual`
// and the `/the-morning-veil` landing page). Product URLs are emitted
// by the product loop below, so no need to duplicate them here.
const STATIC_ROUTES: Array<[string, string, string]> = [
  ['/', '1.0', 'daily'],
  ['/collections/all', '0.8', 'weekly'],
  ['/collections/the-five-rituals', '0.9', 'weekly'],
  ['/collections/elixirs', '0.8', 'weekly'],
  ['/collections/morning-veil', '0.8', 'weekly'],
  ['/the-morning-veil', '0.7', 'weekly'],
  ['/products/the-complete-ritual', '0.9', 'weekly'],
  ['/the-practice', '0.7', 'weekly'],
  ['/philosophy', '0.7', 'weekly'],
  ['/ingredients', '0.7', 'weekly'],
  ['/quiz', '0.7', 'weekly'],
  ['/faq', '0.7', 'weekly'],
  ['/contact', '0.7', 'weekly'],
  ['/build-your-own', '0.7', 'weekly'],
];

const POLICY_PAGES: string[] = [
  '/policies/privacy-policy',
  '/policies/terms-of-service',
  '/policies/refund-policy',
  '/policies/shipping-policy',
];

function urlEntry(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod?: string,
) {
  const lastmodTag = lastmod
    ? `
    <lastmod>${lastmod}</lastmod>`
    : '';
  return `  <url>
    <loc>${BASE}${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

interface SitemapQueryResult {
  products: {
    pageInfo: {hasNextPage: boolean; endCursor: string | null};
    nodes: Array<{handle: string; updatedAt: string}>;
  };
  collections: {
    nodes: Array<{handle: string; updatedAt: string}>;
  };
}

export async function loader({context}: LoaderFunctionArgs) {
  const entries: string[] = [];
  // Track emitted paths so live collection handles that duplicate a static
  // route (e.g. `elixirs`) aren't written twice.
  const emittedPaths = new Set<string>();

  // Homepage + static pages
  for (const [route, priority, changefreq] of STATIC_ROUTES) {
    entries.push(urlEntry(route, priority, changefreq));
    emittedPaths.add(route);
  }

  // Products + collections from Shopify, with fallback to products.ts if the
  // Storefront API is unreachable. Handles that exist locally but aren't
  // visible in Storefront API are still surfaced via the fallback path so we
  // don't silently drop PDPs from the sitemap.
  let liveProductHandles = new Map<string, string>();
  let liveCollectionHandles = new Map<string, string>();
  try {
    // country/language auto-injected by Hydrogen from server.ts i18n config.
    const data = await context.storefront.query<SitemapQueryResult>(
      SITEMAP_QUERY,
      {variables: {first: 250, after: null}},
    );
    for (const p of data?.products?.nodes ?? []) {
      liveProductHandles.set(p.handle, p.updatedAt);
    }
    for (const c of data?.collections?.nodes ?? []) {
      liveCollectionHandles.set(c.handle, c.updatedAt);
    }
  } catch (err) {
    console.warn('[sitemap.xml] Storefront SITEMAP_QUERY failed, falling back to products.ts:', err);
  }

  // Unified product list: union of Shopify-visible handles + local catalogue.
  // Local catalogue wins for URL inclusion (so invisible-in-Shopify products
  // still appear), but Shopify's updatedAt wins for lastmod when available.
  const allProductHandles = new Set<string>([
    ...liveProductHandles.keys(),
    ...products.map((p) => p.handle),
  ]);
  for (const handle of allProductHandles) {
    const path = `/products/${handle}`;
    if (emittedPaths.has(path)) continue;
    const lastmod = liveProductHandles.get(handle);
    entries.push(urlEntry(path, '0.9', 'weekly', lastmod));
    emittedPaths.add(path);
  }

  for (const [handle, lastmod] of liveCollectionHandles) {
    const path = `/collections/${handle}`;
    if (emittedPaths.has(path)) continue;
    entries.push(urlEntry(path, '0.7', 'weekly', lastmod));
    emittedPaths.add(path);
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
