import {useEffect, useRef, useState} from 'react';
import {Price} from '~/components/shared/Price';
import type {Product} from '~/lib/products';

interface StickyAddToCartProps {
  product: Product;
  qty: number;
  onAddToCart: () => void;
  /** ID of the primary ATC button on the page — we watch when it leaves the viewport. */
  anchorId: string;
  /** Button label — defaults to "Add to ritual" */
  label?: string;
}

/**
 * Fixed-bottom Add-to-Cart bar that slides into view once the user has
 * scrolled past the primary ATC button. Uses IntersectionObserver on the
 * anchor element (rather than scroll listeners) to stay performant.
 *
 * Respects prefers-reduced-motion via CSS (transition is disabled there).
 */
export function StickyAddToCart({
  product,
  qty,
  onAddToCart,
  anchorId,
  label = 'Add to ritual',
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const target = document.getElementById(anchorId);
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar only when primary ATC is fully out of view AND we
        // have scrolled past it (not above it).
        const rect = entry.boundingClientRect;
        const scrolledPast = rect.bottom < 0;
        setVisible(!entry.isIntersecting && scrolledPast);
      },
      {threshold: 0},
    );
    observerRef.current.observe(target);

    return () => observerRef.current?.disconnect();
  }, [anchorId]);

  const hasCompare = product.compareAtPrice > product.price;

  return (
    <div
      className={`sticky-atc ${visible ? 'is-visible' : ''}`}
      role="region"
      aria-label="Sticky add-to-cart bar"
      aria-hidden={!visible}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 md:px-6 py-3">
        {/* Product identity — hidden on narrow mobile to keep CTA prominent */}
        <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
          {product.image && (
            <img
              src={product.image}
              alt=""
              className="w-11 h-11 object-cover flex-shrink-0"
              loading="lazy"
            />
          )}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[2px] text-stone truncate">
              {product.brand}
            </p>
            <p className="font-display text-sm text-ink truncate">
              {product.name}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-shrink-0">
          {hasCompare && (
            <Price
              amount={product.compareAtPrice}
              className="text-xs text-stone line-through"
            />
          )}
          <Price
            amount={product.price}
            className="font-display text-lg text-ink"
          />
        </div>

        {/* ATC CTA */}
        <button
          type="button"
          onClick={onAddToCart}
          className="h-11 bg-ink text-cream font-display text-[12px] uppercase tracking-[2px] px-6 hover:bg-espresso transition-colors flex-shrink-0"
          aria-label={`${label} (quantity ${qty})`}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
