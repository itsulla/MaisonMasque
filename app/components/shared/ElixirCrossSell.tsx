import {getElixirProducts, type Product} from '~/lib/products';
import {useCart} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';
import {Price} from '~/components/shared/Price';

const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
};

const SHIPPING_THRESHOLDS_USD: Record<string, number> = {
  USD: 40, GBP: 45, AUD: 60, EUR: 45, ZAR: 750,
};

function getRate(currency: string): number {
  const rates: Record<string, number> = {USD: 1, AUD: 1.55, GBP: 0.79, EUR: 0.92, ZAR: 18.2};
  return rates[currency] ?? 1;
}

// Elixir I is a PDRN pairing with Ritual I
const PDRN_PAIRING_HANDLE = 'medicube-pdrn-peptide-serum';
const PDRN_RITUAL_HANDLE = 'medicube-pdrn-gel-mask';

interface ElixirCrossSellProps {
  /** The handle of the current product page, used to detect Ritual I for featured pairing */
  currentHandle?: string;
}

export function ElixirCrossSell({currentHandle}: ElixirCrossSellProps) {
  const elixirProducts = getElixirProducts();
  const {addItem, subtotal} = useCart();
  const {currency, format} = useCurrency();

  const thresholdUsd = (SHIPPING_THRESHOLDS_USD[currency] ?? 40) / getRate(currency);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {elixirProducts.map((product) => {
            const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';
            const cartPlusThis = subtotal + product.price;
            const addsShipping = subtotal > 0 && subtotal < thresholdUsd && cartPlusThis >= thresholdUsd;
            const isFeatured = isRitualOne && product.handle === PDRN_PAIRING_HANDLE;

            return (
              <div
                key={product.handle}
                className={`border ${isFeatured ? 'border-gold border-2' : 'border-sand'} relative`}
              >
                {/* PDRN pairing badge */}
                {isFeatured && (
                  <div className="absolute top-3 left-3 z-10 bg-gold text-ink text-[9px] uppercase tracking-[2px] font-semibold px-2.5 py-1">
                    PDRN pairing
                  </div>
                )}

                <div className={`h-[200px] bg-gradient-to-b ${gradient} flex items-center justify-center`}>
                  <span className="font-display text-6xl select-none" style={{color: `${product.heroColor}28`}}>
                    ✧
                  </span>
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

                  {/* Featured pairing combined price */}
                  {isFeatured && (
                    <p className="text-[11px] text-walnut mt-1">
                      Elixir I + Ritual I:{' '}
                      <Price amount={product.price + 22} className="font-display text-ink" />
                      <span className="text-gold ml-1">&middot; Complimentary shipping</span>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAdd(product)}
                    className="w-full mt-4 border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold py-3 hover:border-gold hover:text-gold transition-colors"
                    aria-label={`Add ${product.name} to order`}
                  >
                    Add to order
                  </button>

                  {addsShipping && !isFeatured && (
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
