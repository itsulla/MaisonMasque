import {Link} from '@remix-run/react';
import {useState} from 'react';
import {getProductByHandle, type Product} from '~/lib/products';
import {useCart} from '~/lib/cartContext';
import {Price, PriceWithCompare} from '~/components/shared/Price';

interface ProductPageProps {
  handle: string;
}

export function ProductPage({handle}: ProductPageProps) {
  const product = getProductByHandle(handle);
  const {addItem} = useCart();
  const [qty, setQty] = useState(1);
  const [howToOpen, setHowToOpen] = useState(false);

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

  // Bundle gets a different layout (future Prompt 3)
  if (handle === 'the-complete-ritual') {
    return <BundlePage product={product} />;
  }

  const savings = product.compareAtPrice - product.price;
  const hasSavings = savings > 0;

  const handleAddToCart = () => {
    addItem(
      {
        id: `product-${product.handle}`,
        handle: product.handle,
        title: product.name,
        vendor: product.brand,
        featuredImage: null,
        priceRange: {
          minVariantPrice: {
            amount: product.price.toFixed(2),
            currencyCode: product.currency,
          },
        },
      },
      qty,
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-0 lg:gap-12 max-w-7xl mx-auto py-8 lg:py-16 px-6">
      {/* LEFT — Image */}
      <div className="pdp-image-wrap overflow-hidden bg-cream p-10 flex items-center justify-center mb-8 lg:mb-0">
        {product.image ? (
          <img
            src={product.image}
            alt={`${product.brand} ${product.name} - Korean Sheet Mask - Maison Masque`}
            className="w-full h-auto object-contain transition-transform duration-[600ms] ease-out hover:scale-[1.02]"
            loading="eager"
            decoding="async"
            onError={(e) => {
              // Fallback to gradient placeholder on image load error
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) parent.classList.add('pdp-placeholder-active');
            }}
          />
        ) : null}
        {/* Gradient placeholder (shown when no image or image fails to load) */}
        <div
          className="pdp-placeholder w-full aspect-square flex items-center justify-center relative"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${product.heroColor}18 0%, #FAF8F3 70%)`,
          }}
        >
          <span
            className="font-display text-[120px] select-none absolute inset-0 flex items-center justify-center"
            style={{color: `${product.heroColor}14`}}
          >
            {product.ritualNumber ?? ''}
          </span>
        </div>
      </div>

      {/* RIGHT — Details */}
      <div className="flex flex-col">
        {/* Breadcrumb */}
        <nav className="text-xs text-stone" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/collections/the-five-rituals" className="hover:text-gold transition-colors">
            The Five Rituals
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-walnut">{product.name}</span>
        </nav>

        {/* Ritual badge */}
        {product.ritualNumber && (
          <p className="text-[11px] uppercase tracking-[3px] text-gold font-semibold mt-6 flex items-center gap-2">
            <span className="text-[8px]">&#9670;</span>
            Ritual {product.ritualNumber} &mdash; {product.ritualName}
          </p>
        )}

        {/* Brand */}
        <p className="text-[11px] uppercase tracking-[2px] text-stone mt-3">
          {product.brand}
        </p>

        {/* Product name */}
        <h1 className="font-display text-[28px] text-ink mt-2 leading-snug">
          {product.name}
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] text-stone italic mt-1">
          {product.subtitle}
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
              How to use
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[product.format, product.concern, product.skinType].map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-stone border border-sand rounded-full px-3 py-1.5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Quantity selector */}
        <div className="flex items-center border border-sand h-10 w-fit mt-8">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-full flex items-center justify-center text-ink hover:text-gold transition-colors"
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span className="w-10 h-full flex items-center justify-center text-sm font-body border-x border-sand">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="w-10 h-full flex items-center justify-center text-ink hover:text-gold transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to ritual */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full h-[52px] mt-4 bg-ink text-cream font-display text-[13px] uppercase tracking-[3px] hover:bg-espresso transition-colors duration-300"
          aria-label={`Add ${qty} ${product.name} to bag`}
        >
          Add to ritual
        </button>

        {/* Trust row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
          {['Authentic Korean', 'Ships from Hong Kong', '30-day returns'].map(
            (badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-xs text-walnut">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C5A55A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {badge}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

const JOURNEY_STEPS = [
  {numeral: 'I', name: 'Restore', desc: 'Use the PDRN Gel Mask. Begin your ceremony.'},
  {numeral: 'II', name: 'Renew', desc: 'Apply the Wrapping Mask before bed. Wake renewed.'},
  {numeral: 'III', name: 'Calm', desc: 'The Heartleaf sheet mask. Let redness fade.'},
  {numeral: 'IV', name: 'Illuminate', desc: 'The Vita Coating mask. Find your glow.'},
  {numeral: 'V', name: 'Soothe', desc: 'Seal everything with the Cica Sleeping Mask.'},
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
        priceRange: {
          minVariantPrice: {
            amount: product.price.toFixed(2),
            currencyCode: product.currency,
          },
        },
      },
      qty,
    );
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-ink text-cream py-20 px-6 text-center">
        <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
          The Complete Ritual
        </p>
        <h1 className="font-display text-[clamp(32px,5vw,56px)] mt-4 leading-snug max-w-3xl mx-auto">
          Every <em className="italic text-gold-light">mask.</em>{' '}
          Every <em className="italic text-gold-light">intention.</em>
        </h1>
        <p className="text-sm text-cream/50 mt-4 max-w-xl mx-auto leading-relaxed">
          Five curated Korean masks in one considered collection. A full ceremony
          for your skin.
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
          <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
            Inside the box
          </p>
          <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
            Five rituals, one collection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border border-sand">
          {includedProducts.map((p, i) => (
            <div
              key={p.handle}
              className={`p-6 text-center ${i < includedProducts.length - 1 ? 'border-r border-b md:border-b lg:border-b-0 border-sand' : ''}`}
            >
              {/* Placeholder image area */}
              <div
                className="w-full aspect-square mb-4 flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${p.heroColor}18 0%, #FAF8F3 70%)`,
                }}
              >
                <span
                  className="font-display text-6xl select-none"
                  style={{color: `${p.heroColor}20`}}
                >
                  {p.ritualNumber}
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
                Ritual {p.ritualNumber}
              </p>
              <p className="text-[10px] uppercase tracking-[2px] text-stone mt-1">
                {p.brand}
              </p>
              <h3 className="font-display text-[15px] mt-1.5 leading-snug">
                {p.name}
              </h3>
              <Price amount={p.price} className="text-xs text-stone line-through mt-2 block" />
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <p className="text-center mt-8 text-sm text-walnut">
          Individually:{' '}
          <Price amount={totalIndividual} className="line-through text-stone" />
          {' → '}Together:{' '}
          <Price amount={product.price} className="font-display text-lg text-ink" />
        </p>
      </section>

      {/* ── RITUAL JOURNEY ── */}
      <section className="py-20 px-6 border-t border-sand" aria-label="The Ritual Journey">
        <div className="text-center mb-12">
          <h2 className="font-display text-[clamp(24px,3vw,36px)]">
            Five evenings with The Complete Ritual
          </h2>
        </div>

        {/* Desktop: horizontal scroll timeline */}
        <div className="bundle-timeline max-w-5xl mx-auto">
          <div className="flex lg:flex-row flex-col items-stretch">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step.numeral} className="flex lg:flex-row flex-col items-center flex-1">
                {/* Step content */}
                <div className="text-center px-4 py-6 lg:py-0 flex-1">
                  <div className="font-display text-5xl text-sand">
                    {step.numeral}
                  </div>
                  <h3 className="font-display text-base mt-3">
                    Evening {i + 1}: {step.name}
                  </h3>
                  <p className="text-xs text-walnut mt-2 leading-relaxed max-w-[180px] mx-auto">
                    {step.desc}
                  </p>
                </div>
                {/* Connector line (not after last) */}
                {i < JOURNEY_STEPS.length - 1 && (
                  <div className="lg:w-8 lg:h-px w-px h-8 bg-gold flex-shrink-0" />
                )}
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
              <span
                className="text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded-sm"
                style={{background: '#E1F5EE', color: '#085041'}}
              >
                Save {product.savingsPercent}%
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center border border-sand h-10 w-fit mx-auto mt-6">
            <button
              type="button"
              onClick={() => setBundleQty((q) => Math.max(1, q - 1))}
              className="w-10 h-full flex items-center justify-center text-ink hover:text-gold transition-colors"
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className="w-10 h-full flex items-center justify-center text-sm font-body border-x border-sand">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setBundleQty((q) => Math.min(10, q + 1))}
              className="w-10 h-full flex items-center justify-center text-ink hover:text-gold transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Gold CTA — the only gold bg button on the site */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full h-[52px] mt-6 bg-gold text-ink font-display text-[13px] uppercase tracking-[3px] hover:brightness-110 transition-all duration-300"
            aria-label={`Add ${qty} Complete Ritual to bag`}
          >
            Begin the complete ritual
          </button>

          <Link
            to="/#rituals"
            className="inline-block mt-4 text-xs text-gold uppercase tracking-[3px] hover:text-ink transition-colors"
          >
            Or explore individual rituals &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
