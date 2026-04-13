import {Link} from '@remix-run/react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {Price} from '~/components/shared/Price';
import {useCart} from '~/lib/cartContext';
import {getElixirProducts, getProductByHandle, type Product} from '~/lib/products';

const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
};

const PDRN_TRIO_HANDLES = ['medicube-pdrn-milky-toner', 'medicube-pdrn-peptide-serum', 'medicube-pdrn-gel-mask'];

const PAIRING_NOTES: Record<string, string> = {
  'medicube-pdrn-milky-toner': 'Start here \u2014 the daily foundation of your PDRN practice',
};

const elixirProducts = getElixirProducts();

export function ElixirsPromo() {
  const {addItem} = useCart();

  const addProductToCart = (p: Product) => {
    addItem({
      id: `product-${p.handle}`,
      handle: p.handle,
      title: p.name,
      vendor: p.brand,
      featuredImage: null,
      priceRange: {minVariantPrice: {amount: p.price.toFixed(2), currencyCode: p.currency}},
    });
  };

  const trioProducts = PDRN_TRIO_HANDLES.map((h) => getProductByHandle(h)).filter(Boolean) as Product[];
  const trioTotal = trioProducts.reduce((s, p) => s + p.price, 0);

  return (
    <section className="py-14 lg:py-[100px] px-6" aria-label="The Elixirs">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <SectionLabel>The Elixirs</SectionLabel>
        <h2 className="font-display text-[clamp(24px,3.5vw,42px)] mt-3">
          The foundation beneath the ritual
        </h2>
        <p className="text-sm text-walnut mt-3 max-w-[600px] mx-auto leading-relaxed">
          Daily PDRN elixirs to amplify your masking practice. Apply before or
          after any ritual to deepen its effects.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-sand bg-sand max-w-[960px] mx-auto">
        {elixirProducts.map((product) => {
          const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';
          const isTrending = product.handle === 'medicube-pdrn-milky-toner';
          const pairingNote = PAIRING_NOTES[product.handle];

          return (
            <div key={product.handle} className="bg-cream group">
              <div className={`h-[240px] bg-gradient-to-b ${gradient} flex items-center justify-center overflow-hidden relative`}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={`${product.brand} ${product.name} - Maison Masque`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span
                    className="font-display text-7xl select-none group-hover:scale-105 transition-transform duration-500"
                    style={{color: `${product.heroColor}20`}}
                  >
                    ✧
                  </span>
                )}
                {isTrending && (
                  <span className="absolute top-3 right-3 text-[9px] uppercase tracking-[2px] font-semibold text-gold border border-gold/40 rounded-full px-2 py-0.5 font-body bg-cream/80">
                    Trending
                  </span>
                )}
              </div>

              <div className="p-5 text-center">
                <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                  {product.ritualName}
                </p>
                <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">
                  {product.brand}
                </p>
                <h3 className="font-display text-[17px] font-medium mt-2">
                  {product.name}
                </h3>
                <p className="text-[10px] text-stone mt-1">{product.subtitle}</p>
                <div className="flex items-baseline justify-center gap-2 mt-2">
                  {product.compareAtPrice > product.price && (
                    <Price amount={product.compareAtPrice} className="font-display text-sm text-stone line-through" />
                  )}
                  <Price amount={product.price} className="font-display text-lg" />
                </div>
                <Link
                  to={`/products/${product.handle}`}
                  className="inline-block mt-4 text-xs text-gold uppercase tracking-[3px] hover:text-ink transition-colors"
                >
                  Discover &rarr;
                </Link>
                {pairingNote && (
                  <p className="text-[11px] text-walnut italic mt-3">{pairingNote}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PDRN Trio callout */}
      <div className="max-w-[960px] mx-auto text-center mt-8 py-5 border border-sand border-t-0">
        <p className="text-[13px] text-walnut px-6">
          Combine all three Medicube PDRN products &mdash;{' '}
          <span className="text-ink">Elixir III</span> (toner) +{' '}
          <span className="text-ink">Elixir I</span> (serum) +{' '}
          <span className="text-ink">Ritual I</span> (mask) &mdash;{' '}
          for the complete PDRN practice.{' '}
          <Price amount={trioTotal} className="font-display text-ink" /> total.
        </p>
        <button
          type="button"
          onClick={() => {
            for (const p of trioProducts) addProductToCart(p);
          }}
          className="mt-3 text-xs text-gold uppercase tracking-[3px] hover:text-ink transition-colors"
        >
          Add the PDRN Trio to cart &rarr;
        </button>
      </div>
    </section>
  );
}
