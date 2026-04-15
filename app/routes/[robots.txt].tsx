/**
 * /robots.txt — points crawlers at the sitemap.
 */
export function loader() {
  const body = `User-agent: *
Allow: /

# Block admin/checkout/account surfaces
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /admin
Disallow: /api

Sitemap: https://maisonmasque.com/sitemap.xml
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
