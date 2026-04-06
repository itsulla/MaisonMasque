import {useState, useMemo} from 'react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {Price} from '~/components/shared/Price';
import {useCurrency} from '~/lib/currencyContext';
import {useCart} from '~/lib/cartContext';
import {getRitualProducts, type Product} from '~/lib/products';

const ritualProducts = getRitualProducts();

const TIERS = [
  {count: 3, discount: 0.1, label: '3 masks: 10% off'},
  {count: 4, discount: 0.15, label: '4 masks: 15% off'},
  {count: 5, discount: 0.21, label: '5 masks: 21% off'},
];

const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
  '#8FA68E': 'from-sage/30 to-ivory',
  '#C5A55A': 'from-gold/20 to-ivory',
};

function getDiscount(count: number): number {
  if (count >= 5) return 0.21;
  if (count >= 4) return 0.15;
  if (count >= 3) return 0.1;
  return 0;
}

export function BundleBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const {format} = useCurrency();
  const {addItem} = useCart();

  const toggle = (handle: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) {
        next.delete(handle);
      } else {
        next.add(handle);
      }
      return next;
    });
  };

  const count = selected.size;
  const discount = getDiscount(count);
  const canAdd = count >= 3;

  const {subtotal, discounted, savings} = useMemo(() => {
    const sub = ritualProducts
      .filter((p) => selected.has(p.handle))
      .reduce((s, p) => s + p.price, 0);
    const disc = sub * (1 - discount);
    return {subtotal: sub, discounted: disc, savings: sub - disc};
  }, [selected, discount]);

  const handleAddAll = () => {
    if (!canAdd) return;
    const selectedProducts = ritualProducts.filter((p) => selected.has(p.handle));
    for (const product of selectedProducts) {
      const discountedPrice = product.price * (1 - discount);
      addItem({
        id: `bundle-${product.handle}`,
        handle: product.handle,
        title: product.name,
        vendor: product.brand,
        featuredImage: null,
        priceRange: {
          minVariantPrice: {
            amount: discountedPrice.toFixed(2),
            currencyCode: product.currency,
          },
        },
      });
    }
  };

  const remaining = Math.max(0, 3 - count);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto" aria-label="Build Your Own Ritual">
      {/* Header */}
      <div className="text-center mb-10">
        <SectionLabel>Build Your Own</SectionLabel>
        <h2 className="font-display text-[clamp(24px,3.5vw,42px)] mt-3">
          Create your personal ritual
        </h2>
        <p className="text-sm text-walnut mt-3 max-w-lg mx-auto">
          Choose any three or more masks and save. The more rituals, the deeper
          the discount.
        </p>
      </div>

      {/* Tier bar */}
      <div className="flex justify-center gap-8 mb-10">
        {TIERS.map((tier) => {
          const isActive = count >= tier.count;
          const isExact =
            (count === tier.count) ||
            (count >= 5 && tier.count === 5);
          return (
            <div
              key={tier.count}
              className={`text-center pb-2 transition-colors ${
                isExact
                  ? 'text-gold border-b-2 border-gold'
                  : isActive
                    ? 'text-gold'
                    : 'text-stone'
              }`}
            >
              <span className="text-xs uppercase tracking-[2px] font-semibold">
                {tier.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Product selector grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px border border-sand bg-sand">
        {ritualProducts.map((product) => {
          const isSelected = selected.has(product.handle);
          const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';

          return (
            <button
              key={product.handle}
              type="button"
              onClick={() => toggle(product.handle)}
              className={`relative text-left transition-colors duration-200 ${
                isSelected ? 'bg-gold-pale' : 'bg-cream hover:bg-ivory'
              }`}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Remove' : 'Add'} ${product.name}`}
            >
              {/* Checkbox circle */}
              <div className="absolute top-3 right-3 z-10">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-gold border-gold'
                      : 'bg-cream border-sand'
                  }`}
                >
                  {isSelected && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FAF8F3"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Image placeholder */}
              <div
                className={`h-[200px] bg-gradient-to-b ${gradient} flex items-center justify-center ${
                  isSelected ? 'border-b-2 border-gold' : ''
                }`}
              >
                <span
                  className="font-display text-6xl select-none"
                  style={{color: `${product.heroColor}20`}}
                >
                  {product.ritualNumber}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                  Ritual {product.ritualNumber}
                </p>
                <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">
                  {product.brand}
                </p>
                <h3 className="font-display text-[15px] font-medium mt-1 leading-snug">
                  {product.name}
                </h3>
                <Price amount={product.price} className="font-display text-base mt-2 block" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Running total */}
      <div className="border border-sand border-t-0 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="text-sm text-ink font-medium">
            {count} {count === 1 ? 'mask' : 'masks'} selected
          </span>
          {count > 0 && (
            <span className="text-sm text-walnut">
              Subtotal:{' '}
              {canAdd && (
                <span className="line-through text-stone mr-1">
                  {format(subtotal)}
                </span>
              )}
              <span className="font-display text-ink">
                {format(canAdd ? discounted : subtotal)}
              </span>
            </span>
          )}
          {canAdd && savings > 0 && (
            <span
              className="text-[11px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded-sm"
              style={{background: '#E1F5EE', color: '#085041'}}
            >
              You save {format(savings)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddAll}
          disabled={!canAdd}
          className={`w-full sm:w-auto px-8 h-12 text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors ${
            canAdd
              ? 'bg-ink text-cream hover:bg-espresso cursor-pointer'
              : 'bg-ink/40 text-cream/60 cursor-default'
          }`}
          aria-label={
            canAdd
              ? `Add ${count} masks to bag for ${format(discounted)}`
              : `Select ${remaining} more masks`
          }
        >
          {canAdd
            ? `Add ${count} masks to bag — ${format(discounted)}`
            : `Select ${remaining} more`}
        </button>
      </div>
    </section>
  );
}
