import {Link} from '@remix-run/react';
import {useEffect, useRef, useState, useCallback} from 'react';
import {type Product} from '~/lib/products';
import {Price} from '~/components/shared/Price';

const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
  '#8FA68E': 'from-sage/30 to-ivory',
  '#C5A55A': 'from-gold/20 to-ivory',
};

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, qty?: number) => void;
}

export function QuickView({product, isOpen, onClose, onAddToCart}: QuickViewProps) {
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'visible' | 'leaving'>('hidden');
  const [qty, setQty] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const gradient = product ? (GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory') : '';
  const hasCompare = product ? product.compareAtPrice > product.price : false;

  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setPhase('entering');
      const t = setTimeout(() => setPhase('visible'), 300);
      return () => clearTimeout(t);
    } else if (phase !== 'hidden') {
      setPhase('leaving');
      const t = setTimeout(() => setPhase('hidden'), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === 'visible') closeRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase === 'hidden') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [phase, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (phase === 'hidden' || !product) return null;

  const showing = phase === 'entering' || phase === 'visible';
  const leaving = phase === 'leaving';

  return (
    <div
      className="quickview-backdrop"
      style={{opacity: leaving ? 0 : showing ? 1 : 0}}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        ref={modalRef}
        className="quickview-modal"
        style={{
          opacity: leaving ? 0 : showing ? 1 : 0,
          transform: leaving ? 'translateY(20px)' : showing ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {/* Close */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-stone hover:text-ink transition-colors z-10"
          aria-label="Close quick view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="quickview-grid">
          {/* Left — Image */}
          <div className={`quickview-image bg-gradient-to-b ${gradient} flex items-center justify-center`}>
            <span className="font-display text-8xl text-sand/60 select-none">
              {product.ritualNumber ?? ''}
            </span>
          </div>

          {/* Right — Details */}
          <div className="quickview-details p-8 flex flex-col">
            {product.ritualNumber && (
              <p className="text-[11px] uppercase tracking-[4px] font-semibold text-gold">
                Ritual {product.ritualNumber} &mdash; {product.ritualName}
              </p>
            )}

            <p className="text-[10px] uppercase tracking-[3px] text-stone mt-2">
              {product.brand}
            </p>

            <h3 className="font-display text-[22px] font-medium mt-2">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-1">
              {hasCompare && (
                <Price amount={product.compareAtPrice} className="font-display text-sm text-stone line-through" />
              )}
              <Price amount={product.price} className="font-display text-xl text-gold" />
            </div>

            <p className="text-[13px] text-walnut mt-4 leading-[1.6] line-clamp-4">
              {product.description}
            </p>

            {product.keyIngredient && (
              <p className="text-xs text-stone mt-3 flex items-start gap-2">
                <span className="text-gold text-[10px] mt-[2px]">&#9670;</span>
                {product.keyIngredient}
              </p>
            )}

            <div className="flex-1 min-h-4" />

            {/* Quantity */}
            <div className="flex items-center border border-sand h-8 w-fit mt-4">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-full flex items-center justify-center text-stone hover:text-ink transition-colors text-sm" aria-label="Decrease quantity">&minus;</button>
              <span className="w-8 h-full flex items-center justify-center text-sm font-body border-x border-sand">{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)} className="w-8 h-full flex items-center justify-center text-stone hover:text-ink transition-colors text-sm" aria-label="Increase quantity">+</button>
            </div>

            <button
              type="button"
              className="w-full h-12 mt-4 bg-ink text-cream text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-espresso transition-colors"
              aria-label={`Add ${qty} ${product.name} to bag`}
              onClick={() => {
                onAddToCart?.(product, qty);
                onClose();
              }}
            >
              Add to ritual
            </button>

            <Link
              to={`/products/${product.handle}`}
              className="text-xs text-gold hover:text-ink transition-colors mt-3 text-center"
              onClick={onClose}
            >
              View full details &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
