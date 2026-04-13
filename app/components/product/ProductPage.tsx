import {Link} from '@remix-run/react';
import {useState} from 'react';
import {getProductByHandle, getRitualProducts, getMorningVeilProducts, getElixirProducts, type Product} from '~/lib/products';
import {useCart} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';
import {Price, PriceWithCompare} from '~/components/shared/Price';
import {MorningVeilCrossSell} from '~/components/shared/MorningVeilCrossSell';
import {ElixirCrossSell} from '~/components/shared/ElixirCrossSell';
import {GiftTierNudge} from '~/components/shared/GiftTierNudge';
import {RitualNumeral} from '~/components/shared/RitualNumeral';
import {ProductBrandStory} from '~/components/product/ProductBrandStory';

interface ProductPageProps {
  handle: string;
}

const SHIPPING_THRESHOLDS_USD: Record<string, number> = {
  USD: 45, GBP: 36, AUD: 70, EUR: 42, ZAR: 820,
};

function getRate(currency: string): number {
  const rates: Record<string, number> = {USD: 1, AUD: 1.55, GBP: 0.79, EUR: 0.92, ZAR: 18.2};
  return rates[currency] ?? 1;
}

const PDRN_CALLOUT =
  'PDRN \u2014 polydeoxyribonucleotide \u2014 is derived from salmon DNA. Used in Korean dermatology clinics for skin regeneration, it stimulates cell renewal and collagen production. Once exclusive to clinical settings, it\u2019s now the most sought-after ingredient in Korean skincare.';

// Elixir pairing config
const ELIXIR_PAIRINGS: Record<string, {pairings: {handle: string; label: string; copy: string}[]}> = {
  'medicube-pdrn-peptide-serum': {
    pairings: [
      {
        handle: 'medicube-pdrn-gel-mask',
        label: 'Ritual I \u2014 Restore',
        copy: 'Same PDRN ingredient family, amplified together.',
      },
    ],
  },
  'celdyque-pdrn-egf-serum': {
    pairings: [
      {
        handle: 'medicube-pdrn-gel-mask',
        label: 'Ritual I \u2014 Restore',
        copy: 'PDRN elixir meets PDRN mask.',
      },
      {
        handle: 'abib-heartleaf-gummy-mask',
        label: 'Ritual III \u2014 Calm',
        copy: 'Regeneration meets calm.',
      },
    ],
  },
};

// Pairing map: morning-veil handle → ritual handle + copy
const CENTELLA_SPOTLIGHT =
  'SKIN1004 sources its Centella Asiatica exclusively from Madagascar, where volcanic soil and tropical climate produce the most potent variety. Used in traditional medicine for centuries, Centella is clinically proven to support skin barrier repair, reduce inflammation, and accelerate healing. Combined with hyaluronic acid, it delivers overnight hydration that you can feel by morning.';

const RITUAL_V_VS_II =
  'Ritual II is a wrapping mask \u2014 apply as gel, it dries to a peelable film for lifting and firming. Ritual V is a sleeping pack \u2014 a rich cream that absorbs overnight for deep hydration and barrier repair. Use both on alternate nights for complete overnight renewal.';

const GLASS_SKIN_EXPLANATION =
  'Glass skin \u2014 skin so clear and luminous it appears translucent \u2014 is the defining ideal of Korean skincare. Numbuzin\u2019s No.3 is the mask that earned its name from this pursuit. A gentle triple-acid complex (AHA, BHA, PHA) refines without irritation, while Centella Asiatica calms and protects. The result: pores appear smaller, texture smoother, and skin takes on the lit-from-within quality that glass skin describes.';

const NUMBUZIN_NOTE =
  'Numbuzin names each product by number \u2014 each targeting a specific skin concern. No.3 is their glass skin formula, designed for pore refinement and texture smoothing.';

// Ritual IV pairing: Elixir II at same $18 price point
const RITUAL_IV_PAIRING = {
  handle: 'celdyque-pdrn-egf-serum',
  label: 'Elixir II \u2014 Fortify',
  copy: 'Both at the same price point. Together they\u2019re one step from complimentary shipping.',
};

const MORNING_VEIL_PAIRINGS: Record<string, {handle: string; label: string; copy: string}> = {
  'beauty-of-joseon-relief-sun': {
    handle: 'medicube-pdrn-gel-mask',
    label: 'Ritual I — Restore',
    copy: 'Morning protection meets evening renewal.',
  },
  'heimish-artless-glow-tinted-sunscreen': {
    handle: 'abib-heartleaf-gummy-mask',
    label: 'Ritual III — Calm',
    copy: 'Morning radiance meets evening calm.',
  },
};

