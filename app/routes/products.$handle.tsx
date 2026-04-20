import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {ProductPage} from '~/components/product/ProductPage';
import {ElixirsPromo} from '~/components/home/ElixirsPromo';
import {MorningVeilPromo} from '~/components/home/MorningVeilPromo';
import {mergeProduct, type MergedProduct, type ShopifyProduct} from '~/lib/productAdapter';
import {getRitualProducts} from '~/lib/products';
import {PRODUCT_QUERY} from '~/lib/queries';

interface LoaderData {
  product: MergedProduct;
}

export const meta: MetaFunction<typeof loader> = ({data, params}) => {
  const handle = params.handle ?? '';
  const product = data?.product ?? null;
  const title = product
    ? `${product.name} by ${product.brand} | Maison Masque`
    : 'Product | Maison Masque';
  const isMorningVeil = product?.collection === 'morning-veil';
  const isElixir = product?.collection === 'elixir';
  const description = product
    ? isMorningVeil
      ? `${product.name} by ${product.brand} — Korean sunscreen SPF50+ PA++++. ${product.description}`
      : isElixir
        ? `${product.name} by ${product.brand} — Korean PDRN elixir. ${product.description}`
        : product.description
    : 'Shop curated Korean skincare at Maison Masque.';
  const canonicalUrl = `https://maisonmasque.com/products/${handle}`;
  const imageUrl = product?.image
    ? product.image.startsWith('http')
      ? product.image
      : `https://maisonmasque.com${product.image}`
    : 'https://maisonmasque.com/images/og-default.jpg';

  return [
    {title},
    {name: 'description', content: description},
    {tagName: 'link', rel: 'canonical', href: canonicalUrl},
    // OpenGraph
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'product'},
    {property: 'og:url', content: canonicalUrl},
    {property: 'og:image', content: imageUrl},
    {property: 'og:site_name', content: 'Maison Masque'},
    // Product-specific OG
    ...(product
      ? [
          {property: 'product:price:amount', content: product.price.toFixed(2)},
          {property: 'product:price:currency', content: product.currency},
          {property: 'product:brand', content: product.brand},
        ]
      : []),
    // Twitter
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: imageUrl},
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const handle = params.handle ?? '';

  // Fetch live Storefront API data in parallel with the fallback. Wrapped in
  // try/catch so a Shopify outage (or an unpublished handle) doesn't block
  // rendering — mergeProduct() handles null live data by using products.ts only.
  // Hydrogen's storefront client auto-injects the `country`/`language`
  // variables from its i18n config (set per-request in server.ts based on
  // cookie + Oxygen-Buyer-Country header), so we only pass the handle here.
  let live: ShopifyProduct | null = null;
  try {
    const result = await context.storefront.query<{product: ShopifyProduct | null}>(
      PRODUCT_QUERY,
      {variables: {handle}},
    );
    live = result?.product ?? null;
  } catch (err) {
    console.warn(`[products.$handle] Storefront API query failed for ${handle}:`, err);
  }

  const product = mergeProduct(handle, live);

  // True 404: neither Shopify nor products.ts knows this handle. Without this
  // response status, deleted products render as empty shells with HTTP 200.
  if (!product) {
    throw new Response('Product not found', {status: 404});
  }

  return json<LoaderData>({product});
}

function ProductJsonLd({product}: {product: MergedProduct}) {
  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `https://maisonmasque.com${product.image}`
    : undefined;

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://maisonmasque.com/products/${product.handle}`,
      seller: {
        '@type': 'Organization',
        name: 'Maison Masque',
      },
    },
    category:
      product.collection === 'morning-veil'
        ? 'Beauty > Skincare > Sunscreen'
        : product.collection === 'elixir'
          ? 'Beauty > Skincare > Serums'
          : 'Beauty > Skincare > Face Masks',
    sku: product.handle,
  };

  if (imageUrl) {
    jsonLd.image = imageUrl;
  }

  if (product.keyIngredient) {
    jsonLd.additionalProperty = {
      '@type': 'PropertyValue',
      name: 'Key Ingredient',
      value: product.keyIngredient,
    };
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://maisonmasque.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name:
          product.collection === 'morning-veil'
            ? 'The Morning Veil'
            : product.collection === 'elixir'
              ? 'The Elixirs'
              : 'The Five Rituals',
        item:
          product.collection === 'morning-veil'
            ? 'https://maisonmasque.com/the-morning-veil'
            : product.collection === 'elixir'
              ? 'https://maisonmasque.com/collections/elixirs'
              : 'https://maisonmasque.com/collections/the-five-rituals',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://maisonmasque.com/products/${product.handle}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbLd)}}
      />
    </>
  );
}

export default function ProductRoute() {
  const {product} = useLoaderData<typeof loader>();

  // MorningVeilPromo renders only when the current product IS a ritual
  // (i.e. not on the morning-veil product's own page, and not on elixirs etc.).
  const ritualHandles = new Set(getRitualProducts().map((p) => p.handle));
  const isRitual = ritualHandles.has(product.handle);

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductPage product={product} />

      {/* Elixirs promo — on every PDP, below the product content */}
      <section className="py-14">
        <ElixirsPromo />
      </section>

      {/* Morning Veil promo — only on the 5 ritual PDPs */}
      {isRitual && (
        <section className="py-14">
          <MorningVeilPromo />
        </section>
      )}
    </>
  );
}

export function ErrorBoundary() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-3xl mb-4">Something went wrong</h1>
      <p className="text-walnut text-sm mb-8">We couldn&apos;t load this page. Please try again.</p>
      <a href="/" className="text-xs uppercase tracking-[3px] text-gold hover:text-ink transition-colors">
        Return to the Maison
      </a>
    </div>
  );
}
