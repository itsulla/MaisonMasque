import {Link, type MetaFunction} from '@remix-run/react';
import {getMorningVeilProducts, getRitualProducts, type Product} from '~/lib/products';
import {Price} from '~/components/shared/Price';
import {useCurrency} from '~/lib/currencyContext';
import {canonicalLink} from '~/lib/seo';

export const meta: MetaFunction = ({location}) => {
  return [
    {title: 'The Morning Veil — Korean Sunscreens | Maison Masque'},
    {
      name: 'description',
      content:
        'Two weightless Korean sunscreens chosen for luminous protection. SPF50+ PA++++ sun shields — the final step before you face the world.',
    },
    {property: 'og:title', content: 'The Morning Veil — Korean Sunscreens | Maison Masque'},
    {
      property: 'og:description',
      content:
        'Two weightless Korean sunscreens chosen for luminous protection. The final step before you face the world.',
    },
    {property: 'og:type', content: 'website'},
    canonicalLink(location.pathname),
  ];
};

const PAIRINGS: Record<string, {handle: string; label: string}> = {
  'beauty-of-joseon-relief-sun': {
    handle: 'medicube-pdrn-gel-mask',
    label: 'Ritual I — Restore',
  },
  'heimish-artless-glow-tinted-sunscreen': {
    handle: 'abib-heartleaf-gummy-mask',
    label: 'Ritual III — Calm',
  },
};

const SHIPPING_THRESHOLDS: Record<string, number> = {
  USD: 45,
  GBP: 36,
  AUD: 70,
  EUR: 42,
  ZAR: 820,
};

const GRADIENT_MAP: Record<string, string> = {
  '#F5E6D0': 'from-[#F5E6D0]/30 to-ivory',
  '#E8D5C4': 'from-[#E8D5C4]/30 to-ivory',
};

function getRate(currency: string): number {
  const rates: Record<string, number> = {
    USD: 1, AUD: 1.55, GBP: 0.79, EUR: 0.92, ZAR: 18.2,
  };
  return rates[currency] ?? 1;
}

export default function MorningVeilPage() {
  const morningVeilProducts = getMorningVeilProducts();
  const ritualProducts = getRitualProducts();
  const {currency, format} = useCurrency();

  const threshold = SHIPPING_THRESHOLDS[currency] ?? 45;
  const formattedThreshold = format(threshold / getRate(currency));

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-reveal pt-20 pb-16 px-6 text-center" style={{background: 'linear-gradient(180deg, #FAF8F3 0%, #FAF6EE 50%, #FAF8F3 100%)'}}>
        <div className="max-w-2xl mx-auto">
          <div className="w-px h-[50px] bg-sand mx-auto mb-8 hero-line-draw" />

          <p className="hero-overline text-[11px] uppercase tracking-[4px] text-stone font-semibold font-body">
            The Morning Veil
          </p>

          <h1 className="hero-word font-display text-[clamp(36px,5vw,56px)] mt-4 leading-snug" style={{animationDelay: '0.3s'}}>
            And when morning comes
          </h1>

          <p className="hero-subtitle text-base text-walnut mt-6 leading-relaxed max-w-xl mx-auto">
            The rituals restore. The veil protects. Two Korean sunscreens chosen
            for weightless protection and luminous finish &mdash; the final step
            before you face the world.
          </p>
        </div>
      </section>

      {/* ── FREE SHIPPING BANNER ── */}
      <div className="py-5 text-center border-y border-sand">
        <p className="text-sm text-walnut">
          <span className="text-gold mr-2">&#10022;</span>
          Complimentary shipping on orders over {formattedThreshold}
        </p>
      </div>

      {/* ── PRODUCT GRID ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto" aria-label="Morning Veil Products">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {morningVeilProducts.map((product) => (
            <MorningVeilCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      {/* ── RITUAL PAIRING ── */}
      <section className="py-20 px-6 border-t border-sand" aria-label="Complete Your Practice">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold font-body">
              Evening Rituals
            </p>
            <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
              Complete your practice
            </h2>
            <p className="text-sm text-walnut mt-3 max-w-lg mx-auto leading-relaxed">
              The Morning Veil pairs with each of the Five Rituals &mdash;
              protection by day, restoration by night. Add a ritual for
              complimentary shipping.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px border border-sand bg-sand">
            {ritualProducts.map((product) => (
              <Link
                key={product.handle}
                to={`/products/${product.handle}`}
                className="bg-cream p-5 text-center hover:bg-ivory transition-colors group"
              >
                <span className="font-display text-3xl text-sand group-hover:text-gold/30 transition-colors">
                  {product.ritualNumber}
                </span>
                <h3 className="font-display text-sm mt-2 group-hover:text-gold transition-colors">
                  {product.ritualName}
                </h3>
                <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">
                  {product.brand}
                </p>
                <Price amount={product.price} className="font-display text-sm mt-2 block" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND QUOTE ── */}
      <section className="py-16 px-6 text-center">
        <div className="w-[60px] h-px bg-gold mx-auto mb-8" />
        <p className="font-display text-lg italic text-stone">
          Curated in Hong Kong &middot; Shipped with reverence
        </p>
      </section>
    </div>
  );
}

function MorningVeilCard({product}: {product: Product}) {
  const gradient = GRADIENT_MAP[product.heroColor] ?? 'from-sand/30 to-ivory';
  const hasCompare = product.compareAtPrice > product.price;
  const pairing = PAIRINGS[product.handle];
  const isTinted = product.format === 'Tinted Sunscreen';

  return (
    <div className="border border-sand">
      {/* Image placeholder */}
      <div className={`h-[340px] bg-gradient-to-b ${gradient} flex items-center justify-center relative overflow-hidden`}>
        <div className="text-center">
          <span
            className="font-display text-8xl select-none block"
            style={{color: `${product.heroColor}30`}}
          >
            ☀
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[2px] text-stone">
          {product.brand}
        </p>
        <h3 className="font-display text-xl mt-1">{product.name}</h3>
        <p className="text-[13px] text-walnut mt-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-4">
          {hasCompare && (
            <Price
              amount={product.compareAtPrice}
              className="font-display text-sm text-stone line-through"
            />
          )}
          <Price amount={product.price} className="font-display text-xl" />
        </div>

        {/* Badges */}
        <div className="flex gap-2 mt-3">
          <span className="text-[10px] text-stone border border-sand rounded-full px-2.5 py-0.5">
            SPF50+ PA++++
          </span>
          {isTinted && (
            <span className="text-[10px] text-gold border border-gold/30 rounded-full px-2.5 py-0.5">
              Tinted
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/products/${product.handle}`}
          className="mt-5 block text-center border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold py-3 hover:border-gold hover:text-gold transition-colors"
        >
          Explore
        </Link>

        {/* Pairing suggestion */}
        {pairing && (
          <p className="text-xs text-stone italic mt-4 text-center">
            Pairs beautifully with{' '}
            <Link
              to={`/products/${pairing.handle}`}
              className="text-gold hover:text-ink transition-colors not-italic"
            >
              {pairing.label}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
