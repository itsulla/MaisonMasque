import {CartForm} from '@shopify/hydrogen';
import {useEffect, useRef, useCallback} from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any;
}

export function CartDrawer({isOpen, onClose, cart}: CartDrawerProps) {
  const lines = cart?.lines?.nodes ?? cart?.lines ?? [];
  const subtotal =
    cart?.cost?.subtotalAmount?.amount ??
    cart?.cost?.totalAmount?.amount ??
    '0';
  const currencyCode =
    cart?.cost?.subtotalAmount?.currencyCode ??
    cart?.cost?.totalAmount?.currencyCode ??
    'USD';

  const itemCount = lines.reduce(
    (total: number, line: any) => total + (line.quantity ?? 0),
    0,
  );

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key to close the drawer
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  // Focus the close button when drawer opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 bg-cream w-96 max-w-[90vw] h-full flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand p-6">
          <div>
            <h2 className="font-display text-xl text-ink">Your Ritual</h2>
            {itemCount > 0 && (
              <span className="text-xs text-stone">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
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
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-6">
                {lines.map((line: any) => (
                  <CartLineItem key={line.id} line={line} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-sand p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-body font-medium text-ink uppercase tracking-[2px]">
                  Subtotal
                </span>
                <span className="text-sm font-body font-medium text-ink">
                  {formatMoney(subtotal, currencyCode)}
                </span>
              </div>
              <p className="text-xs text-stone mb-4">
                Complimentary shipping on orders over &pound;45
              </p>
              <div className="w-full h-px bg-gold mb-4" />
              <a
                href={cart?.checkoutUrl ?? '/checkout'}
                className="block w-full bg-ink text-cream text-center py-3 text-xs uppercase tracking-[3px] font-body font-medium hover:bg-espresso transition-colors"
              >
                Proceed to checkout
              </a>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <h3 className="font-display text-xl text-stone mb-4">
              Your ritual awaits
            </h3>
            <a
              href="/collections/the-five-rituals"
              className="inline-block border border-ink text-ink text-xs uppercase tracking-[3px] font-body font-medium px-8 py-3 hover:bg-ink hover:text-cream transition-colors"
            >
              Explore the collection
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function CartLineItem({line}: {line: any}) {
  const merchandise = line.merchandise;
  const image = merchandise?.image;
  const title = merchandise?.product?.title ?? merchandise?.title ?? '';
  const price =
    line.cost?.totalAmount?.amount ?? line.cost?.amountPerQuantity?.amount ?? '0';
  const currencyCode =
    line.cost?.totalAmount?.currencyCode ??
    line.cost?.amountPerQuantity?.currencyCode ??
    'USD';

  return (
    <div className="flex gap-4">
      {/* Thumbnail */}
      {image?.url && (
        <img
          src={image.url}
          alt={image.altText ?? title}
          className="w-16 h-16 object-cover rounded"
        />
      )}

      <div className="flex-1">
        {/* Title */}
        <h4 className="font-display text-sm text-ink leading-tight">{title}</h4>

        {/* Price */}
        <p className="text-xs text-stone mt-1">
          {formatMoney(price, currencyCode)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-3 mt-2">
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{
              lines: [
                {
                  id: line.id,
                  quantity: Math.max(0, line.quantity - 1),
                },
              ],
            }}
          >
            <button
              type="submit"
              className="w-7 h-7 border border-sand flex items-center justify-center text-xs text-ink hover:border-gold transition-colors"
              aria-label={`Decrease quantity of ${title}`}
            >
              &minus;
            </button>
          </CartForm>

          <span
            className="text-xs text-ink font-body w-4 text-center"
            aria-live="polite"
            aria-label={`Quantity: ${line.quantity}`}
          >
            {line.quantity}
          </span>

          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{
              lines: [
                {
                  id: line.id,
                  quantity: line.quantity + 1,
                },
              ],
            }}
          >
            <button
              type="submit"
              className="w-7 h-7 border border-sand flex items-center justify-center text-xs text-ink hover:border-gold transition-colors"
              aria-label={`Increase quantity of ${title}`}
            >
              +
            </button>
          </CartForm>
        </div>
      </div>

      {/* Remove */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{lineIds: [line.id]}}
      >
        <button
          type="submit"
          className="text-stone hover:text-ink transition-colors"
          aria-label={`Remove ${title} from cart`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </CartForm>
    </div>
  );
}

function formatMoney(amount: string | number, currencyCode: string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}
