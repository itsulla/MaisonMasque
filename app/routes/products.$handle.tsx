import {useLoaderData, type MetaFunction} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {ProductPage} from '~/components/product/ProductPage';
import {PRODUCT_QUERY} from '~/lib/queries';

interface Product {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  descriptionHtml: string;
  featuredImage: {url: string; altText: string | null} | null;
  priceRange: {
    minVariantPrice: {amount: string; currencyCode: string};
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      price: {amount: string; currencyCode: string};
    }>;
  };
  metafields: Array<{key: string; value: string}>;
}

interface LoaderData {
  product: Product;
  __isMockData: boolean;
}

const MOCK_PRODUCT: Product = {
  id: 'gid://shopify/Product/mock',
  title: 'Bio-Collagen Real Deep Mask',
  handle: 'biodance-collagen',
  vendor: 'Biodance',
  descriptionHtml:
    '<p>An overnight hydrogel mask that turns transparent as collagen absorbs into the skin. Ultra-low molecular collagen (243 daltons) penetrates deep for visible plumping and hydration.</p>',
  featuredImage: null,
  priceRange: {
    minVariantPrice: {amount: '24.00', currencyCode: 'USD'},
  },
  variants: {
    nodes: [
      {
        id: 'gid://shopify/ProductVariant/mock-1',
        title: 'Default',
        availableForSale: true,
        price: {amount: '24.00', currencyCode: 'USD'},
      },
    ],
  },
  metafields: [
    {key: 'ritual_number', value: 'I'},
    {key: 'ritual_name', value: 'Restore'},
  ],
};

export const meta: MetaFunction<typeof loader> = ({data, params}) => {
  const product = data?.product;
  const title = product
    ? `${product.title} | Maison Masque`
    : 'Product | Maison Masque';
  const description = product
    ? `Shop ${product.title} by ${product.vendor} at Maison Masque. Curated Korean sheet masks shipped worldwide.`
    : 'Shop curated Korean sheet masks at Maison Masque.';
  const imageUrl = product?.featuredImage?.url;
  const canonicalUrl = `https://maisonmasque.com/products/${params.handle}`;

  return [
    {title},
    {name: 'description', content: description},
    {tagName: 'link', rel: 'canonical', href: canonicalUrl},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'product'},
    ...(imageUrl ? [{property: 'og:image', content: imageUrl}] : []),
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    ...(imageUrl ? [{name: 'twitter:image', content: imageUrl}] : []),
  ];
};

export async function loader({params, context}: LoaderFunctionArgs): Promise<LoaderData> {
  const {handle} = params;

  try {
    const {product} = await (context as any).storefront.query(PRODUCT_QUERY, {
      variables: {handle},
    });

    if (!product) {
      throw new Response('Not Found', {status: 404});
    }

    return {product, __isMockData: false};
  } catch (error) {
    if (error instanceof Response) throw error;

    const message = error instanceof Error ? error.message : String(error);
    console.warn('[MOCK_FALLBACK]', {route: `products/${handle}`, reason: message});
    return {product: {...MOCK_PRODUCT, handle: handle ?? MOCK_PRODUCT.handle}, __isMockData: true};
  }
}

function ProductJsonLd({product}: {product: Product}) {
  const price = product.priceRange?.minVariantPrice;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.descriptionHtml
      ? product.descriptionHtml.replace(/<[^>]*>/g, '')
      : '',
    image: product.featuredImage?.url,
    brand: {
      '@type': 'Brand',
      name: product.vendor,
    },
    offers: {
      '@type': 'Offer',
      price: price?.amount ?? '0',
      priceCurrency: price?.currencyCode ?? 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
    />
  );
}

export default function ProductRoute() {
  const {product} = useLoaderData<LoaderData>();

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductPage product={product} />
    </>
  );
}

export function ErrorBoundary() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-3xl mb-4">Something went wrong</h1>
      <p className="text-stone text-sm mb-8">We couldn't load this page. Please try again.</p>
      <a href="/" className="text-xs uppercase tracking-[3px] text-gold hover:text-ink transition-colors">
        Return to the Maison
      </a>
    </div>
  );
}
