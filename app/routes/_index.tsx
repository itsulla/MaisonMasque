import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Hero} from '~/components/home/Hero';
import {Divider} from '~/components/shared/Divider';
import {FiveRituals} from '~/components/home/FiveRituals';
import {Philosophy} from '~/components/home/Philosophy';
import {COLLECTION_QUERY} from '~/lib/queries';

// Components that may not exist yet — lazy placeholders
let RitualGuide: React.FC;
let Subscription: React.FC;

try {
  RitualGuide =
    require('~/components/home/RitualGuide').RitualGuide;
} catch {
  RitualGuide = () => null;
}

try {
  Subscription =
    require('~/components/home/Subscription').Subscription;
} catch {
  Subscription = () => null;
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

const MOCK_PRODUCTS = [
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

export async function loader({context}: any) {
  try {
    const {collection} = await context.storefront.query(COLLECTION_QUERY, {
      variables: {handle: 'the-five-rituals'},
    });

    if (!collection) {
      return {products: MOCK_PRODUCTS};
    }

    const products = collection.products?.nodes ?? [];
    return {products: products.length > 0 ? products : MOCK_PRODUCTS};
  } catch (error) {
    console.error('Failed to fetch collection:', error);
    return {products: MOCK_PRODUCTS};
  }
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <>
      <Hero />
      <Divider />
      <FiveRituals products={products} />
      <Divider />
      <Philosophy />
      <Divider />
      {RitualGuide && <RitualGuide />}
      {RitualGuide && <Divider />}
      {Subscription && <Subscription />}
    </>
  );
}
