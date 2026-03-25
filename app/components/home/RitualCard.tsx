import {useRef, useCallback} from 'react';
import {getRitualByHandle} from '~/lib/ritualConfig';

interface RitualCardProps {
  product: any;
  index: number;
  className?: string;
}

// Alternate Ken Burns drift directions for visual variety
const DRIFT_DIRECTIONS = [
  'translate(-8px, -4px)',   // up-left
  'translate(8px, -4px)',    // up-right
  'translate(-6px, -6px)',   // diagonal left
  'translate(6px, -2px)',    // slight right
  'translate(-4px, -8px)',   // mostly up, slight left
];

export function RitualCard({product, index, className = ''}: RitualCardProps) {
  const ritual = getRitualByHandle(product.handle);
  const price = product.priceRange?.minVariantPrice;
  const cardRef = useRef<HTMLDivElement>(null);
  const drift = DRIFT_DIRECTIONS[index % DRIFT_DIRECTIONS.length];

  const formatPrice = (amount: string, currencyCode: string) => {
    const num = parseFloat(amount);
    const symbol =
      currencyCode === 'GBP'
        ? '\u00A3'
        : currencyCode === 'EUR'
          ? '\u20AC'
          : currencyCode === 'AUD'
            ? 'A$'
            : '$';
    return `${symbol}${Math.round(num)}`;
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`ritual p-0 group hover:bg-ivory transition-all duration-500 will-change-transform ${className}`.trim()}
    >
      {/* Image area — clips overflow */}
      <div className="ritual-img h-[280px] overflow-hidden">
        {/* Inner wrapper gets the Ken Burns transform */}
        <div
          className="ritual-img-inner w-full h-full transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform group-hover:scale-[1.05]"
          style={
            {
              '--drift': drift,
            } as React.CSSProperties
          }
        >
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-b ${ritual?.gradient ?? 'from-sand/30 to-ivory'} flex items-center justify-center`}
            >
              <span className="font-display text-7xl text-sand/60 select-none">
                {ritual?.numeral ?? ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="p-5">
        {/* Ritual label */}
        {ritual && (
          <p className="ritual-num text-[11px] uppercase tracking-[4px] font-semibold text-gold">
            Ritual {ritual.numeral} &mdash; {ritual.name}
          </p>
        )}

        {/* Brand */}
        <p className="text-[10px] uppercase tracking-[3px] text-stone mt-1">
          {product.vendor}
        </p>

        {/* Product name */}
        <h3 className="font-display text-[17px] font-medium mt-2">
          {product.title}
        </h3>

        {/* Description */}
        {ritual && (
          <p className="text-xs text-stone mt-2 leading-relaxed">
            {ritual.theme}
          </p>
        )}

        {/* Bottom row */}
        <div className="flex justify-between items-center mt-4">
          {/* Price */}
          <span className="font-display text-xl">
            {price ? formatPrice(price.amount, price.currencyCode) : ''}
          </span>

          {/* Add button */}
          <button
            type="button"
            className="ritual-add w-8 h-8 border border-sand flex items-center justify-center text-stone transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.92]"
            aria-label={`Add ${product.title} to bag`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
