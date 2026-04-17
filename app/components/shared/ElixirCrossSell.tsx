import {Link} from '@remix-run/react';
import {getElixirProducts, getProductByHandle, type Product} from '~/lib/products';
import {useCart} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';
import {Price} from '~/components/shared/Price';

const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
};

const SHIPPING_THRESHOLDS_USD: Record<string, number> = {
  USD: 45, GBP: 36, AUD: 70, EUR: 42, ZAR: 820,
};

function getRate(currency: string): number {
  const rates: Record<string, number> = {USD: 1, AUD: 1.55, GBP: 0.79, EUR: 0.92, ZAR: 18.2};
  return rates[currency] ?? 1;
}

const PDRN_RITUAL_HANDLE = 'medicube-pdrn-gel-mask';
const PDRN_TRIO_HANDLES = ['medicube-pdrn-milky-toner', 'medicube-pdrn-peptide-serum', 'medicube-pdrn-gel-mask'];

interface ElixirCrossSellProps {
  currentHandle?: string;
}

export function ElixirCrossSell({currentHandle}: ElixirCrossSellProps) {
  const elixirProducts = getElixirProducts();
  const {addItem, subtotal} = useCart();
  const {currency} = useCurrency();

  const thresholdUsd = (SHIPPING_THRESHOLDS_USD[currency] ?? 45) / getRate(currency);
  const isRitualOne = currentHandle === PDRN_RITUAL_HANDLE;

  const handleAdd = (product: Product) => {
    addItem({
      id: `product-${product.handle}`,
      handle: product.handle,
      title: product.name,
      vendor: product.brand,
      featuredImage: null,
      priceRange: {minVariantPrice: {amount: product.price.toFixed(2), currencyCode: product.currency}},
    });
  };

  if (isRitualOne) {
    return <PDRNTrioCrossSell handleAdd={handleAdd} />;
  }

  return (
    <section className="border-t border-sand pt-12 pb-16 lg:pt-20 lg:pb-20 px-6" aria-label="The Elixirs">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[4px] text-stone font-semibold">
            Amplify your ritual
          </p>
          <h2 className="font-display text-[clamp(20px,2.5vw,28px)] mt-3">
            The elixir beneath
          </h2>
          <p className="text-sm text-walnut mt-3 max-w-md mx-auto leading-relaxed">
            Apply a PDRN elixir before your mask to prepare the skin, or after
            to seal in the benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {elixirProducts.map((product) => {
            const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';
            const cartPlusThis = subtotal + product.price;
            const addsShipping = subtotal > 0 && subtotal < thresholdUsd && cartPlusThis >= thresholdUsd;

            return (
              <div key={product.handle} className="border border-sand">
                <div className={`h-[200px] bg-gradient-to-b ${gradient} flex items-center justify-center overflow-hidden`}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={`${product.brand} ${product.name} - Maison Masque`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="font-display text-6xl select-none" style={{color: `${product.heroColor}28`}}>
                      ✧
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[2px] text-stone">
                    {product.brand}
                  </p>
                  <h3 className="font-display text-base mt-1">{product.name}</h3>
                  <p className="text-xs text-walnut mt-1.5 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <Price amount={product.price} className="font-display text-lg mt-3 block" />

                  <button
                    type="button"
                    onClick={() => handleAdd(product)}
                    className="w-full mt-4 border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold py-3 hover:border-gold hover:text-gold transition-colors"
                    aria-label={`Add ${product.name} to order`}
                  >
                    Add to order
                  </button>

                  {addsShipping && (
                    <p className="text-[11px] text-gold mt-2 text-center">
                      Adds complimentary shipping to your order
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PDRNTrioCrossSell({handleAdd}: {handleAdd: (p: Product) => void}) {
  const trioProducts = PDRN_TRIO_HANDLES.map((h) => getProductByHandle(h)).filter(Boolean) as Product[];
  const trioTotal = trioProducts.reduce((s, p) => s + p.price, 0);
  const elixirIII = getProductByHandle('medicube-pdrn-milky-toner');
  const elixirI = getProductByHandle('medicube-pdrn-peptide-serum');
  const anuaCapsule = getProductByHandle('anua-pdrn-ha-capsule-serum');
  const featuredElixirs = [elixirIII, elixirI, anuaCapsule].filter(Boolean) as Product[];
  // Fourth elixir shown under "Also in The Elixirs" (previously referenced a
  // stale `elixirII` variable that was removed during curation — caused a ReferenceError
  // SSR 500 on the Ritual I PDP which renders PDRNTrioCrossSell).
  const alsoAvailable = getProductByHandle('centellian24-madeca-pdrn');

  const addAllThree = () => {
    for (const p of trioProducts) handleAdd(p);
  };

  return (
    <section className="border-t border-sand pt-12 pb-16 lg:pt-20 lg:pb-20 px-6" aria-label="The PDRN Trio">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
            Complete the PDRN practice
          </p>
          <h2 className="font-display text-[clamp(22px,3vw,32px)] mt-3">
            The PDRN Trio
          </h2>
          <p className="text-sm text-walnut mt-3 max-w-lg mx-auto leading-relaxed">
            This mask is the final step. Start with the toner, amplify with the
            serum, seal with the mask.
          </p>
        </div>

        {/* Featured elixirs — Elixir III + Elixir I */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {featuredElixirs.map((product, i) => {
            const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';
            const stepLabel = i === 0 ? 'Step 1 — Prep' : 'Step 2 — Amplify';

            return (
              <div key={product.handle} className="border-2 border-gold relative">
                <div className="absolute top-3 left-3 z-10 bg-gold text-ink text-[9px] uppercase tracking-[2px] font-semibold px-2.5 py-1">
                  {stepLabel}
                </div>

                <div className={`h-[220px] bg-gradient-to-b ${gradient} flex items-center justify-center overflow-hidden`}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={`${product.brand} ${product.name} - Maison Masque`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="font-display text-7xl select-none" style={{color: `${product.heroColor}28`}}>
                      ✧
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[2px] text-stone">
                    {product.brand}
                  </p>
                  <h3 className="font-display text-[17px] font-medium mt-1">
                    <Link to={`/products/${product.handle}`} className="hover:text-gold transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-walnut mt-1.5 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-baseline gap-2 mt-3">
                    {product.compareAtPrice > product.price && (
                      <Price amount={product.compareAtPrice} className="font-display text-sm text-stone line-through" />
                    )}
                    <Price amount={product.price} className="font-display text-lg" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(product)}
                    className="w-full mt-4 border border-gold text-gold text-[11px] uppercase tracking-[0.2em] font-semibold py-3 hover:bg-gold hover:text-ink transition-colors"
                    aria-label={`Add ${product.name} to order`}
                  >
                    Add to order
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trio total + Add all CTA */}
        <div className="text-center py-6 border border-gold bg-[rgba(197,165,90,0.04)]">
          <p className="text-[13px] text-walnut">
            Elixir III (toner) + Elixir I (serum) + Ritual I (this mask) &mdash;{' '}
            <Price amount={trioTotal} className="font-display text-ink text-base" /> total
          </p>
          <p className="text-[11px] text-gold mt-1">Complimentary shipping &middot; Includes complimentary gifts</p>
          <button
            type="button"
            onClick={addAllThree}
            className="mt-4 bg-ink text-cream text-[11px] uppercase tracking-[0.2em] font-semibold px-10 py-3.5 hover:bg-espresso transition-colors"
          >
            Add the PDRN Trio to cart
          </button>
        </div>

        {/* Also in The Elixirs — Elixir II */}
        {alsoAvailable && (
          <div className="mt-10">
            <p className="text-[11px] uppercase tracking-[4px] text-stone font-semibold text-center mb-5">
              Also in The Elixirs
            </p>
            <div className="max-w-sm mx-auto border border-sand">
              <div className={`h-[160px] bg-gradient-to-b ${GRADIENT_MAP[alsoAvailable.heroColor] ?? 'from-sand/30 to-ivory'} flex items-center justify-center overflow-hidden`}>
                {alsoAvailable.image ? (
                  <img
                    src={alsoAvailable.image}
                    alt={`${alsoAvailable.brand} ${alsoAvailable.name} - Maison Masque`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="font-display text-5xl select-none" style={{color: `${alsoAvailable.heroColor}28`}}>
                    ✧
                  </span>
                )}
              </div>
              <div className="p-5 text-center">
                <p className="text-[10px] uppercase tracking-[2px] text-stone">
                  {alsoAvailable.brand}
                </p>
                <h3 className="font-display text-base mt-1">
                  <Link to={`/products/${alsoAvailable.handle}`} className="hover:text-gold transition-colors">
                    {alsoAvailable.name}
                  </Link>
                </h3>
                <p className="text-xs text-walnut mt-1.5 leading-relaxed">
                  12% PDRN concentration &mdash; the highest in our collection.
                </p>
                <div className="flex items-baseline justify-center gap-2 mt-3">
                  {alsoAvailable.compareAtPrice > alsoAvailable.price && (
                    <Price amount={alsoAvailable.compareAtPrice} className="font-display text-sm text-stone line-through" />
                  )}
                  <Price amount={alsoAvailable.price} className="font-display text-lg" />
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(alsoAvailable)}
                  className="mt-4 border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold px-8 py-3 hover:border-gold hover:text-gold transition-colors"
                  aria-label={`Add ${alsoAvailable.name} to order`}
                >
                  Add to order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