// PDRN Trio: Elixir III + Elixir I + Ritual I (all Medicube PDRN)
const PDRN_TRIO_HANDLES = ['medicube-pdrn-milky-toner', 'medicube-pdrn-peptide-serum', 'medicube-pdrn-gel-mask'];

export function ProductPage({handle}: ProductPageProps) {
  const product = getProductByHandle(handle);
  const {addItem, lines, subtotal} = useCart();
  const {currency, format, convert} = useCurrency();
  const [qty, setQty] = useState(1);
  const [howToOpen, setHowToOpen] = useState(false);
  const [pdrnOpen, setPdrnOpen] = useState(false);
  const [centellaOpen, setCentellaOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [glassSkinOpen, setGlassSkinOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-display text-3xl mb-4">Product not found</h1>
        <Link to="/" className="text-xs uppercase tracking-[3px] text-gold hover:text-ink transition-colors">
          Return to the Maison
        </Link>
      </div>
    );
  }

  if (handle === 'the-complete-ritual') {
    return <BundlePage product={product} />;
  }

  const isMorningVeil = product.collection === 'morning-veil';
  const isElixir = product.collection === 'elixir';
  const isRitualV = handle === 'skin1004-centella-sleeping-pack';
  const isRitualIV = handle === 'numbuzin-no3-pore-mask';
  const isElixirIII = handle === 'medicube-pdrn-milky-toner';
  const pairing = isMorningVeil ? MORNING_VEIL_PAIRINGS[handle] : null;
  const pairingProduct = pairing ? getProductByHandle(pairing.handle) : null;

  // Shipping threshold check
  const thresholdLocal = SHIPPING_THRESHOLDS_USD[currency] ?? 45;
  const thresholdUsd = thresholdLocal / getRate(currency);
  const cartPlusProduct = subtotal + product.price * qty;
  const hitsShipping = cartPlusProduct >= thresholdUsd;

  const handleAddToCart = () => {
    addItem(
      {
        id: `product-${product.handle}`,
        handle: product.handle,
        title: product.name,
        vendor: product.brand,
        featuredImage: null,
        priceRange: {minVariantPrice: {amount: product.price.toFixed(2), currencyCode: product.currency}},
      },
      qty,
    );
  };

  const addProductToCart = (p: Product) => {
    addItem({
      id: `product-${p.handle}`,
      handle: p.handle,
      title: p.name,
      vendor: p.brand,
      featuredImage: null,
      priceRange: {minVariantPrice: {amount: p.price.toFixed(2), currencyCode: p.currency}},
    });
  };

  const handleAddBothToCart = () => {
    if (!pairingProduct) return;
    addProductToCart(product);
    addProductToCart(pairingProduct);
  };

  const handleAddPair = (pairedHandle: string) => {
    const paired = getProductByHandle(pairedHandle);
    if (!paired) return;
    addProductToCart(product);
    addProductToCart(paired);
  };

  const altText = isMorningVeil
    ? `${product.brand} ${product.name} - Korean Sunscreen - Maison Masque`
    : isElixir
      ? `${product.brand} ${product.name} - Korean Elixir - Maison Masque`
      : `${product.brand} ${product.name} - Korean Sheet Mask - Maison Masque`;

  const collectionLabel = isMorningVeil
    ? 'The Morning Veil'
    : isElixir
      ? 'The Elixirs'
      : 'The Five Rituals';
  const collectionHref = isMorningVeil
    ? '/the-morning-veil'
    : isElixir
      ? '/collections/elixirs'
      : '/collections/the-five-rituals';

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-0 lg:gap-12 max-w-7xl mx-auto py-8 lg:py-16 px-6">
        {/* LEFT — Image */}
        <div className="pdp-image-wrap overflow-hidden bg-cream p-10 flex items-center justify-center mb-8 lg:mb-0">
          {product.image ? (
            <img
              src={product.image}
              alt={altText}
              className="w-full h-auto object-contain transition-transform duration-[600ms] ease-out hover:scale-[1.02]"
              loading="eager"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                e.currentTarget.parentElement?.classList.add('pdp-placeholder-active');
              }}
            />
          ) : null}
          <div
            className="pdp-placeholder w-full aspect-square flex items-center justify-center relative"
            style={{background: `radial-gradient(circle at 50% 40%, ${product.heroColor}18 0%, #FAF8F3 70%)`}}
          >
            <span
              className="font-display text-[120px] select-none absolute inset-0 flex items-center justify-center"
              style={{color: `${product.heroColor}14`}}
            >
              {product.ritualNumber ?? (isMorningVeil ? '☀' : '')}
            </span>
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="flex flex-col">
          {/* Breadcrumb */}
          <nav className="text-xs text-stone" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-1.5">/</span>
            <Link to={collectionHref} className="hover:text-gold transition-colors">
              {collectionLabel}
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-walnut">{product.name}</span>
          </nav>

          {/* Collection / Ritual badge */}
          {product.ritualNumber ? (
            <p className="text-[11px] uppercase tracking-[3px] text-gold font-semibold mt-6 flex items-center gap-2">
              <span className="text-[8px]">&#9670;</span>
              Ritual {product.ritualNumber} &mdash; {product.ritualName}
            </p>
          ) : isElixir ? (
            <p className="text-[11px] uppercase tracking-[3px] text-gold font-semibold mt-6 flex items-center gap-2">
              <span className="text-[8px]">&#9670;</span>
              {product.ritualName}
            </p>
          ) : isMorningVeil ? (
            <p className="text-[11px] uppercase tracking-[3px] text-gold font-semibold mt-6 flex items-center gap-2">
              <span className="text-[8px]">&#9670;</span>
              The Morning Veil &mdash; SPF50+
            </p>
          ) : null}

          {/* Brand */}
          <p className="text-[11px] uppercase tracking-[2px] text-stone mt-3">
            {product.brand}
          </p>

          {/* Product name */}
          <h1 className="font-display text-[28px] text-ink mt-2 leading-snug flex items-center gap-3">
            {product.name}
            {isElixirIII && (
              <span className="text-[9px] uppercase tracking-[2px] font-semibold text-gold border border-gold/40 rounded-full px-2.5 py-0.5 font-body whitespace-nowrap">
                Trending
              </span>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-stone italic mt-1">
            {product.subtitle}
            {isElixirIII && (
              <span className="not-italic text-walnut"> &mdash; 5&times; the volume of our concentrated serums</span>
            )}
          </p>

          {/* Price block */}
          <div className="flex items-baseline gap-3 mt-4">
            <PriceWithCompare
              amount={product.price}
              compareAt={product.compareAtPrice}
              priceClassName="font-display text-2xl text-ink"
              compareClassName="font-display text-base text-stone"
            />
          </div>

          {/* Social proof (morning veil only) */}
          {product.socialProof && (
            <p className="text-xs text-walnut mt-2 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {product.socialProof}
            </p>
          )}

          {/* Prominent cruelty-free badges (Ritual V) */}
          {isRitualV && (
            <div className="flex gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-sage/10 text-sage border border-sage/20 rounded-full px-3.5 py-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8FA68E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                PETA Certified Cruelty-Free
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-sage/10 text-sage border border-sage/20 rounded-full px-3.5 py-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8FA68E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                100% Vegan
              </span>
            </div>
          )}

          {/* Gold divider */}
          <div className="w-10 h-px bg-gold mt-6" />

          {/* Description */}
          <p className="text-sm text-walnut mt-6 leading-[1.7]">
            {product.description}
          </p>

          {/* Key ingredient callout */}
          {product.keyIngredient && (
            <div className="border border-sand p-3 mt-6 flex items-start gap-3">
              <span className="text-gold text-xs mt-0.5">&#9670;</span>
              <div>
                <p className="text-[10px] uppercase tracking-[2px] text-gold font-semibold">
                  Key ingredient
                </p>
                <p className="text-[13px] text-ink mt-0.5">
                  {product.keyIngredient}
                </p>
              </div>
            </div>
          )}

          {/* How to use accordion */}
          {product.howToUse && (
            <div className="border-b border-sand mt-6">
              <button
                type="button"
                onClick={() => setHowToOpen(!howToOpen)}
                className="w-full flex items-center justify-between py-4 text-sm font-medium text-ink"
                aria-expanded={howToOpen}
              >
                {isMorningVeil ? 'How to apply' : isElixir ? 'How to apply' : 'How to use'}
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-300 ${howToOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{maxHeight: howToOpen ? '200px' : '0'}}
              >
                <p className="text-[13px] text-walnut leading-relaxed pb-4">
                  {product.howToUse}
                </p>
              </div>
            </div>
          )}

          {/* PDRN ingredient spotlight (elixirs only) */}
          {isElixir && (
            <div className="border-b border-sand mt-6">
              <button
                type="button"
                onClick={() => setPdrnOpen(!pdrnOpen)}
                className="w-full flex items-center justify-between py-4 text-sm font-medium text-ink"
                aria-expanded={pdrnOpen}
              >
                What is PDRN?
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-300 ${pdrnOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{maxHeight: pdrnOpen ? '200px' : '0'}}
              >
                <p className="text-[13px] text-walnut leading-relaxed pb-4">
                  {PDRN_CALLOUT}
                </p>
              </div>
            </div>
          )}

          {/* Madagascar Centella spotlight (Ritual V only) */}
          {isRitualV && (
            <div className="border-b border-sand mt-6">
              <button
                type="button"
                onClick={() => setCentellaOpen(!centellaOpen)}
                className="w-full flex items-center justify-between py-4 text-sm font-medium text-ink"
                aria-expanded={centellaOpen}
              >
                Madagascar Centella Asiatica
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-300 ${centellaOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{maxHeight: centellaOpen ? '300px' : '0'}}
              >
                <p className="text-[13px] text-walnut leading-relaxed pb-4">
                  {CENTELLA_SPOTLIGHT}
                </p>
              </div>
            </div>
          )}

          {/* Ritual V vs Ritual II comparison */}
          {isRitualV && (
            <div className="border-b border-sand">
              <button
                type="button"
                onClick={() => setComparisonOpen(!comparisonOpen)}
                className="w-full flex items-center justify-between py-4 text-sm font-medium text-ink"
                aria-expanded={comparisonOpen}
              >
                How Ritual V differs from Ritual II
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-300 ${comparisonOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{maxHeight: comparisonOpen ? '300px' : '0'}}
              >
                <p className="text-[13px] text-walnut leading-relaxed pb-4">
                  {RITUAL_V_VS_II}
                </p>
              </div>
            </div>
          )}

          {/* Glass skin explanation (Ritual IV only) */}
          {isRitualIV && (
            <div className="border-b border-sand mt-6">
              <button
                type="button"
                onClick={() => setGlassSkinOpen(!glassSkinOpen)}
                className="w-full flex items-center justify-between py-4 text-sm font-medium text-ink"
                aria-expanded={glassSkinOpen}
              >
                The glass skin standard
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-300 ${glassSkinOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{maxHeight: glassSkinOpen ? '300px' : '0'}}
              >
                <p className="text-[13px] text-walnut leading-relaxed pb-3">
                  {GLASS_SKIN_EXPLANATION}
                </p>
                <p className="text-[12px] text-stone leading-relaxed pb-4 italic">
                  {NUMBUZIN_NOTE}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[product.format, product.concern, product.skinType].map((tag) => (
              <span key={tag} className="text-[11px] text-stone border border-sand rounded-full px-3 py-1.5">
                {tag}
              </span>
            ))}
          </div>

          {/* Cruelty-free / vegan badges (generic, skip for Ritual V which has prominent badges above) */}
          {!isRitualV && product.tags && (product.tags.includes('cruelty-free') || product.tags.includes('vegan')) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {product.tags.includes('cruelty-free') && (
                <span className="flex items-center gap-1.5 text-[11px] text-sage border border-sage/30 rounded-full px-3 py-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8FA68E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  PETA Cruelty-Free
                </span>
              )}
              {product.tags.includes('vegan') && (
                <span className="flex items-center gap-1.5 text-[11px] text-sage border border-sage/30 rounded-full px-3 py-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8FA68E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  100% Vegan
                </span>
              )}
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center border border-sand h-10 w-fit mt-8">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-ink hover:text-gold transition-colors" aria-label="Decrease quantity">&minus;</button>
            <span className="w-10 h-full flex items-center justify-center text-sm font-body border-x border-sand">{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} className="w-10 h-full flex items-center justify-center text-ink hover:text-gold transition-colors" aria-label="Increase quantity">+</button>
          </div>

          {/* Add to cart — ink bg (NOT gold, gold is reserved for bundle) */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full h-[52px] mt-4 bg-ink text-cream font-display text-[13px] uppercase tracking-[3px] hover:bg-espresso transition-colors duration-300"
            aria-label={`Add ${qty} ${product.name} to bag`}
          >
            {isMorningVeil || isElixir ? 'Add to bag' : 'Add to ritual'}
          </button>

          {/* Free shipping nudge (non-ritual products) */}
          {(isMorningVeil || isElixir) && (
            <p className="text-[13px] text-stone mt-3">
              {hitsShipping ? (
                <span className="text-gold">Complimentary shipping with your order</span>
              ) : (
                <>
                  Add{' '}
                  <Link to="/collections/the-five-rituals" className="text-gold hover:text-ink transition-colors">
                    a ritual
                  </Link>
                  {' '}for complimentary shipping
                </>
              )}
            </p>
          )}

          {/* Gift tier nudge (all product pages) */}
          <GiftTierNudge productPriceUsd={product.price} qty={qty} />

          {/* Trust row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
            {['Authentic Korean', 'Ships from Hong Kong', '30-day returns'].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-xs text-walnut">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PDRN TRIO (Elixir III page only) ── */}
      {isElixirIII && (() => {
        const trioProducts = PDRN_TRIO_HANDLES.map((h) => getProductByHandle(h)).filter(Boolean) as Product[];
        const trioTotal = trioProducts.reduce((s, p) => s + p.price, 0);
        return (
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div className="bg-ivory p-6 lg:p-8">
              <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                Medicube PDRN
              </p>
              <h3 className="font-display text-xl mt-2">The PDRN Trio</h3>
              <p className="text-[13px] text-walnut mt-2">
                Three Medicube PDRN formats, one complete practice. Toner to prep, serum to treat, mask to seal.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                {trioProducts.map((p) => {
                  const isCurrent = p.handle === handle;
                  return (
                    <div key={p.handle} className={`border ${isCurrent ? 'border-gold/40 bg-cream' : 'border-sand bg-cream'} p-4 text-center`}>
                      {isCurrent && (
                        <p className="text-[9px] uppercase tracking-[2px] text-gold font-semibold mb-2">
                          You&apos;re viewing this
                        </p>
                      )}
                      <p className="text-[10px] uppercase tracking-[2px] text-stone">{p.brand}</p>
                      <h4 className="font-display text-sm mt-1">{p.ritualName || p.name}</h4>
                      <Price amount={p.price} className="font-display text-sm mt-1 block" />
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-sand/60">
                <div>
                  <p className="text-sm text-ink">
                    The PDRN Trio:{' '}
                    <Price amount={trioTotal} className="font-display" />
                  </p>
                  <p className="text-[11px] text-gold mt-0.5">
                    Includes both complimentary gifts at this total
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    for (const p of trioProducts) {
                      addProductToCart(p);
                    }
                  }}
                  className="flex-shrink-0 border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-3 hover:border-gold hover:text-gold transition-colors"
                >
                  Add all three to cart
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── RITUAL IV PAIRING (Ritual IV page only) ── */}
      {isRitualIV && (() => {
        const paired = getProductByHandle(RITUAL_IV_PAIRING.handle);
        if (!paired) return null;
        const combinedPrice = product.price + paired.price;
        return (
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div className="bg-ivory p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-ink">
                  This ritual pairs with{' '}
                  <Link to={`/products/${RITUAL_IV_PAIRING.handle}`} className="text-gold hover:text-ink transition-colors font-medium">
                    {RITUAL_IV_PAIRING.label}
                  </Link>
                </p>
                <p className="text-[13px] text-walnut italic mt-1">
                  {RITUAL_IV_PAIRING.copy} Ritual IV + Elixir II:{' '}
                  <Price amount={combinedPrice} className="font-display text-ink not-italic" />
                  {combinedPrice < thresholdUsd ? (
                    <span className="text-walnut not-italic ml-1">
                      &mdash; add any item for complimentary shipping
                    </span>
                  ) : (
                    <span className="text-gold not-italic ml-2">
                      &middot; Complimentary shipping
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAddPair(RITUAL_IV_PAIRING.handle)}
                className="flex-shrink-0 border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-3 hover:border-gold hover:text-gold transition-colors"
              >
                Add both to bag
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── ELIXIR PAIRING (elixir pages only) ── */}
      {isElixir && ELIXIR_PAIRINGS[handle] && (
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="bg-ivory p-6 lg:p-8">
            <p className="text-sm text-ink mb-4">
              {ELIXIR_PAIRINGS[handle].pairings.length === 1
                ? 'This elixir pairs with '
                : 'This elixir pairs with any ritual. Choose your evening ceremony.'}
              {ELIXIR_PAIRINGS[handle].pairings.length === 1 && (
                <Link
                  to={`/products/${ELIXIR_PAIRINGS[handle].pairings[0].handle}`}
                  className="text-gold hover:text-ink transition-colors font-medium"
                >
                  {ELIXIR_PAIRINGS[handle].pairings[0].label}
                </Link>
              )}
            </p>
            <div className="flex flex-col gap-3">
              {ELIXIR_PAIRINGS[handle].pairings.map((ep) => {
                const paired = getProductByHandle(ep.handle);
                if (!paired) return null;
                const combinedPrice = product.price + paired.price;
                return (
                  <div key={ep.handle} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      {ELIXIR_PAIRINGS[handle].pairings.length > 1 && (
                        <Link to={`/products/${ep.handle}`} className="text-sm text-gold hover:text-ink transition-colors font-medium">
                          {ep.label}
                        </Link>
                      )}
                      <p className="text-[13px] text-walnut italic mt-0.5">
                        {ep.copy} Together:{' '}
                        <Price amount={combinedPrice} className="font-display text-ink not-italic" />
                        {combinedPrice >= thresholdUsd && (
                          <span className="text-gold not-italic ml-2">
                            &middot; Complimentary shipping
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddPair(ep.handle)}
                      className="flex-shrink-0 border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-3 hover:border-gold hover:text-gold transition-colors"
                    >
                      Add both to bag
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CROSS-SELL A: Amplify with a ritual (elixir pages) ── */}
      {isElixir && (
        <section className="py-16 px-6 border-t border-sand" aria-label="Amplify with a ritual">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">Evening Rituals</p>
              <h2 className="font-display text-[clamp(20px,2.5vw,28px)] mt-3">Amplify with a ritual</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-sand bg-sand">
              {(handle === 'medicube-pdrn-peptide-serum'
                ? ['medicube-pdrn-gel-mask', 'abib-heartleaf-gummy-mask', 'the-complete-ritual']
                : ['medicube-pdrn-gel-mask', 'abib-heartleaf-gummy-mask', 'the-complete-ritual']
              ).map((h) => {
                const p = getProductByHandle(h);
                if (!p) return null;
                return (
                  <Link key={h} to={`/products/${h}`} className="bg-cream p-6 text-center hover:bg-ivory transition-colors group">
                    {p.ritualNumber && (
                      <span className="font-display text-3xl text-sand group-hover:text-gold/30 transition-colors">{p.ritualNumber}</span>
                    )}
                    <h3 className="font-display text-sm mt-2 group-hover:text-gold transition-colors">
                      {p.ritualNumber ? p.ritualName : p.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">{p.brand}</p>
                    <Price amount={p.price} className="font-display text-sm mt-2 block" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CROSS-SELL B: Also in The Elixirs ── */}
      {isElixir && (
        <section className="py-12 px-6 border-t border-sand" aria-label="Also in The Elixirs">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-[11px] uppercase tracking-[4px] text-stone font-semibold mb-6">
              Also in The Elixirs
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-sand bg-sand max-w-2xl mx-auto">
              {getElixirProducts()
                .filter((p) => p.handle !== handle)
                .map((p) => (
                  <Link key={p.handle} to={`/products/${p.handle}`} className="bg-cream p-6 hover:bg-ivory transition-colors group">
                    <p className="text-[10px] uppercase tracking-[2px] text-stone">{p.brand}</p>
                    <h3 className="font-display text-base mt-1 group-hover:text-gold transition-colors">{p.name}</h3>
                    <p className="text-xs text-walnut mt-1">{p.format}</p>
                    <Price amount={p.price} className="font-display text-sm mt-2 block" />
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND STORY (rich marketing assets from the manufacturer) ── */}
      <ProductBrandStory product={product} />

      {/* ── ELIXIR CROSS-SELL (ritual pages only) ── */}
      {!isMorningVeil && !isElixir && <ElixirCrossSell currentHandle={handle} />}

      {/* ── MORNING VEIL CROSS-SELL (ritual + elixir products) ── */}
      {!isMorningVeil && <MorningVeilCrossSell />}

      {/* ── SUGGESTED PAIRING (Morning Veil only) ── */}
      {isMorningVeil && pairing && pairingProduct && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-ivory p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-ink">
                This veil pairs with{' '}
                <Link to={`/products/${pairing.handle}`} className="text-gold hover:text-ink transition-colors font-medium">
                  {pairing.label}
                </Link>
              </p>
              <p className="text-[13px] text-walnut italic mt-1">
                {pairing.copy} Together:{' '}
                <Price amount={product.price + pairingProduct.price} className="font-display text-ink not-italic" />
                {product.price + pairingProduct.price >= thresholdUsd && (
                  <span className="text-gold not-italic ml-2">
                    &middot; Complimentary shipping
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBothToCart}
              className="flex-shrink-0 border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-3 hover:border-gold hover:text-gold transition-colors"
            >
              Add both to bag
            </button>
          </div>
        </div>
      )}

      {/* ── CROSS-SELL: Begin with the rituals ── */}
      {isMorningVeil && (
        <section className="py-16 px-6 border-t border-sand" aria-label="Begin with the rituals">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                Evening Rituals
              </p>
              <h2 className="font-display text-[clamp(20px,2.5vw,28px)] mt-3">
                Begin with the rituals
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-sand bg-sand">
              {(['medicube-pdrn-gel-mask', 'abib-heartleaf-gummy-mask', 'the-complete-ritual'] as const).map((h) => {
                const p = getProductByHandle(h);
                if (!p) return null;
                return (
                  <Link key={h} to={`/products/${h}`} className="bg-cream p-6 text-center hover:bg-ivory transition-colors group">
                    {p.ritualNumber && (
                      <span className="font-display text-3xl text-sand group-hover:text-gold/30 transition-colors">{p.ritualNumber}</span>
                    )}
                    <h3 className="font-display text-sm mt-2 group-hover:text-gold transition-colors">
                      {p.ritualNumber ? p.ritualName : p.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">{p.brand}</p>
                    <Price amount={p.price} className="font-display text-sm mt-2 block" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── ALSO IN THE MORNING VEIL ── */}
      {isMorningVeil && (
        <section className="py-12 px-6 border-t border-sand" aria-label="Also in The Morning Veil">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-[11px] uppercase tracking-[4px] text-stone font-semibold mb-6">
              Also in The Morning Veil
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-sand bg-sand max-w-2xl mx-auto">
              {getMorningVeilProducts()
                .filter((p) => p.handle !== handle)
                .map((p) => (
                  <Link key={p.handle} to={`/products/${p.handle}`} className="bg-cream p-6 hover:bg-ivory transition-colors group">
                    <p className="text-[10px] uppercase tracking-[2px] text-stone">{p.brand}</p>
                    <h3 className="font-display text-base mt-1 group-hover:text-gold transition-colors">{p.name}</h3>
                    <p className="text-xs text-walnut mt-1">{p.format}</p>
                    <Price amount={p.price} className="font-display text-sm mt-2 block" />
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

const JOURNEY_STEPS = [
  {numeral: 'I', name: 'Restore', desc: 'Use the PDRN Gel Mask. Begin your ceremony.'},
  {numeral: 'II', name: 'Renew', desc: 'Apply the Wrapping Mask before bed. Wake renewed.'},
  {numeral: 'III', name: 'Calm', desc: 'The Heartleaf sheet mask. Let redness fade.'},
  {numeral: 'IV', name: 'Refine', desc: 'The Tingle-Pore mask. Reveal glass skin.'},
  {numeral: 'V', name: 'Soothe', desc: 'The Centella sleeping pack. Wake renewed.'},
];

function BundlePage({product}: {product: Product}) {
  const [qty, setBundleQty] = useState(1);
  const {addItem} = useCart();
  const includedProducts = (product.bundleIncludes ?? [])
    .map((h) => getProductByHandle(h))
    .filter(Boolean) as Product[];
  const totalIndividual = includedProducts.reduce((s, p) => s + p.price, 0);

  const handleAdd = () => {
    addItem(
      {
        id: `product-${product.handle}`,
        handle: product.handle,
        title: product.name,
        vendor: product.brand,
        featuredImage: null,
        priceRange: {minVariantPrice: {amount: product.price.toFixed(2), currencyCode: product.currency}},
      },
      qty,
    );
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-ink text-cream py-20 px-6 text-center">
        <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">The Complete Ritual</p>
        <h1 className="font-display text-[clamp(32px,5vw,56px)] mt-4 leading-snug max-w-3xl mx-auto">
          Every <em className="italic text-gold-light">mask.</em>{' '}
          Every <em className="italic text-gold-light">intention.</em>
        </h1>
        <p className="text-sm text-cream/50 mt-4 max-w-xl mx-auto leading-relaxed">
          Five curated Korean masks in one considered collection. A full ceremony for your skin.
        </p>
        {product.savings && product.savingsPercent && (
          <div className="mt-8 inline-flex items-center gap-2 border border-gold rounded-full px-6 py-2.5">
            <span className="font-display text-base text-gold">
              Save <Price amount={product.savings} className="" /> ({product.savingsPercent}% off)
            </span>
          </div>
        )}
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto" aria-label="Inside the box">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">Inside the box</p>
          <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">Five rituals, one collection</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border border-sand">
          {includedProducts.map((p, i) => (
            <div key={p.handle} className={`p-6 text-center ${i < includedProducts.length - 1 ? 'border-r border-b md:border-b lg:border-b-0 border-sand' : ''}`}>
              <div className="product-tile-bg w-full aspect-square mb-4 flex items-center justify-center relative overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={`${p.brand} ${p.name} - Maison Masque`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="font-display text-6xl select-none" style={{color: `${p.heroColor}20`}}>{p.ritualNumber}</span>
                )}
                {p.ritualNumeral && <RitualNumeral numeral={p.ritualNumeral} />}
              </div>
              <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">Ritual {p.ritualNumber}</p>
              <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">{p.brand}</p>
              <h3 className="font-display text-[15px] mt-1.5 leading-snug">{p.name}</h3>
              <Price amount={p.price} className="text-xs text-stone line-through mt-2 block" />
              {p.tags?.includes('cruelty-free') && (
                <p className="text-[9px] text-sage mt-1">PETA certified &middot; Vegan</p>
              )}
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-sm text-walnut">
          Individually: <Price amount={totalIndividual} className="line-through text-stone" />
          {' → '}Together: <Price amount={product.price} className="font-display text-lg text-ink" />
        </p>
      </section>

      {/* ── RITUAL JOURNEY ── */}
      <section className="py-20 px-6 border-t border-sand" aria-label="The Ritual Journey">
        <div className="text-center mb-12">
          <h2 className="font-display text-[clamp(24px,3vw,36px)]">Five evenings with The Complete Ritual</h2>
        </div>
        <div className="bundle-timeline max-w-5xl mx-auto">
          <div className="flex lg:flex-row flex-col items-stretch">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step.numeral} className="flex lg:flex-row flex-col items-center flex-1">
                <div className="text-center px-4 py-6 lg:py-0 flex-1">
                  <div className="font-display text-5xl text-sand">{step.numeral}</div>
                  <h3 className="font-display text-base mt-3">Evening {i + 1}: {step.name}</h3>
                  <p className="text-xs text-walnut mt-2 leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
                </div>
                {i < JOURNEY_STEPS.length - 1 && <div className="lg:w-8 lg:h-px w-px h-8 bg-gold flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PURCHASE SECTION ── */}
      <section className="py-16 px-6 border-t border-sand bg-ivory/50" aria-label="Purchase">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-display text-xl">{product.name}</h2>
          <div className="flex items-baseline justify-center gap-3 mt-3">
            <Price amount={product.compareAtPrice} className="font-display text-base text-stone line-through" />
            <Price amount={product.price} className="font-display text-3xl text-ink" />
            {product.savingsPercent && (
              <span className="text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded-sm" style={{background: '#E1F5EE', color: '#085041'}}>
                Save {product.savingsPercent}%
              </span>
            )}
          </div>
          <div className="flex items-center border border-sand h-10 w-fit mx-auto mt-6">
            <button type="button" onClick={() => setBundleQty((q) => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-ink hover:text-gold transition-colors" aria-label="Decrease quantity">&minus;</button>
            <span className="w-10 h-full flex items-center justify-center text-sm font-body border-x border-sand">{qty}</span>
            <button type="button" onClick={() => setBundleQty((q) => Math.min(10, q + 1))} className="w-10 h-full flex items-center justify-center text-ink hover:text-gold transition-colors" aria-label="Increase quantity">+</button>
          </div>
          <button
            type="button" onClick={handleAdd}
            className="w-full h-[52px] mt-6 bg-gold text-ink font-display text-[13px] uppercase tracking-[3px] hover:brightness-110 transition-all duration-300"
            aria-label={`Add ${qty} Complete Ritual to bag`}
          >
            Begin the complete ritual
          </button>
          <Link to="/#rituals" className="inline-block mt-4 text-xs text-gold uppercase tracking-[3px] hover:text-ink transition-colors">
            Or explore individual rituals &rarr;
          </Link>
        </div>
      </section>

      {/* ── ELIXIR CROSS-SELL ── */}
      <ElixirCrossSell />

      {/* ── MORNING VEIL CROSS-SELL ── */}
      <MorningVeilCrossSell />
    </div>
  );
}
