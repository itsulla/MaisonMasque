import {Link} from '@remix-run/react';
import {useMemo} from 'react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {bundles} from '~/lib/bundles';
import {useCurrency} from '~/lib/currencyContext';

/**
 * Homepage "Choose Your Ritual" section — the two-bundle showcase that
 * replaces the old single Complete Ritual banner. Two cards side by side,
 * with a third "or design your own" link below.
 */
export function ChooseYourRitual() {
  const {currency} = useCurrency();

  const cards = useMemo(() => {
    return bundles.map((bundle) => {
      const price = bundle.prices[currency] ?? bundle.price;
      const priceStr = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'USD' ? 2 : 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0,
      }).format(price);
      const isGold = bundle.handle === 'the-complete-ritual';
      const composition =
        bundle.handle === 'the-evening-ritual'
          ? '3 masks + 2 elixirs'
          : 'All 5 masks + 2 elixirs + 1 Morning Veil';
      const cta =
        bundle.handle === 'the-evening-ritual' ? 'Begin the ritual' : 'The full ritual';
      return {
        handle: bundle.handle,
        name: bundle.name,
        composition,
        priceStr,
        discount: bundle.discountPercent,
        heroColor: bundle.heroColor,
        isGold,
        cta,
      };
    });
  }, [currency]);

  return (
    <section
      className="py-16 px-6 max-w-7xl mx-auto"
      aria-label="Choose your ritual"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <SectionLabel>Two curated paths</SectionLabel>
        <h2 className="font-display text-[clamp(32px,4vw,52px)] mt-3">
          Choose Your Ritual
        </h2>
        <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
        <p className="text-[15px] text-walnut mt-6 max-w-lg mx-auto leading-relaxed">
          Two curated paths into the maison.
        </p>
      </div>

      {/* Two bundle cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {cards.map((card) => (
          <Link
            key={card.handle}
            to={`/products/${card.handle}`}
            className="group block border border-sand bg-cream relative overflow-hidden transition-all duration-500 hover:border-gold"
          >
            {/* Accent bar at top */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{backgroundColor: card.heroColor}}
              aria-hidden="true"
            />

            <div className="p-10 lg:p-14 text-center">
              <p
                className="text-[11px] uppercase tracking-[4px] font-semibold font-body"
                style={{color: card.heroColor}}
              >
                {card.isGold ? 'The full day' : 'Nighttime'}
              </p>
              <h3 className="font-display text-[clamp(28px,3vw,40px)] mt-4 text-ink transition-colors group-hover:text-gold">
                {card.name}
              </h3>
              <div
                className="w-[40px] h-px mx-auto mt-4 transition-all duration-500 group-hover:w-[80px]"
                style={{backgroundColor: card.heroColor}}
                aria-hidden="true"
              />
              <p className="text-[14px] text-walnut mt-5 leading-relaxed">
                {card.composition}
              </p>
              <p className="mt-6 flex items-baseline justify-center gap-2">
                <span className="font-display text-[clamp(22px,2.5vw,28px)] text-ink">
                  {card.priceStr}
                </span>
                <span className="text-[12px] text-stone">· Save {card.discount}%</span>
              </p>

              {/* CTA */}
              <span
                className={`inline-block mt-8 px-8 py-4 text-[11px] uppercase tracking-[3px] font-semibold font-body transition-all duration-300 ${
                  card.isGold
                    ? 'text-cream'
                    : 'bg-ink text-cream group-hover:bg-espresso'
                }`}
                style={card.isGold ? {backgroundColor: '#C5A55A'} : undefined}
              >
                {card.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Build Your Own link */}
      <p className="text-center mt-10 text-[14px] text-walnut">
        Or{' '}
        <Link
          to="/build-your-own"
          className="text-gold hover:text-ink transition-colors underline underline-offset-4 decoration-sand hover:decoration-ink"
        >
          design your own
        </Link>{' '}
        &mdash; 4 items, 15% off.
      </p>
    </section>
  );
}
