import {useCallback, useMemo, useState} from 'react';
import {type MetaFunction} from '@remix-run/react';
import {getBundleByHandle, getRequiredSelectionCount, type BundleSlot} from '~/lib/bundles';
import {getProductByHandle} from '~/lib/products';
import {useCart} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';
import {BundleSlotSelector} from '~/components/bundle/BundleSlotSelector';
import {BundleStickyBar} from '~/components/bundle/BundleStickyBar';
import {BundleFaq} from '~/components/bundle/BundleFaq';
import {SectionLabel} from '~/components/shared/SectionLabel';

const BUNDLE_HANDLE = 'the-evening-ritual';

export const meta: MetaFunction = () => {
  const bundle = getBundleByHandle(BUNDLE_HANDLE);
  return [
    {
      title: `${bundle?.name ?? 'The Evening Ritual'} | Maison Masque`,
    },
    {
      name: 'description',
      content:
        'Three masks and two elixirs, chosen by you. The core nighttime practice — save 18% when you bundle.',
    },
    {tagName: 'link', rel: 'canonical', href: 'https://maisonmasque.com/products/the-evening-ritual'},
  ];
};

const FAQ_ITEMS = [
  {
    q: 'Can I change my selections later?',
    a: 'Once your ritual ships, the contents are set — but while you are still shopping, feel free to swap items in and out before adding to cart. You can also reorder with different picks next month.',
  },
  {
    q: 'How do I use these together?',
    a: 'Apply your chosen elixirs after cleansing — layer the lightest first, pressing each into the skin before the next. Then apply your mask. On alternating evenings, choose a different mask to give each intention its moment.',
  },
  {
    q: "What if I don't love one of my picks?",
    a: 'The House of Masks stands behind every product. If a mask or elixir isn\'t right for your skin, contact the maison within 30 days and we will exchange it — or refund that portion of your bundle.',
  },
];

export default function EveningRitualRoute() {
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

  const handleSlotChange = (slotIndex: number, handles: string[]) => {
    setSelections((prev) => ({...prev, [slotIndex]: handles}));
  };

  const handleAddToCart = useCallback(() => {
    if (!isComplete) return;

    // Flatten all selections into an ordered list of product handles
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

  // Build the hand-tuned price string for the hero
  const heroPriceDisplay = useMemo(() => {
    const price = bundle.prices[currency] ?? bundle.price;
    const compareAt = bundle.comparePrices[currency] ?? bundle.compareAtPrice;
    return {
      price: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'USD' ? 2 : 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0,
      }).format(price),
      compareAt: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'USD' ? 2 : 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0,
      }).format(compareAt),
    };
  }, [bundle, currency]);

  return (
    <>
      {/* pb-40 leaves room for sticky bar + mobile bottom nav */}
      <div className="pb-[180px] md:pb-[120px]">
        {/* ── HERO ── */}
        <section
          className="silk-hero-bg relative py-24 lg:py-32 px-6"
          aria-label="The Evening Ritual hero"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-px h-[60px] bg-sand mx-auto mb-8" aria-hidden="true" />
            <SectionLabel>{bundle.tagline}</SectionLabel>
            <h1 className="silk-hero-title font-display text-ink mt-6">
              The <span className="italic" style={{color: bundle.heroColor}}>Evening</span> Ritual
            </h1>
            <div
              className="w-[60px] h-px mx-auto mt-6"
              style={{backgroundColor: bundle.heroColor}}
              aria-hidden="true"
            />
            <p className="text-[15px] md:text-[16px] text-walnut mt-8 max-w-xl mx-auto leading-[1.8]">
              {bundle.description}
            </p>

            {/* Price row */}
            <div className="flex items-baseline justify-center gap-3 mt-8">
              <span className="font-display text-[clamp(32px,4vw,42px)] text-ink">
                {heroPriceDisplay.price}
              </span>
              <span className="font-display text-[18px] text-stone line-through">
                {heroPriceDisplay.compareAt}
              </span>
              <span
                className="text-[11px] uppercase tracking-[2px] font-semibold font-body px-2 py-1"
                style={{backgroundColor: bundle.heroColor, color: '#FAF8F3'}}
              >
                Save {bundle.discountPercent}%
              </span>
            </div>
          </div>
        </section>

        {/* ── SLOT SELECTORS ── */}
        <section className="py-20 px-6 max-w-7xl mx-auto" aria-label="Build your bundle">
          <div className="text-center mb-14">
            <SectionLabel>Compose your bundle</SectionLabel>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
              Five pieces, chosen by you
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

        {/* ── BELOW THE FOLD — editorial ── */}
        <section
          className="py-20 px-6 border-t border-sand bg-ivory/40"
          aria-label="What's inside the ritual"
        >
          <div className="max-w-3xl mx-auto text-center">
            <SectionLabel>Inside the ritual</SectionLabel>
            <h2 className="font-display text-[clamp(28px,3vw,36px)] mt-3">
              Why masks and elixirs, together
            </h2>
            <div className="w-[60px] h-px bg-gold mx-auto mt-4 mb-8" aria-hidden="true" />
            <p className="text-[15px] text-walnut leading-[1.9] mb-5">
              A mask is the moment — a pause. An elixir is the foundation — the patient,
              repeated act of care that primes the skin to receive.
            </p>
            <p className="text-[15px] text-walnut leading-[1.9]">
              The Evening Ritual brings both into one practice: three masks to give your
              skin a different intention each night, and two elixirs to layer beneath. Used
              together, they become a ceremony — the kind that marks the end of the day.
            </p>
          </div>
        </section>

        <BundleFaq items={FAQ_ITEMS} />
      </div>

      <BundleStickyBar
        bundle={bundle}
        currentCount={currentCount}
        requiredCount={requiredCount}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
