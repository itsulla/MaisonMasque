import {useCallback, useMemo, useState} from 'react';
import {type MetaFunction} from '@remix-run/react';
import {getBundleByHandle, getRequiredSelectionCount, type BundleSlot} from '~/lib/bundles';
import {getProductByHandle} from '~/lib/products';
import {useCart} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';
import {BundleSlotSelector} from '~/components/bundle/BundleSlotSelector';
import {BundleFixedContents} from '~/components/bundle/BundleFixedContents';
import {BundleStickyBar} from '~/components/bundle/BundleStickyBar';
import {BundleFaq} from '~/components/bundle/BundleFaq';
import {SectionLabel} from '~/components/shared/SectionLabel';

const BUNDLE_HANDLE = 'the-complete-ritual';

export const meta: MetaFunction = () => {
  const bundle = getBundleByHandle(BUNDLE_HANDLE);
  return [
    {
      title: `${bundle?.name ?? 'The Complete Ritual'} | Maison Masque`,
    },
    {
      name: 'description',
      content:
        'All five masks, two elixirs of your choosing, and one Morning Veil. The deepest commitment — save 25% when you bundle.',
    },
    {tagName: 'link', rel: 'canonical', href: 'https://maisonmasque.com/products/the-complete-ritual'},
  ];
};

const FAQ_ITEMS = [
  {
    q: 'Can I change my selections later?',
    a: 'Once your ritual ships, the contents are set — but while you are still shopping, feel free to swap items in and out before adding to cart. You can also reorder with different picks next month.',
  },
  {
    q: 'How do I use these together?',
    a: 'Apply your Morning Veil in the day for protection. At night, cleanse, layer your two elixirs lightest-to-heaviest, then choose one of the five masks. Alternate masks across the week so each intention has its moment.',
  },
  {
    q: "What if I don't love one of my picks?",
    a: 'The House of Masks stands behind every product. If a mask, elixir, or sunscreen isn\'t right for your skin, contact the maison within 30 days and we will exchange or refund that portion of your bundle.',
  },
  {
    q: 'Does this replace my whole routine?',
    a: 'The Complete Ritual covers the ceremonial layer — masks, elixirs, and sunscreen. You will still want a gentle cleanser and a moisturiser from your existing routine. Think of this as the soul of the practice, not every step.',
  },
];

const JOURNEY_STEPS = [
  {numeral: 'I', name: 'Cleanse', desc: 'End the day. Wash away what it left behind.'},
  {numeral: 'II', name: 'Elixir', desc: 'Press your chosen elixirs into the skin, one at a time.'},
  {numeral: 'III', name: 'Mask', desc: 'Apply a mask. Sit. Let it do its work.'},
  {numeral: 'IV', name: 'Rest', desc: 'Sleep, while the ingredients continue theirs.'},
  {numeral: 'V', name: 'Morning Veil', desc: 'Face the day, protected and composed.'},
];

