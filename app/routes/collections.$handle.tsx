import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState, useMemo, useCallback} from 'react';
import {products as allProducts, type Product} from '~/lib/products';
import {
  aliasResponseToMap,
  mergeAllProducts,
  type MergedProduct,
  type ShopifyProduct,
} from '~/lib/productAdapter';
import {
  buildProductsByHandlesQuery,
  productsByHandlesVariables,
} from '~/lib/queries';
import {useCart} from '~/lib/cartContext';
import {Price} from '~/components/shared/Price';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {RitualNumeral} from '~/components/shared/RitualNumeral';

const FORMATS = ['All', 'Sheet Mask', 'Hydrogel', 'Overnight', 'Wrapping Mask', 'Elixir', 'Sunscreen', 'Bundle'] as const;
type SortOption = 'featured' | 'price-asc' | 'price-desc';

// Curated display order — interleaves categories for natural browsing.
// Keep in sync with app/lib/products.ts (17 listed products).
const FEATURED_ORDER: string[] = [
  'medicube-pdrn-gel-mask',              // Ritual I
  'medicube-pdrn-milky-toner',           // Elixir III (PDRN toner — prep)
  'medicube-pdrn-peptide-serum',         // Elixir I (PDRN serum — amplify)
  'medicube-wrapping-mask',              // Ritual II
  'abib-heartleaf-gummy-mask',           // Ritual III
  'anua-pdrn-ha-capsule-serum',          // Anua PDRN serum
  'numbuzin-no3-pore-mask',              // Ritual IV
  'skin1004-centella-sleeping-pack',     // Ritual V
  'centellian24-madeca-pdrn',            // Centellian24 cream
  'medicube-pdrn-caffeine-wrapping',     // Overnight mask
  'medicube-pdrn-tension-mask',          // Sheet mask (contouring)
  'medicube-pdrn-whip-cleanser',         // Cleanse
  'mixsoon-bean-cleansing-oil',          // Oil cleanse
  'beauty-of-joseon-relief-sun',         // Morning Veil (clear)
  'medicube-pdrn-sun-cream',             // Morning Veil (tone-up)
  'the-medicube-bundle',                 // Medicube bundle
  'the-complete-ritual',                 // Flagship bundle last
];

