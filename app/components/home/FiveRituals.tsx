import {Link} from '@remix-run/react';
import {useState, useCallback} from 'react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {RitualCard} from '~/components/home/RitualCard';
import {QuickView} from '~/components/home/QuickView';
import {useCart} from '~/lib/cartContext';
import {getRitualProducts, getProductByHandle, type Product} from '~/lib/products';
import {Price} from '~/components/shared/Price';

const ritualProducts = getRitualProducts();
const bundle = getProductByHandle('the-complete-ritual');

export function FiveRituals() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const {addItem} = useCart();

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

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

  return (
    <section id="rituals" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionLabel>The Five Rituals</SectionLabel>
        <h2 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
          One mask for every intention
        </h2>
        <p className="text-sm text-walnut mt-3">
          Curated from Korea&apos;s most revered skincare houses
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border border-sand">
        {ritualProducts.map((product, index) => (
          <RitualCard
            key={product.handle}
            product={product}
            index={index}
            ritualNumeral={product.ritualNumeral}
            onQuickView={handleQuickView}
            onAddToCart={handleAddToCart}
            className={
              index < ritualProducts.length - 1 ? 'border-r border-sand' : ''
            }
          />
        ))}
      </div>

      {/* Complete Ritual banner */}
      {bundle && (
        <div className="border border-sand mt-0 border-t-0">
          <div className="flex flex-col md:flex-row items-center justify-between px-8 py-8 gap-6">
            {/* Left */}
            <div className="flex items-center gap-3">
              <span className="text-gold text-sm">&#9670;</span>
              <div>
                <h3 className="font-display text-lg">The Complete Ritual</h3>
                <p className="text-[13px] text-walnut mt-0.5">
                  All five masks in one curated box
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-baseline gap-2">
                <Price amount={bundle.compareAtPrice} className="font-display text-base text-stone line-through" />
                <Price amount={bundle.price} className="font-display text-[22px] text-ink" />
                {bundle.savingsPercent && (
                  <span
                    className="text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded-sm"
                    style={{background: '#E1F5EE', color: '#085041'}}
                  >
                    Save {bundle.savingsPercent}%
                  </span>
                )}
              </div>
              <Link
                to="/products/the-complete-ritual"
                className="inline-block bg-ink text-cream text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-3 hover:bg-espresso transition-colors"
              >
                Shop the bundle &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick view modal */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={handleCloseQuickView}
          onAddToCart={(p: any, qty?: number) => {
            const prod = typeof p?.handle === 'string' ? (getProductByHandle(p.handle) ?? quickViewProduct) : quickViewProduct;
            handleAddToCart(prod);
          }}
        />
      )}
    </section>
  );
}
