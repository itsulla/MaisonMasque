import {useLoaderData, type MetaFunction} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Hero} from '~/components/home/Hero';
import {Divider} from '~/components/shared/Divider';
import {FiveRituals} from '~/components/home/FiveRituals';
import {Philosophy} from '~/components/home/Philosophy';
import {RitualGuide} from '~/components/home/RitualGuide';
import {Subscription} from '~/components/home/Subscription';
import {COLLECTION_QUERY} from '~/lib/queries';

interface Product {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  featuredImage: {url: string; altText: string | null} | null;
  priceRange: {
    minVariantPrice: {amount: string; currencyCode: string};
  };
  metafields: Array<{key: string; value: string}>;
}

interface LoaderData {
  products: Product[];
  __isMockData: boolean;
}

export const meta: MetaFunction = () => {
  return [
    {
      title:
        'Maison Masque | Korean Sheet Masks | The House of Masks',
    },
    {
      name: 'description',
      content:
        'Curated Korean sheet masks from Biodance, Torriden, Abib, Mediheal and Numbuzin. Shipped worldwide to Australia, UK, Europe and South Africa.',
    },
  ];
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://shopify/Product/mock-1',
    title: 'Bio-Collagen Real Deep Mask',
    handle: 'biodance-collagen',
    vendor: 'Biodance',
    featuredImage: null,
    priceRange: {
      minVariantPrice: {amount: '24.00', currencyCode: 'USD'},
    },
    metafields: [
      {key: 'ritual_number', value: 'I'},
      {key: 'ritual_name', value: 'Restore'},
    ],
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
    metafields: [
      {key: 'ritual_number', value: 'II'},
      {key: 'ritual_name', value: 'Drench'},
    ],
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
    metafields: [
      {key: 'ritual_number', value: 'III'},
      {key: 'ritual_name', value: 'Calm'},
    ],
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
    metafields: [
      {key: 'ritual_number', value: 'IV'},
      {key: 'ritual_name', value: 'Replenish'},
    ],
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
    metafields: [
      {key: 'ritual_number', value: 'V'},
      {key: 'ritual_name', value: 'Illuminate'},
    ],
  },
];

export async function loader({context}: LoaderFunctionArgs): Promise<LoaderData> {
  try {
    const {collection} = await (context as any).storefront.query(COLLECTION_QUERY, {
      variables: {handle: 'the-five-rituals'},
    });

    if (!collection) {
      console.warn('[MOCK_FALLBACK]', {route: '_index', reason: 'Collection not found'});
      return {products: MOCK_PRODUCTS, __isMockData: true};
    }

    const products = collection.products?.nodes ?? [];
    if (products.length > 0) {
      return {products, __isMockData: false};
    }

    console.warn('[MOCK_FALLBACK]', {route: '_index', reason: 'Collection empty'});
    return {products: MOCK_PRODUCTS, __isMockData: true};
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[MOCK_FALLBACK]', {route: '_index', reason: message});
    return {products: MOCK_PRODUCTS, __isMockData: true};
  }
}

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Maison Masque',
  url: 'https://maisonmasque.com',
  description:
    'Curated Korean sheet masks from Biodance, Torriden, Abib, Mediheal and Numbuzin. Sourced in Hong Kong, shipped worldwide.',
};

export default function Homepage() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      {data.__isMockData && process.env.NODE_ENV !== 'production' && (
        <div className="bg-gold/10 text-center py-1 text-xs text-gold">
          Demo mode — Storefront API not connected
        </div>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(ORGANIZATION_JSON_LD)}}
      />
      <Hero />
      <Divider />
      <FiveRituals products={data.products} />
      <Divider />
      <Philosophy />
      <Divider />
      <RitualGuide />
      <Divider />
      <Subscription />
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
