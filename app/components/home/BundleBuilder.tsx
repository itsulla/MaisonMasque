import {useState, useMemo} from 'react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {Price} from '~/components/shared/Price';
import {useCurrency} from '~/lib/currencyContext';
import {useCart} from '~/lib/cartContext';
import {getRitualProducts, getMorningVeilProducts, getElixirProducts, type Product} from '~/lib/products';

const ritualProducts = getRitualProducts();
const morningVeilProducts = getMorningVeilProducts();
const elixirProducts = getElixirProducts();
const allBuildableProducts = [...ritualProducts, ...morningVeilProducts, ...elixirProducts];

const TIERS = [
  {count: 3, discount: 0.1, label: '3 items: 10% off'},
  {count: 4, discount: 0.15, label: '4 items: 15% off'},
  {count: 5, discount: 0.21, label: '5+ items: 21% off'},
];

type FilterTab = 'all' | 'rituals' | 'elixirs' | 'sunscreens';

const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
  '#8FA68E': 'from-sage/30 to-ivory',
  '#C5A55A': 'from-gold/20 to-ivory',
  '#F5E6D0': 'from-[#F5E6D0]/30 to-ivory',
  '#E8D5C4': 'from-[#E8D5C4]/30 to-ivory',
};

function getDiscount(count: number): number {
  if (count >= 5) return 0.21;
  if (count >= 4) return 0.15;
  if (count >= 3) return 0.1;
  return 0;
}

