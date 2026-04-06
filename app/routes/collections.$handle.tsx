import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useState, useMemo, useCallback} from 'react';
import {products as allProducts, getRitualProducts, type Product} from '~/lib/products';
import {useCart} from '~/lib/cartContext';
import {Price} from '~/components/shared/Price';
import {SectionLabel} from '~/components/shared/SectionLabel';

interface LoaderData {
  handle: string;
}

const FORMATS = ['All', 'Sheet Mask', 'Hydrogel', 'Sleeping Mask', 'Wrapping Mask', 'Bundle'] as const;
type SortOption = 'featured' | 'price-asc' | 'price-desc';

const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
  '#8FA68E': 'from-sage/30 to-ivory',
  '#C5A55A': 'from-gold/20 to-ivory',
};

export const meta: MetaFunction = ({params}) => {
  const handle = params.handle ?? 'all';
  const title = handle === 'all'
    ? 'All Masks | Maison Masque'
    : handle === 'the-five-rituals'
      ? 'The Five Rituals | Maison Masque'
      : 'Collection | Maison Masque';
  return [
    {title},
    {name: 'description', content: 'Shop curated Korean sheet masks at Maison Masque.'},
  ];
};

export async function loader({params}: LoaderFunctionArgs): Promise<LoaderData> {
  return {handle: params.handle ?? 'all'};
}

export default function CollectionRoute() {
  const {handle} = useLoaderData<LoaderData>();

  // For "all" and "the-five-rituals", render the full collection page
  if (handle === 'all') {
    return <AllMasksPage />;
  }

  if (handle === 'the-five-rituals') {
    return <AllMasksPage ritualOnly />;
  }

  // Fallback for unknown collections
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-3xl">Collection not found</h1>
      <p className="text-walnut text-sm mt-4">
        This collection doesn&apos;t exist yet.
      </p>
      <Link
        to="/collections/all"
        className="inline-block mt-8 text-xs uppercase tracking-[3px] text-gold hover:text-ink transition-colors"
      >
        Browse all masks &rarr;
      </Link>
    </div>
  );
}

function AllMasksPage({ritualOnly = false}: {ritualOnly?: boolean}) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sort, setSort] = useState<SortOption>('featured');
  const {addItem} = useCart();

  const baseProducts = ritualOnly ? getRitualProducts() : allProducts;

  const filtered = useMemo(() => {
    let list = baseProducts;
    if (activeFilter !== 'All') {
      list = list.filter((p) => p.format === activeFilter);
    }
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [baseProducts, activeFilter, sort]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem({
        id: `product-${product.handle}`,
        handle: product.handle,
        title: product.name,
        vendor: product.brand,
        featuredImage: null,
        priceRange: {
          minVariantPrice: {
            amount: product.price.toFixed(2),
            currencyCode: product.currency,
          },
        },
      });
    },
    [addItem],
  );

  const pageTitle = ritualOnly ? 'The Five Rituals' : 'All Masks';
  const subtitle = ritualOnly
    ? 'Five masks. Five intentions.'
    : 'Six ways to begin your ritual';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-walnut">{pageTitle}</span>
      </nav>

      {/* Header */}
      <h1 className="font-display text-4xl">{pageTitle}</h1>
      <p className="text-sm text-walnut mt-2">{subtitle}</p>

      {/* Filter + Sort row */}
      {!ritualOnly && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 mb-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-1">
            {FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[2px] font-semibold transition-colors ${
                  activeFilter === f
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-stone hover:text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-sand bg-cream text-walnut text-xs uppercase tracking-[0.15em] py-2 px-3 font-body appearance-none cursor-pointer focus:outline-none focus:border-gold transition-colors"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-sand bg-sand">
        {filtered.map((product) => {
          const isBundle = product.handle === 'the-complete-ritual';
          const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';
          const hasCompare = product.compareAtPrice > product.price;

          return (
            <div
              key={product.handle}
              className={`bg-cream group ${
                isBundle ? 'lg:col-span-2 border-2 border-gold relative' : ''
              }`}
            >
              {/* Most Popular badge */}
              {isBundle && (
                <div className="absolute top-3 left-3 z-10 bg-gold text-ink text-[10px] uppercase tracking-[2px] font-semibold px-3 py-1">
                  Most Popular
                </div>
              )}

              {/* Image */}
              <Link to={`/products/${product.handle}`} className="block">
                <div
                  className={`${isBundle ? 'h-[280px]' : 'h-[340px]'} bg-gradient-to-b ${gradient} flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]`}
                >
                  <span
                    className="font-display select-none"
                    style={{
                      fontSize: isBundle ? '80px' : '100px',
                      color: `${product.heroColor}18`,
                    }}
                  >
                    {product.ritualNumber ?? 'MM'}
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className="p-5">
                {product.ritualNumber && (
                  <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                    Ritual {product.ritualNumber} &mdash; {product.ritualName}
                  </p>
                )}
                {!product.ritualNumber && (
                  <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                    {product.ritualName}
                  </p>
                )}

                <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">
                  {product.brand}
                </p>

                <h3 className="font-display text-[17px] font-medium mt-2">
                  <Link
                    to={`/products/${product.handle}`}
                    className="hover:text-gold transition-colors"
                  >
                    {product.name}
                  </Link>
                </h3>

                <span className="inline-block text-[10px] text-stone border border-sand rounded-full px-2.5 py-0.5 mt-2">
                  {product.format}
                </span>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-baseline gap-2">
                    {hasCompare && (
                      <Price
                        amount={product.compareAtPrice}
                        className="font-display text-sm text-stone line-through"
                      />
                    )}
                    <Price amount={product.price} className="font-display text-xl" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="ritual-add w-8 h-8 border border-sand flex items-center justify-center text-stone transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.92]"
                    aria-label={`Add ${product.name} to bag`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty filter state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-cream border border-sand border-t-0">
          <p className="text-walnut text-sm">
            No products match this filter.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter('All')}
            className="text-xs text-gold mt-2 hover:underline"
          >
            Show all masks
          </button>
        </div>
      )}
    </div>
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
