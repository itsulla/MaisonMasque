import {useMemo} from 'react';
import {getProductByHandle} from '~/lib/products';
import type {BundleSlot} from '~/lib/bundles';
import {Price} from '~/components/shared/Price';

interface BundleSlotSelectorProps {
  slot: BundleSlot;
  selected: string[];
  onChange: (handles: string[]) => void;
}

export function BundleSlotSelector({slot, selected, onChange}: BundleSlotSelectorProps) {
  const eligibleProducts = useMemo(() => {
    return (slot.eligibleHandles ?? [])
      .map(getProductByHandle)
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [slot.eligibleHandles]);

  const maxReached = selected.length >= slot.count;

  const toggle = (handle: string) => {
    if (selected.includes(handle)) {
      onChange(selected.filter((h) => h !== handle));
      return;
    }
    if (maxReached) return;
    onChange([...selected, handle]);
  };

  return (
    <div className="mb-14">
      {/* Slot header */}
      <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-sand">
        <h3 className="font-display text-[clamp(22px,2.5vw,28px)] text-ink">
          {slot.label}
        </h3>
        <span
          className="text-[11px] uppercase tracking-[3px] font-semibold font-body"
          style={{color: maxReached ? '#C5A55A' : '#8A8279'}}
          aria-live="polite"
        >
          {selected.length} of {slot.count} selected
        </span>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {eligibleProducts.map((product) => {
          const isSelected = selected.includes(product.handle);
          const isDisabled = !isSelected && maxReached;
          return (
            <button
              key={product.handle}
              type="button"
              onClick={() => toggle(product.handle)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} ${product.brand} ${product.name}`}
              className={`group text-left bg-cream transition-all duration-300 border relative ${
                isSelected
                  ? 'border-gold shadow-[0_2px_10px_rgba(197,165,90,0.15)]'
                  : 'border-sand hover:border-stone'
              } ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                borderWidth: isSelected ? '1px' : '1px',
              }}
            >
              {/* Checkmark */}
              {isSelected && (
                <div
                  className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{backgroundColor: '#C5A55A'}}
                  aria-hidden="true"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FAF8F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Image */}
              <div className="product-tile-bg h-[180px] flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={`${product.brand} ${product.name} - Maison Masque`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="font-display text-5xl text-sand">
                    {product.ritualNumber ?? '✧'}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[2px] text-stone">
                  {product.brand}
                </p>
                <h4 className="font-display text-[14px] text-ink mt-1 leading-snug">
                  {product.name}
                </h4>
                <Price
                  amount={product.price}
                  className="text-[12px] text-walnut mt-1 block"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
