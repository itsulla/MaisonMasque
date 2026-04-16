/**
 * Canonical URL helpers. Call `canonicalLink(location.pathname)` from a
 * route's `meta` function to emit a `<link rel="canonical">` tag that
 * points at the production origin and strips query/hash — this collapses
 * multi-currency (?_country=...) and tracking variants into a single
 * indexable URL, and tells Google which version is authoritative for
 * pages with shared shell content (collections, landing pages, etc).
 */

export const SITE_ORIGIN = 'https://maisonmasque.com';

/**
 * Normalise a pathname to its canonical form:
 *   - drop query string and fragment
 *   - drop trailing slash except on root
 */
export function canonicalPath(pathname: string): string {
  let path = pathname.split('?')[0].split('#')[0];
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path || '/';
}

export function canonicalHref(pathname: string): string {
  return `${SITE_ORIGIN}${canonicalPath(pathname)}`;
}

/**
 * Returns a Remix meta descriptor for a canonical link. Add to the
 * array returned by any route's `meta` function.
 */
export function canonicalLink(pathname: string) {
  return {
    tagName: 'link',
    rel: 'canonical',
    href: canonicalHref(pathname),
  } as const;
}
