import {getProductMedia, hasBrandMedia} from '~/lib/productMedia';
import {type Product} from '~/lib/products';
import {SectionLabel} from '~/components/shared/SectionLabel';

interface ProductBrandStoryProps {
  product: Product;
}

/**
 * Rich brand-asset story section for individual product detail pages.
 * Composes the available marketing imagery from `productMedia.ts` into
 * editorial blocks — hero gallery, ingredient infographics, clinical stats,
 * texture/swatch moments, how-to-use diagrams, and heritage imagery.
 *
 * Renders nothing if the product has no brand media on disk.
 */
export function ProductBrandStory({product}: ProductBrandStoryProps) {
  if (!hasBrandMedia(product.handle)) return null;
  const media = getProductMedia(product.handle);
  if (!media) return null;

  const alt = (role: string, i: number) =>
    `${product.brand} ${product.name} ${role} ${i + 1} - Maison Masque`;

  return (
    <div className="border-t border-sand">
      {/* ── HERO GALLERY (non-primary alternates) ───────────────────── */}
      {media.hero.length > 1 && (
        <section className="py-20 px-6 max-w-7xl mx-auto" aria-label="Product gallery">
          <div className="text-center mb-12">
            <SectionLabel>The product</SectionLabel>
            <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
              Every angle of the {product.brand.toLowerCase()} original
            </h2>
            <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.hero.map((src, i) => (
              <figure
                key={src}
                className="product-tile-bg aspect-square overflow-hidden relative"
              >
                <img
                  src={src}
                  alt={alt('packshot', i)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── INGREDIENT INFOGRAPHICS ──────────────────────────────────── */}
      {media.ingredient.length > 0 && (
        <section className="py-20 px-6 bg-ivory/40 border-t border-sand" aria-label="Key ingredients">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>What's inside</SectionLabel>
              <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
                The ingredients that make it work
              </h2>
              <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
              {product.keyIngredient && (
                <p className="text-[14px] text-walnut mt-6 leading-relaxed max-w-2xl mx-auto">
                  <span className="text-stone">Hero complex:</span> {product.keyIngredient}
                </p>
              )}
            </div>
            {/* One column if single infographic, two columns when 2+, feels spacious either way */}
            <div
              className={
                media.ingredient.length === 1
                  ? 'max-w-2xl mx-auto'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-6'
              }
            >
              {media.ingredient.map((src, i) => (
                <figure
                  key={src}
                  className="bg-cream border border-sand overflow-hidden"
                >
                  <img
                    src={src}
                    alt={alt('ingredient infographic', i)}
                    className="w-full h-auto block"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TEXTURE / SWATCH (including animated GIFs) ───────────────── */}
      {media.texture.length > 0 && (
        <section className="py-20 px-6 border-t border-sand" aria-label="Texture and application">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>The moment</SectionLabel>
              <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
                How it feels on the skin
              </h2>
              <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
            </div>
            <div
              className={
                media.texture.length === 1
                  ? 'max-w-2xl mx-auto'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-6'
              }
            >
              {media.texture.map((src, i) => {
                const isAnimated = src.endsWith('.gif');
                return (
                  <figure
                    key={src}
                    className="bg-cream border border-sand overflow-hidden aspect-square relative"
                  >
                    <img
                      src={src}
                      alt={alt(isAnimated ? 'texture demo' : 'texture swatch', i)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {isAnimated && (
                      <span
                        className="absolute bottom-3 right-3 px-2 py-1 text-[9px] uppercase tracking-[2px] font-semibold font-body"
                        style={{backgroundColor: 'rgba(26,23,20,0.7)', color: '#FAF8F3'}}
                      >
                        In motion
                      </span>
                    )}
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CLINICAL STATS ───────────────────────────────────────────── */}
      {media.clinical.length > 0 && (
        <section className="py-20 px-6 bg-ivory/40 border-t border-sand" aria-label="Clinical results">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>The proof</SectionLabel>
              <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
                Tested, measured, documented
              </h2>
              <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
              {product.socialProof && (
                <p className="text-[13px] text-walnut mt-6 max-w-2xl mx-auto">
                  {product.socialProof}
                </p>
              )}
            </div>
            <div
              className={
                media.clinical.length === 1
                  ? 'max-w-2xl mx-auto'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            >
              {media.clinical.map((src, i) => (
                <figure
                  key={src}
                  className="bg-cream border border-sand overflow-hidden"
                >
                  <img
                    src={src}
                    alt={alt('clinical trial result', i)}
                    className="w-full h-auto block"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
            <p className="text-[11px] text-stone text-center mt-8 italic">
              Results from {product.brand}&apos;s own testing. Individual results may vary.
            </p>
          </div>
        </section>
      )}

      {/* ── LIFESTYLE / MODEL ────────────────────────────────────────── */}
      {media.lifestyle.length > 0 && (
        <section className="py-20 px-6 border-t border-sand" aria-label="In practice">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>In practice</SectionLabel>
              <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
                A product in the hands that need it
              </h2>
              <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
            </div>
            <div
              className={
                media.lifestyle.length === 1
                  ? 'max-w-2xl mx-auto'
                  : media.lifestyle.length === 2
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              }
            >
              {media.lifestyle.map((src, i) => (
                <figure
                  key={src}
                  className="bg-cream aspect-square overflow-hidden"
                >
                  <img
                    src={src}
                    alt={alt('lifestyle', i)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW-TO-USE DIAGRAM ───────────────────────────────────────── */}
      {media['how-to'].length > 0 && (
        <section className="py-20 px-6 bg-ivory/40 border-t border-sand" aria-label="How to use">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>The practice</SectionLabel>
              <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
                How to use it
              </h2>
              <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
              {product.howToUse && (
                <p className="text-[14px] text-walnut mt-6 max-w-2xl mx-auto leading-relaxed">
                  {product.howToUse}
                </p>
              )}
            </div>
            <div className="space-y-6">
              {media['how-to'].map((src, i) => (
                <figure key={src} className="bg-cream border border-sand overflow-hidden">
                  <img
                    src={src}
                    alt={alt('how to use step', i)}
                    className="w-full h-auto block"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HERITAGE STORY ───────────────────────────────────────────── */}
      {media.heritage.length > 0 && (
        <section className="py-20 px-6 border-t border-sand" aria-label="Heritage and sourcing">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>The origin</SectionLabel>
              <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-3">
                Where it comes from
              </h2>
              <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
            </div>
            <div
              className={
                media.heritage.length === 1
                  ? 'max-w-3xl mx-auto'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-6'
              }
            >
              {media.heritage.map((src, i) => (
                <figure
                  key={src}
                  className="bg-cream border border-sand overflow-hidden"
                >
                  <img
                    src={src}
                    alt={alt('heritage', i)}
                    className="w-full h-auto block"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
