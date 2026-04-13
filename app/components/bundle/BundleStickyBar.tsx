import {useCurrency} from '~/lib/currencyContext';
import type {Bundle} from '~/lib/bundles';

interface BundleStickyBarProps {
  bundle: Bundle;
  currentCount: number;
  requiredCount: number;
  onAddToCart: () => void;
  /** Use the gold CTA treatment (reserved for The Complete Ritual). */
  goldCta?: boolean;
}

export function BundleStickyBar({
  bundle,
  currentCount,
  requiredCount,
  onAddToCart,
  goldCta = false,
}: BundleStickyBarProps) {
  const {currency, format} = useCurrency();
  const isComplete = currentCount >= requiredCount;
  const remaining = Math.max(0, requiredCount - currentCount);

  // Prefer hand-tuned per-currency price, fall back to USD × convert
  const priceDisplay =
    bundle.prices[currency] !== undefined
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: currency === 'USD' ? 2 : 0,
          maximumFractionDigits: currency === 'USD' ? 2 : 0,
        }).format(bundle.prices[currency])
      : format(bundle.price);

  const buttonLabel = isComplete
    ? `Add ${bundle.name} — ${priceDisplay}`
    : `Select ${remaining} ${remaining === 1 ? 'more item' : 'more items'} to continue`;

  return (
    <div
      className="fixed left-0 right-0 z-[95] bg-cream border-t border-sand"
      style={{
        bottom: 'env(safe-area-inset-bottom, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 20px rgba(26, 23, 20, 0.06)',
      }}
      role="region"
      aria-label="Bundle summary"
    >
      {/* Sit above the mobile bottom nav, which is 64px */}
      <div className="md:hidden h-16" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4 flex-wrap md:flex-nowrap">
        {/* Selection status */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[3px] text-stone font-semibold font-body">
            Your {bundle.name.toLowerCase()}
          </p>
          <p className="text-[13px] text-walnut mt-0.5">
            {isComplete ? (
              <>
                <span className="text-gold">All selections made</span>
                {' · '}
                <span className="text-stone">Save {bundle.discountPercent}%</span>
              </>
            ) : (
              <>
                <span className="text-ink">{currentCount}</span>
                <span className="text-stone"> / {requiredCount} items selected</span>
              </>
            )}
          </p>
        </div>

        {/* Price */}
        <div className="hidden sm:block text-right">
          <p className="font-display text-[22px] text-ink leading-none">{priceDisplay}</p>
          <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">
            Save {bundle.discountPercent}%
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!isComplete}
          className={`text-[11px] uppercase tracking-[3px] font-semibold font-body px-6 py-4 transition-all duration-300 flex-shrink-0 w-full sm:w-auto ${
            isComplete
              ? goldCta
                ? 'text-cream cursor-pointer'
                : 'bg-ink text-cream hover:bg-espresso cursor-pointer'
              : 'bg-sand text-stone cursor-not-allowed'
          }`}
          style={
            isComplete && goldCta
              ? {backgroundColor: '#C5A55A'}
              : undefined
          }
          onMouseEnter={(e) => {
            if (isComplete && goldCta) {
              e.currentTarget.style.backgroundColor = '#D4BA7A';
            }
          }}
          onMouseLeave={(e) => {
            if (isComplete && goldCta) {
              e.currentTarget.style.backgroundColor = '#C5A55A';
            }
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
