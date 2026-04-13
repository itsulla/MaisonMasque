import {useMemo} from 'react';
import {getProductByHandle} from '~/lib/products';
import {RitualNumeral} from '~/components/shared/RitualNumeral';

interface BundleFixedContentsProps {
  title: string;
  handles: string[];
}

/**
 * Shows a fixed "all included" row of products with a small "Included" badge.
 * Used for The Complete Ritual — the 5 masks that ship in every bundle.
 */
export function BundleFixedContents({title, handles}: BundleFixedContentsProps) {
  const products = useMemo(() => {
    return handles
      .map(getProductByHandle)
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [handles]);

  return (
    <section className="py-14 px-6 max-w-7xl mx-auto" aria-label="Included in this bundle">
      <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-sand">
        <h3 className="font-display text-[clamp(22px,2.5vw,28px)] text-ink">{title}</h3>
        <span
          className="text-[11px] uppercase tracking-[3px] font-semibold font-body text-gold"
          aria-live="polite"
        >
          All {products.length} included
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product.handle}
            className="bg-cream border border-sand relative"
          >
            {/* Included badge */}
            <div
              className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[9px] uppercase tracking-[2px] font-semibold font-body"
              style={{backgroundColor: '#C5A55A', color: '#FAF8F3'}}
              aria-hidden="true"
            >
              Included
            </div>

            <div className="product-tile-bg h-[180px] flex items-center justify-center overflow-hidden relative">
              {product.image ? (
                <img
                  src={product.image}
                  alt={`${product.brand} ${product.name} - Maison Masque`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="font-display text-5xl text-sand">
                  {product.ritualNumber ?? '✧'}
                </span>
              )}
              {product.ritualNumeral && <RitualNumeral numeral={product.ritualNumeral} />}
            </div>

            <div className="p-4">
              <p className="text-[10px] uppercase tracking-[2px] text-stone">
                {product.brand}
              </p>
              <h4 className="font-display text-[14px] text-ink mt-1 leading-snug">
                {product.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
