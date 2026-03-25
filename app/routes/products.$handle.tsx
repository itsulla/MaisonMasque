import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {PRODUCT_QUERY} from '~/lib/queries';

// Product page component — try to import, fallback to inline
let ProductPage: React.FC<{product: any}>;

try {
  ProductPage =
    require('~/components/product/ProductPage').ProductPage;
} catch {
  ProductPage = ({product}: {product: any}) => (
    <DefaultProductLayout product={product} />
  );
}

const MOCK_PRODUCT = {
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

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const product = data?.product;
  return [
    {
      title: product
        ? `${product.title} | Maison Masque`
        : 'Product | Maison Masque',
    },
    {
      name: 'description',
      content: product
        ? `Shop ${product.title} by ${product.vendor} at Maison Masque. Curated Korean sheet masks shipped worldwide.`
        : 'Shop curated Korean sheet masks at Maison Masque.',
    },
  ];
};

export async function loader({params, context}: any) {
  const {handle} = params;

  try {
    const {product} = await context.storefront.query(PRODUCT_QUERY, {
      variables: {handle},
    });

    if (!product) {
      throw new Response('Product not found', {status: 404});
    }

    return {product};
  } catch (error) {
    // If it's a Response (404), re-throw
    if (error instanceof Response) throw error;

    console.error('Failed to fetch product:', error);
    return {product: {...MOCK_PRODUCT, handle}};
  }
}

function DefaultProductLayout({product}: {product: any}) {
  const price = product.priceRange?.minVariantPrice;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone mb-8">
        <a href="/" className="hover:text-gold transition-colors">
          Home
        </a>
        <span className="mx-2">/</span>
        <a
          href="/collections/the-five-rituals"
          className="hover:text-gold transition-colors"
        >
          The Five Rituals
        </a>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image */}
        <div className="bg-gradient-to-b from-sand/20 to-cream aspect-square flex items-center justify-center">
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-2xl text-sand">
              {product.vendor}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {/* Ritual label */}
          {product.metafields?.[0] && (
            <p className="text-[11px] uppercase tracking-[4px] font-semibold text-gold mb-2">
              Ritual {product.metafields[0].value} &mdash;{' '}
              {product.metafields[1]?.value}
            </p>
          )}

          {/* Brand */}
          <p className="text-[10px] uppercase tracking-[3px] text-stone">
            {product.vendor}
          </p>

          {/* Title */}
          <h1 className="font-display text-[28px] mt-2">{product.title}</h1>

          {/* Price */}
          {price && (
            <p className="font-display text-2xl mt-4">
              ${parseFloat(price.amount).toFixed(0)}
            </p>
          )}

          {/* Description */}
          {product.descriptionHtml && (
            <div
              className="text-sm text-stone leading-relaxed mt-6 prose prose-sm"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
          )}

          {/* Add to cart placeholder */}
          <button className="mt-8 w-full bg-ink text-cream py-4 text-xs uppercase tracking-[3px] font-body font-medium hover:bg-espresso transition-colors">
            Add to ritual
          </button>

          {/* Trust badges */}
          <div className="flex gap-6 mt-6 text-[10px] uppercase tracking-[2px] text-stone">
            <span>Authentic</span>
            <span>&middot;</span>
            <span>Ships from HK</span>
            <span>&middot;</span>
            <span>Free returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductRoute() {
  const {product} = useLoaderData<typeof loader>();

  return <ProductPage product={product} />;
}
