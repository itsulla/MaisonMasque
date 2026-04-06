import {useEffect, useRef, useCallback} from 'react';
import {useCart, type CartLine} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';

export function CartDrawer() {
  const {lines, itemCount, subtotal, isOpen, close} = useCart();
  const {format: formatPrice} = useCurrency();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') close();
    },
    [close],
  );

  return (
    <div
      className={`fixed inset-0 z-[110] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{backgroundColor: 'rgba(26,23,20,0.4)'}}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`cart-drawer absolute right-0 top-0 bg-cream h-full flex flex-col border-l border-sand transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand p-6">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-xl text-ink">Your Ritual</h2>
            {itemCount > 0 && (
              <span className="text-xs text-stone">
                ({itemCount})
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={close}
            className="text-ink"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {lines.length > 0 ? (
          <>
            {/* Line items */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col">
                {lines.map((line, i) => (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    isLast={i === lines.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-sand p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink">Subtotal</span>
                <span className="font-display text-sm text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-walnut mb-4">
                Complimentary shipping on orders over &pound;45
              </p>
              <div className="w-[60px] h-px bg-gold mx-auto mb-4" />
              <button
                type="button"
                className="block w-full bg-ink text-cream text-center h-12 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-espresso transition-colors"
              >
                Proceed to checkout
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="font-display text-xl text-ink mb-2">
              Your ritual awaits
            </h3>
            <p className="text-[13px] text-walnut mb-6">
              Explore our collection to begin
            </p>
            <a
              href="#rituals"
              onClick={close}
              className="inline-block border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold px-8 py-3 hover:border-ink hover:bg-ink hover:text-cream transition-colors"
            >
              Browse The Five Rituals
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function CartLineItem({line, isLast}: {line: CartLine; isLast: boolean}) {
  const {updateQuantity, removeItem} = useCart();
  const {format: fmtPrice} = useCurrency();
  const lineTotal = parseFloat(line.price.amount) * line.quantity;

  return (
    <div className={`flex gap-4 py-4 ${isLast ? '' : 'border-b border-sand'}`}>
      {/* Thumbnail */}
      <div className="w-[60px] h-[60px] flex-shrink-0 bg-cream overflow-hidden">
        {line.image?.url ? (
          <img
            src={line.image.url}
            alt={line.image.altText ?? line.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-sand/30 to-ivory" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-ink leading-tight truncate">{line.title}</h4>
        <p className="text-[10px] uppercase tracking-[3px] text-stone mt-0.5">
          {line.vendor}
        </p>
        {line.ritualLabel && (
          <p className="text-[10px] text-gold mt-0.5">{line.ritualLabel}</p>
        )}

        {/* Quantity adjuster */}
        <div className="flex items-center border border-sand h-7 w-fit mt-2">
          <button
            type="button"
            onClick={() => updateQuantity(line.id, line.quantity - 1)}
            className="w-7 h-full flex items-center justify-center text-stone hover:text-ink transition-colors text-xs"
            aria-label={`Decrease quantity of ${line.title}`}
          >
            &minus;
          </button>
          <span className="w-6 h-full flex items-center justify-center text-xs font-body border-x border-sand">
            {line.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(line.id, line.quantity + 1)}
            className="w-7 h-full flex items-center justify-center text-stone hover:text-ink transition-colors text-xs"
            aria-label={`Increase quantity of ${line.title}`}
          >
            +
          </button>
        </div>

        {/* Remove */}
        <button
          type="button"
          onClick={() => removeItem(line.id)}
          className="text-[11px] text-stone hover:underline mt-1"
        >
          Remove
        </button>
      </div>

      {/* Line price */}
      <span className="font-display text-sm text-ink flex-shrink-0">
        {fmtPrice(lineTotal)}
      </span>
    </div>
  );
}