export const meta: MetaFunction = ({params}) => {
  const handle = params.handle ?? 'all';
  const titles: Record<string, string> = {
    'all': 'All Products | Maison Masque',
    'the-five-rituals': 'The Five Rituals | Maison Masque',
    'morning-veil': 'The Morning Veil — Sun Protection | Maison Masque',
    'elixirs': 'The Elixirs — PDRN Formulations | Maison Masque',
  };
  const title = titles[handle] ?? 'Collection | Maison Masque';
  return [
    {title},
    {name: 'description', content: 'Shop curated Korean skincare at Maison Masque.'},
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const handle = params.handle ?? 'all';

  // Batch-fetch live Shopify data for every editorial handle in the catalogue
  // (including 'unlisted' ones — they may still appear via direct URL and we
  // want their data hydrated). Failures fall back to products.ts via the
  // merge adapter, so a Shopify outage doesn't break the collection view.
  // Hydrogen auto-injects country/language from server.ts i18n config, so
  // productsByHandlesVariables returns just the per-handle aliases.
  const handles = allProducts.map((p) => p.handle);
  let liveByHandle = new Map<string, ShopifyProduct>();
  try {
    const query = buildProductsByHandlesQuery(handles);
    const variables = productsByHandlesVariables(handles);
    const response = await context.storefront.query<
      Record<string, ShopifyProduct | null>
    >(query, {variables});
    liveByHandle = aliasResponseToMap(handles, response);
  } catch (err) {
    console.warn('[collections.$handle] Storefront batch query failed, falling back:', err);
  }

  const merged = mergeAllProducts(liveByHandle);
  return json({handle, products: merged});
}

export default function CollectionRoute() {
  const {handle, products} = useLoaderData<typeof loader>();

  // Collection pages must exclude 'unlisted' products — these are reachable
  // via direct URL only, not through collection browsing.
  const listed = products.filter((p) => !p.tags?.includes('unlisted'));

  if (handle === 'all') {
    return <AllMasksPage listed={listed} />;
  }

  if (handle === 'the-five-rituals') {
    return <AllMasksPage listed={listed} ritualOnly />;
  }

  if (handle === 'morning-veil') {
    return <AllMasksPage listed={listed} collectionFilter="morning-veil" />;
  }

  if (handle === 'elixirs') {
    return <AllMasksPage listed={listed} collectionFilter="elixir" />;
  }

  // Fallback for unknown collections
  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
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

function AllMasksPage({
  listed,
  ritualOnly = false,
  collectionFilter,
}: {
  listed: MergedProduct[];
  ritualOnly?: boolean;
  collectionFilter?: string;
}) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sort, setSort] = useState<SortOption>('featured');
  const {addItem} = useCart();

  const baseProducts = ritualOnly
    ? listed.filter((p) => p.collection === 'ritual')
    : collectionFilter
      ? listed.filter((p) => p.collection === collectionFilter)
      : listed;

  const filtered = useMemo(() => {
    let list = baseProducts;
    if (activeFilter !== 'All') {
      // "Sunscreen" matches "Sunscreen" and "Tinted Sunscreen"; "Overnight" matches "Sleeping Pack"
      list = list.filter((p) =>
        activeFilter === 'Sunscreen'
          ? p.format.includes('Sunscreen')
          : activeFilter === 'Overnight'
            ? p.format.includes('Sleeping')
            : p.format === activeFilter,
      );
    }
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      default: {
        // Featured: use curated interleaved order
        const orderMap = new Map(FEATURED_ORDER.map((h, i) => [h, i]));
        return [...list].sort((a, b) =>
          (orderMap.get(a.handle) ?? 99) - (orderMap.get(b.handle) ?? 99),
        );
      }
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

  const pageTitle = ritualOnly
    ? 'The Five Rituals'
    : collectionFilter === 'morning-veil'
      ? 'The Morning Veil'
      : collectionFilter === 'elixir'
        ? 'The Elixirs'
        : 'All Products';
  const subtitle = ritualOnly
    ? 'Five masks. Five intentions.'
    : collectionFilter === 'morning-veil'
      ? 'Sun protection as the final step of your morning practice.'
      : collectionFilter === 'elixir'
        ? 'PDRN elixirs to amplify your ritual practice.'
        : `${listed.length} ways to begin your ritual`;

  return (
    <div>
      {ritualOnly ? (
        <div className="silk-hero-bg">
          <div className="max-w-7xl mx-auto px-6 pt-24">
            <nav className="text-xs text-stone" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-walnut">{pageTitle}</span>
            </nav>
          </div>
          <section className="max-w-3xl mx-auto px-6 pt-16 pb-24 text-center">
            <SectionLabel>Collection I</SectionLabel>
            <h1 className="silk-hero-title font-display mt-4">
              The Five <span className="italic text-gold">Rituals</span>
            </h1>
            <div className="h-px w-[60px] bg-gold mx-auto mt-6 mb-8" />
            <p className="text-base text-stone max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </section>
        </div>
      ) : null}

    <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
      {!ritualOnly && (
        <>
          {/* Breadcrumb */}
          <nav className="text-xs text-stone mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-walnut">{pageTitle}</span>
          </nav>

          {/* Header */}
          <h1 className="font-display text-4xl">{pageTitle}</h1>
          <p className="text-sm text-walnut mt-2">{subtitle}</p>
        </>
      )}

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
                  className={`product-tile-bg ${isBundle ? 'h-[280px]' : 'h-[340px]'} flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-[1.01] relative`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={`${product.brand} ${product.name} - Maison Masque`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span
                      className="font-display select-none"
                      style={{
                        fontSize: isBundle ? '80px' : '100px',
                        color: `${product.heroColor}18`,
                      }}
                    >
                      {product.ritualNumber
                        ?? (product.collection === 'morning-veil' ? '☀'
                          : product.collection === 'elixir' ? '✧'
                            : 'MM')}
                    </span>
                  )}
                  {ritualOnly && product.ritualNumeral && (
                    <RitualNumeral numeral={product.ritualNumeral} />
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-5">
                {product.ritualNumber ? (
                  <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                    Ritual {product.ritualNumber} &mdash; {product.ritualName}
                  </p>
                ) : (
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
