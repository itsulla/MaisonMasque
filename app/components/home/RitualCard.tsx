import {Link} from '@remix-run/react';
import {useRef, useCallback} from 'react';
import {type Product} from '~/lib/products';
import {Price} from '~/components/shared/Price';
import {RitualNumeral} from '~/components/shared/RitualNumeral';

interface RitualCardProps {
  product: Product;
  index: number;
  className?: string;
  ritualNumeral?: string;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const DRIFT_DIRECTIONS = [
  'translate(-8px, -4px)',
  'translate(8px, -4px)',
  'translate(-6px, -6px)',
  'translate(6px, -2px)',
  'translate(-4px, -8px)',
];

export function RitualCard({product, index, className = '', ritualNumeral, onQuickView, onAddToCart}: RitualCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const drift = DRIFT_DIRECTIONS[index % DRIFT_DIRECTIONS.length];
  const hasCompare = product.compareAtPrice > product.price;

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
      {/* Image area — links to PDP */}
      <Link to={`/products/${product.handle}`} className="block">
        <div className="ritual-img product-tile-bg h-[280px] overflow-hidden relative">
          <div
            className="ritual-img-inner w-full h-full transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform group-hover:scale-[1.05]"
            style={{['--drift' as string]: drift}}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={`${product.brand} ${product.name} - Korean Sheet Mask - Maison Masque`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-7xl text-sand/60 select-none">
                  {product.ritualNumber ?? ''}
                </span>
              </div>
            )}
          </div>
          <div className="ritual-img-overlay" aria-hidden="true" />
          {ritualNumeral && <RitualNumeral numeral={ritualNumeral} />}
        </div>
      </Link>

      {/* Content area */}
      <div className="p-5">
        {/* Ritual label */}
        {product.ritualNumber && (
          <p className="ritual-num text-[11px] uppercase tracking-[4px] font-semibold text-gold">
            Ritual {product.ritualNumber} &mdash; {product.ritualName}
          </p>
        )}

        {/* Brand */}
        <p className="text-[10px] uppercase tracking-[3px] text-walnut mt-1">
          {product.brand}
        </p>

        {/* Product name — links to PDP */}
        <h3 className="font-display text-[17px] font-medium mt-2">
          <Link
            to={`/products/${product.handle}`}
            className="hover:text-gold transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        {/* Format tag */}
        <span className="inline-block text-[10px] text-stone border border-sand rounded-full px-2.5 py-0.5 mt-2">
          {product.format}
        </span>

        {/* Bottom row */}
        <div className="flex justify-between items-center mt-4">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            {hasCompare && (
              <Price amount={product.compareAtPrice} className="font-display text-sm text-stone line-through" />
            )}
            <Price amount={product.price} className="font-display text-xl" />
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="ritual-add w-8 h-8 border border-sand flex items-center justify-center text-stone transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.92]"
            aria-label={`Add ${product.name} to bag`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