export function BundleBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterTab>('all');
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
  const remaining = Math.max(0, 3 - count);

  const visibleProducts = useMemo(() => {
    if (filter === 'rituals') return ritualProducts;
    if (filter === 'elixirs') return elixirProducts;
    if (filter === 'sunscreens') return morningVeilProducts;
    return allBuildableProducts;
  }, [filter]);

  const {subtotal, discounted, savings} = useMemo(() => {
    const sub = allBuildableProducts
      .filter((p) => selected.has(p.handle))
      .reduce((s, p) => s + p.price, 0);
    const disc = sub * (1 - discount);
    return {subtotal: sub, discounted: disc, savings: sub - disc};
  }, [selected, discount]);

  const selectedRituals = useMemo(
    () => ritualProducts.filter((p) => selected.has(p.handle)),
    [selected],
  );
  const selectedSunscreens = useMemo(
    () => morningVeilProducts.filter((p) => selected.has(p.handle)),
    [selected],
  );
  const selectedElixirs = useMemo(
    () => elixirProducts.filter((p) => selected.has(p.handle)),
    [selected],
  );
  // Smart suggestion logic — show at most ONE suggestion, prioritised
  type SuggestionType = 'elixir-for-rituals' | 'sunscreen-for-rituals' | 'ritual-for-elixirs' | null;
  const suggestion: SuggestionType = useMemo(() => {
    const hasRituals = selectedRituals.length > 0;
    const hasElixirs = selectedElixirs.length > 0;
    const hasSunscreens = selectedSunscreens.length > 0;

    // Elixirs without rituals → suggest rituals (highest priority — elixirs need rituals)
    if (hasElixirs && !hasRituals) return 'ritual-for-elixirs';
    // Rituals without elixirs → suggest elixirs
    if (hasRituals && selectedRituals.length >= 1 && !hasElixirs) return 'elixir-for-rituals';
    // Rituals without sunscreens → suggest sunscreens
    if (hasRituals && selectedRituals.length >= 2 && !hasSunscreens) return 'sunscreen-for-rituals';
    return null;
  }, [selectedRituals.length, selectedElixirs.length, selectedSunscreens.length]);

  const handleAddAll = () => {
    if (!canAdd) return;
    const selectedProducts = allBuildableProducts.filter((p) => selected.has(p.handle));
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

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto" aria-label="Build Your Own Ritual">
      {/* Header */}
      <div className="text-center mb-10">
        <SectionLabel>Build Your Own</SectionLabel>
        <h2 className="font-display text-[clamp(24px,3.5vw,42px)] mt-3">
          Create your personal ritual
        </h2>
        <p className="text-sm text-walnut mt-3 max-w-lg mx-auto">
          Choose any three or more products and save. Mix masks, elixirs, and
          sunscreens &mdash; the more you add, the deeper the discount.
        </p>
      </div>

      {/* Tier bar */}
      <div className="flex justify-center gap-8 mb-6">
        {TIERS.map((tier) => {
          const isActive = count >= tier.count;
          const isExact =
            (count === tier.count) || (count >= 5 && tier.count === 5);
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

      {/* Filter tabs */}
      <div className="flex justify-center gap-1 mb-8">
        {([
          {key: 'all' as FilterTab, label: 'All'},
          {key: 'rituals' as FilterTab, label: 'Rituals'},
          {key: 'elixirs' as FilterTab, label: 'Elixirs'},
          {key: 'sunscreens' as FilterTab, label: 'Morning Veil'},
        ]).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 text-[11px] uppercase tracking-[2px] font-semibold transition-colors ${
              filter === tab.key
                ? 'text-gold border-b-2 border-gold'
                : 'text-stone hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product selector grid */}
      <div className={`grid gap-px border border-sand bg-sand ${
        visibleProducts.length <= 2
          ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
      }`}>
        {visibleProducts.map((product) => {
          const isSelected = selected.has(product.handle);
          const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';
          const isSunscreen = product.collection === 'morning-veil';
          const isElixirProduct = product.collection === 'elixir';

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
                    isSelected ? 'bg-gold border-gold' : 'bg-cream border-sand'
                  }`}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FAF8F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                  {isSunscreen ? '☀' : isElixirProduct ? '✧' : product.ritualNumber}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                  {isSunscreen ? 'Morning Veil' : isElixirProduct ? 'Elixir' : `Ritual ${product.ritualNumber}`}
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

      {/* Smart suggestion — one at a time */}
      {suggestion && (
        <div className="border border-sand border-t-0 px-6 py-4 bg-ivory/50">
          <p className="text-[13px] text-walnut mb-3">
            {suggestion === 'elixir-for-rituals' && (
              <>Amplify your ritual &mdash; add an <span className="text-gold">elixir</span></>
            )}
            {suggestion === 'sunscreen-for-rituals' && (
              <>Complete your practice &mdash; add a <span className="text-gold">Morning Veil</span></>
            )}
            {suggestion === 'ritual-for-elixirs' && (
              <>Your elixir pairs with a <span className="text-gold">ritual</span></>
            )}
          </p>
          <div className="flex gap-3">
            {(suggestion === 'elixir-for-rituals'
              ? elixirProducts
              : suggestion === 'sunscreen-for-rituals'
                ? morningVeilProducts
                : ritualProducts.slice(0, 3)
            ).map((p) => (
              <button
                key={p.handle}
                type="button"
                onClick={() => toggle(p.handle)}
                className="flex-1 border border-sand bg-cream rounded p-3 text-left hover:border-gold transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] text-stone">
                      {p.brand}
                    </p>
                    <p className="text-xs text-ink mt-0.5 group-hover:text-gold transition-colors truncate">
                      {p.collection === 'ritual' ? p.ritualName : p.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Price amount={p.price} className="text-xs font-display" />
                    <span className="w-5 h-5 border border-sand rounded-full flex items-center justify-center text-gold text-xs group-hover:bg-gold group-hover:text-cream transition-colors">
                      +
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Running total */}
      <div className={`border border-sand ${suggestion ? '' : 'border-t-0'} px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="text-sm text-ink font-medium">
            {count} {count === 1 ? 'item' : 'items'} selected
            {([selectedRituals.length > 0, selectedElixirs.length > 0, selectedSunscreens.length > 0].filter(Boolean).length > 1) && (
              <span className="text-stone font-normal ml-1">
                ({[
                  selectedRituals.length > 0 ? `${selectedRituals.length} ritual${selectedRituals.length !== 1 ? 's' : ''}` : '',
                  selectedElixirs.length > 0 ? `${selectedElixirs.length} elixir${selectedElixirs.length !== 1 ? 's' : ''}` : '',
                  selectedSunscreens.length > 0 ? `${selectedSunscreens.length} sunscreen${selectedSunscreens.length !== 1 ? 's' : ''}` : '',
                ].filter(Boolean).join(', ')})
              </span>
            )}
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
              ? `Add ${count} items to bag for ${format(discounted)}`
              : `Select ${remaining} more`
          }
        >
          {canAdd
            ? `Add ${count} items to bag — ${format(discounted)}`
            : `Select ${remaining} more`}
        </button>
      </div>
    </section>
  );
}