export default function CompleteRitualRoute() {
  const bundle = getBundleByHandle(BUNDLE_HANDLE);
  const {addItem, open: openCart} = useCart();
  const {currency} = useCurrency();

  const [selections, setSelections] = useState<Record<number, string[]>>({});

  if (!bundle) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p>Bundle not found.</p>
      </div>
    );
  }

  const requiredCount = getRequiredSelectionCount(bundle);
  const currentCount = Object.values(selections).reduce((sum, arr) => sum + arr.length, 0);
  const isComplete = currentCount >= requiredCount;

  const fixedSlot = bundle.slots.find((s) => s.fixed);
  const fixedHandles = fixedSlot?.includedHandles ?? [];

  const handleSlotChange = (slotIndex: number, handles: string[]) => {
    setSelections((prev) => ({...prev, [slotIndex]: handles}));
  };

  const handleAddToCart = useCallback(() => {
    if (!isComplete) return;

    const selectedHandles: string[] = [];
    bundle.slots.forEach((slot, i) => {
      if (slot.fixed && slot.includedHandles) {
        selectedHandles.push(...slot.includedHandles);
      } else if (selections[i]) {
        selectedHandles.push(...selections[i]);
      }
    });

    const selectedItems = selectedHandles
      .map((h) => getProductByHandle(h))
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .map((p) => ({handle: p.handle, title: p.name, vendor: p.brand}));

    addItem({
      id: `bundle-${bundle.handle}-${Date.now()}`,
      handle: bundle.handle,
      title: bundle.name,
      vendor: 'Maison Masque',
      featuredImage: null,
      priceRange: {
        minVariantPrice: {
          amount: bundle.price.toFixed(2),
          currencyCode: 'USD',
        },
      },
      bundleHandle: bundle.handle,
      selectedItems,
    });
    openCart();
  }, [isComplete, bundle, selections, addItem, openCart]);

  const heroPriceDisplay = useMemo(() => {
    const price = bundle.prices[currency] ?? bundle.price;
    const compareAt = bundle.comparePrices[currency] ?? bundle.compareAtPrice;
    const fmt = (n: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'USD' ? 2 : 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0,
      }).format(n);
    return {price: fmt(price), compareAt: fmt(compareAt)};
  }, [bundle, currency]);

  return (
    <>
      <div className="pb-[180px] md:pb-[120px]">
        {/* ── DARK HERO ── */}
        <section
          className="relative py-28 lg:py-36 px-6 overflow-hidden"
          style={{backgroundColor: '#2C2722'}}
          aria-label="The Complete Ritual hero"
        >
          {/* Radial gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, rgba(197, 165, 90, 0.12) 0%, rgba(197, 165, 90, 0) 60%)',
            }}
            aria-hidden="true"
          />
          <div className="max-w-3xl mx-auto text-center relative">
            <div
              className="w-px h-[60px] mx-auto mb-8"
              style={{backgroundColor: 'rgba(197, 165, 90, 0.4)'}}
              aria-hidden="true"
            />
            <SectionLabel>{bundle.tagline}</SectionLabel>
            <h1
              className="font-display mt-6"
              style={{
                fontSize: 'clamp(48px, 7vw, 88px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#FAF8F3',
              }}
            >
              The <span className="italic" style={{color: '#D4BA7A'}}>Complete</span> Ritual
            </h1>
            <div
              className="w-[80px] h-px mx-auto mt-8"
              style={{backgroundColor: '#C5A55A'}}
              aria-hidden="true"
            />
            <p
              className="text-[15px] md:text-[16px] mt-8 max-w-xl mx-auto leading-[1.8]"
              style={{color: 'rgba(250, 248, 243, 0.7)'}}
            >
              {bundle.description}
            </p>

            {/* Price row */}
            <div className="flex items-baseline justify-center gap-3 mt-10">
              <span
                className="font-display"
                style={{
                  fontSize: 'clamp(36px, 4.5vw, 48px)',
                  color: '#FAF8F3',
                }}
              >
                {heroPriceDisplay.price}
              </span>
              <span
                className="font-display text-[18px] line-through"
                style={{color: 'rgba(250, 248, 243, 0.4)'}}
              >
                {heroPriceDisplay.compareAt}
              </span>
              <span
                className="text-[11px] uppercase tracking-[2px] font-semibold font-body px-2 py-1"
                style={{backgroundColor: '#C5A55A', color: '#2C2722'}}
              >
                Save {bundle.discountPercent}%
              </span>
            </div>
          </div>
        </section>

        {/* ── FIXED CONTENTS — All 5 masks ── */}
        {fixedSlot && fixedHandles.length > 0 && (
          <BundleFixedContents
            title="All 5 rituals, included"
            handles={fixedHandles}
          />
        )}

        {/* ── SLOT SELECTORS (elixirs + sunscreen) ── */}
        <section
          className="py-12 px-6 max-w-7xl mx-auto border-t border-sand"
          aria-label="Build your bundle"
        >
          <div className="text-center mb-14">
            <SectionLabel>Choose the rest</SectionLabel>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
              Now compose the day
            </h2>
            <div className="w-[60px] h-px bg-gold mx-auto mt-4" aria-hidden="true" />
          </div>

          {bundle.slots.map((slot: BundleSlot, i: number) =>
            slot.fixed ? null : (
              <BundleSlotSelector
                key={i}
                slot={slot}
                selected={selections[i] ?? []}
                onChange={(handles) => handleSlotChange(i, handles)}
              />
            ),
          )}
        </section>

        {/* ── RITUAL JOURNEY TIMELINE ── */}
        <section
          className="py-20 px-6 border-t border-sand bg-ivory/30"
          aria-label="The full ritual journey"
        >
          <div className="max-w-5xl mx-auto text-center mb-14">
            <SectionLabel>The full day</SectionLabel>
            <h2 className="font-display text-[clamp(28px,3vw,36px)] mt-3">
              Morning, evening, and through the night
            </h2>
            <div className="w-[60px] h-px bg-gold mx-auto mt-4" aria-hidden="true" />
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 border border-sand bg-cream">
            {JOURNEY_STEPS.map((step, i) => (
              <div
                key={step.numeral}
                className={`text-center px-6 py-10 ${
                  i < JOURNEY_STEPS.length - 1
                    ? 'border-b md:border-b-0 md:border-r border-sand'
                    : ''
                }`}
              >
                <div className="font-display text-[48px] text-sand leading-none">
                  {step.numeral}
                </div>
                <h3 className="font-display text-[16px] mt-4 text-ink">{step.name}</h3>
                <p className="text-[12px] text-stone mt-2 leading-relaxed max-w-[180px] mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <BundleFaq items={FAQ_ITEMS} />
      </div>

      <BundleStickyBar
        bundle={bundle}
        currentCount={currentCount}
        requiredCount={requiredCount}
        onAddToCart={handleAddToCart}
        goldCta
      />
    </>
  );
}
