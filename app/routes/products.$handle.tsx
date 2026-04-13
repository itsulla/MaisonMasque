import {useLoaderData, type MetaFunction} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {ProductPage} from '~/components/product/ProductPage';
import {getProductByHandle} from '~/lib/products';

interface LoaderData {
  handle: string;
}

export const meta: MetaFunction<typeof loader> = ({data, params}) => {
  const handle = params.handle ?? '';
  const product = getProductByHandle(handle);
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
    ? `https://maisonmasque.com${product.image}`
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

export async function loader({params}: LoaderFunctionArgs): Promise<LoaderData> {
  const handle = params.handle ?? '';
  return {handle};
}

function ProductJsonLd({handle}: {handle: string}) {
  const product = getProductByHandle(handle);
  if (!product) return null;

  const imageUrl = product.image
    ? `https://maisonmasque.com${product.image}`
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
      availability: 'https://schema.org/InStock',
      url: `https://maisonmasque.com/products/${product.handle}`,
      seller: {
        '@type': 'Organization',
        name: 'Maison Masque',
      },
    },
    category: product.collection === 'morning-veil'
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

  // BreadcrumbList
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
        name: product.collection === 'morning-veil'
          ? 'The Morning Veil'
          : product.collection === 'elixir'
            ? 'The Elixirs'
            : 'The Five Rituals',
        item: product.collection === 'morning-veil'
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
  const {handle} = useLoaderData<LoaderData>();

  return (
    <>
      <ProductJsonLd handle={handle} />
      <ProductPage handle={handle} />
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
