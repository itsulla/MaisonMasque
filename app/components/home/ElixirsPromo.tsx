import {Link} from '@remix-run/react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {Price} from '~/components/shared/Price';
import {getElixirProducts} from '~/lib/products';

const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
};

const elixirProducts = getElixirProducts();

export function ElixirsPromo() {
  return (
    <section className="py-14 lg:py-[100px] px-6" aria-label="The Elixirs">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <SectionLabel>The Elixirs</SectionLabel>
        <h2 className="font-display text-[clamp(24px,3.5vw,42px)] mt-3">
          The foundation beneath the ritual
        </h2>
        <p className="text-sm text-walnut mt-3 max-w-[600px] mx-auto leading-relaxed">
          Daily PDRN elixirs to amplify your masking practice. Apply before or
          after any ritual to deepen its effects.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-sand bg-sand max-w-[800px] mx-auto">
        {elixirProducts.map((product) => {
          const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';

          return (
            <div key={product.handle} className="bg-cream group">
              <div className={`h-[240px] bg-gradient-to-b ${gradient} flex items-center justify-center overflow-hidden`}>
                <span
                  className="font-display text-7xl select-none group-hover:scale-105 transition-transform duration-500"
                  style={{color: `${product.heroColor}20`}}
                >
                  ✧
                </span>
              </div>

              <div className="p-5 text-center">
                <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                  {product.ritualName}
                </p>
                <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">
                  {product.brand}
                </p>
                <h3 className="font-display text-[17px] font-medium mt-2">
                  {product.name}
                </h3>
                <Price amount={product.price} className="font-display text-lg mt-2 block" />
                <Link
                  to={`/products/${product.handle}`}
                  className="inline-block mt-4 text-xs text-gold uppercase tracking-[3px] hover:text-ink transition-colors"
                >
                  Discover &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
