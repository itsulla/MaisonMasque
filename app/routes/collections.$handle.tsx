import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {RitualCard} from '~/components/home/RitualCard';
import {COLLECTION_QUERY} from '~/lib/queries';

const MOCK_COLLECTION = {
  title: 'The Five Rituals',
  description:
    'Five masks. Five intentions. Each chosen from Korea\'s most revered houses.',
  handle: 'the-five-rituals',
  products: {
    nodes: [
      {
        id: 'gid://shopify/Product/mock-1',
        title: 'Bio-Collagen Real Deep Mask',
        handle: 'biodance-collagen',
        vendor: 'Biodance',
        featuredImage: null,
        priceRange: {
          minVariantPrice: {amount: '24.00', currencyCode: 'USD'},
        },
      },
      {
        id: 'gid://shopify/Product/mock-2',
        title: 'DIVE-IN Hyaluronic Acid Mask',
        handle: 'torriden-dive-in',
        vendor: 'Torriden',
        featuredImage: null,
        priceRange: {
          minVariantPrice: {amount: '38.00', currencyCode: 'USD'},
        },
      },
      {
        id: 'gid://shopify/Product/mock-3',
        title: 'Heartleaf Gummy Sheet Mask',
        handle: 'abib-heartleaf',
        vendor: 'Abib',
        featuredImage: null,
        priceRange: {
          minVariantPrice: {amount: '32.00', currencyCode: 'USD'},
        },
      },
      {
        id: 'gid://shopify/Product/mock-4',
        title: 'N.M.F Ampoule Mask',
        handle: 'mediheal-nmf',
        vendor: 'Mediheal',
        featuredImage: null,
        priceRange: {
          minVariantPrice: {amount: '18.00', currencyCode: 'USD'},
        },
      },
      {
        id: 'gid://shopify/Product/mock-5',
        title: 'No.3 Skin Softening Mask',
        handle: 'numbuzin-no3',
        vendor: 'Numbuzin',
        featuredImage: null,
        priceRange: {
          minVariantPrice: {amount: '26.00', currencyCode: 'USD'},
        },
      },
    ],
  },
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const collection = data?.collection;
  return [
    {
      title: collection
        ? `${collection.title} | Maison Masque`
        : 'Collection | Maison Masque',
    },
    {
      name: 'description',
      content: collection?.description ?? 'Shop curated Korean sheet masks at Maison Masque.',
    },
  ];
};

export async function loader({params, context}: any) {
  const {handle} = params;

  try {
    const {collection} = await context.storefront.query(COLLECTION_QUERY, {
      variables: {handle},
    });

    if (!collection) {
      throw new Response('Collection not found', {status: 404});
    }

    return {collection};
  } catch (error) {
    if (error instanceof Response) throw error;

    console.error('Failed to fetch collection:', error);
    return {collection: {...MOCK_COLLECTION, handle}};
  }
}

export default function CollectionRoute() {
  const {collection} = useLoaderData<typeof loader>();
  const products = collection.products?.nodes ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body">
          Collection
        </span>
        <h1 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-sm text-stone mt-3 max-w-xl mx-auto">
            {collection.description}
          </p>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border border-sand">
        {products.map((product: any, index: number) => (
          <a
            key={product.id}
            href={`/products/${product.handle}`}
            className="block"
          >
            <RitualCard
              product={product}
              index={index}
              className={
                index < products.length - 1 ? 'border-r border-sand' : ''
              }
            />
          </a>
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-24">
          <div className="w-px h-[40px] bg-sand mx-auto mb-8" />
          <span className="text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body">
            Nothing here yet
          </span>
          <h2 className="font-display text-2xl text-stone mt-4">
            This collection awaits its first ritual
          </h2>
          <p className="text-sm text-stone mt-3 max-w-sm mx-auto leading-relaxed">
            We are carefully curating this selection. In the meantime,
            explore our signature collection.
          </p>
          <a
            href="/collections/the-five-rituals"
            className="inline-block mt-8 font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-ink text-cream hover:bg-espresso hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
          >
            The Five Rituals
          </a>
          <div className="w-[60px] h-px bg-gold mx-auto mt-12" />
        </div>
      )}
    </div>
  );
}
