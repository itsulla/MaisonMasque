import {getMorningVeilProducts, type Product} from '~/lib/products';
import {useCart} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';
import {Price} from '~/components/shared/Price';

const GRADIENT_MAP: Record<string, string> = {
  '#F5E6D0': 'from-[#F5E6D0]/30 to-ivory',
  '#E8D5C4': 'from-[#E8D5C4]/30 to-ivory',
};

const SHIPPING_THRESHOLDS_USD: Record<string, number> = {
  USD: 45, GBP: 36, AUD: 70, EUR: 42, ZAR: 820,
};

function getRate(currency: string): number {
  const rates: Record<string, number> = {USD: 1, AUD: 1.55, GBP: 0.79, EUR: 0.92, ZAR: 18.2};
  return rates[currency] ?? 1;
}

export function MorningVeilCrossSell() {
  const morningVeilProducts = getMorningVeilProducts();
  const {addItem, subtotal} = useCart();
  const {currency} = useCurrency();

  const thresholdUsd = (SHIPPING_THRESHOLDS_USD[currency] ?? 45) / getRate(currency);

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
    <section className="border-t border-sand pt-12 pb-16 lg:pt-20 lg:pb-20 px-6" aria-label="The Morning Veil">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[4px] text-stone font-semibold">
            Complete your practice
          </p>
          <h2 className="font-display text-[clamp(20px,2.5vw,28px)] mt-3">
            And when morning comes
          </h2>
          <p className="text-sm text-walnut mt-3 max-w-md mx-auto leading-relaxed">
            Protect what the rituals restore with our Morning Veil sunscreens.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {morningVeilProducts.map((product) => {
            const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';
            const cartPlusThis = subtotal + product.price;
            const addsComplimentaryShipping = subtotal > 0 && subtotal < thresholdUsd && cartPlusThis >= thresholdUsd;

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
                      ☀
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

                  {addsComplimentaryShipping && (
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
