/**
 * Brand asset registry — per-product marketing imagery sourced directly from
 * each supplier's official CDN, mirrored into `/public/images/products/brand/`
 * by `scripts/download-brand-assets.mjs`.
 *
 * Entries here drive the rich "brand story" section on individual product
 * pages. Only list files that exist on disk — unknown assets cause SSR empty
 * <img> tags and break the fade-in pattern.
 *
 * Source of truth: BRAND_MATERIALS.md. Keep in sync when you re-run downloads.
 */

export type MediaRole =
  | 'hero'
  | 'lifestyle'
  | 'ingredient'
  | 'clinical'
  | 'texture'
  | 'how-to'
  | 'heritage';

export interface ProductMedia {
  /** Hero packshots — primary product photography on neutral backgrounds */
  hero: string[];
  /** Lifestyle / in-use photography */
  lifestyle: string[];
  /** Ingredient infographics and composition visuals */
  ingredient: string[];
  /** Clinical trial / brand self-test charts */
  clinical: string[];
  /** Texture, swatch, colour-change, and animated demo assets */
  texture: string[];
  /** How-to-use step diagrams */
  ['how-to']: string[];
  /** Brand heritage / sourcing storytelling (e.g. rice fields, Madagascar) */
  heritage: string[];
}

const empty = (): ProductMedia => ({
  hero: [],
  lifestyle: [],
  ingredient: [],
  clinical: [],
  texture: [],
  'how-to': [],
  heritage: [],
});

function p(handle: string, role: MediaRole, count: number, ext: string = 'jpg'): string[] {
  return Array.from({length: count}, (_, i) =>
    `/images/products/brand/${handle}/${role}-${String(i + 1).padStart(2, '0')}.${ext}`,
  );
}

/**
 * Hand-tuned media registry for each product handle.
 * Reflects what is actually downloaded under `/public/images/products/brand/`.
 */
export const PRODUCT_MEDIA: Record<string, ProductMedia> = {
  'medicube-pdrn-gel-mask': {
    ...empty(),
    hero: p('medicube-pdrn-gel-mask', 'hero', 3),
    lifestyle: p('medicube-pdrn-gel-mask', 'lifestyle', 3),
    ingredient: p('medicube-pdrn-gel-mask', 'ingredient', 4),
    clinical: p('medicube-pdrn-gel-mask', 'clinical', 3),
    texture: p('medicube-pdrn-gel-mask', 'texture', 2),
    'how-to': p('medicube-pdrn-gel-mask', 'how-to', 1),
  },
  'medicube-wrapping-mask': {
    ...empty(),
    hero: p('medicube-wrapping-mask', 'hero', 2),
    lifestyle: p('medicube-wrapping-mask', 'lifestyle', 3),
    ingredient: p('medicube-wrapping-mask', 'ingredient', 4),
    clinical: p('medicube-wrapping-mask', 'clinical', 3),
    // texture-01 is the animated peel-off GIF (the hero moment)
    texture: [
      '/images/products/brand/medicube-wrapping-mask/texture-01.gif',
      '/images/products/brand/medicube-wrapping-mask/texture-02.jpg',
      '/images/products/brand/medicube-wrapping-mask/texture-03.jpg',
    ],
    'how-to': p('medicube-wrapping-mask', 'how-to', 3),
  },
  'abib-heartleaf-gummy-mask': {
    ...empty(),
    hero: p('abib-heartleaf-gummy-mask', 'hero', 3),
    // Abib publishes all marketing copy inside image tiles — the 7 ST-H_* tiles
    // are mapped to ingredient by default. Re-bucket after visual review.
    ingredient: p('abib-heartleaf-gummy-mask', 'ingredient', 7),
    lifestyle: p('abib-heartleaf-gummy-mask', 'lifestyle', 6),
  },
  'numbuzin-no3-pore-mask': {
    ...empty(),
    hero: p('numbuzin-no3-pore-mask', 'hero', 2),
    lifestyle: p('numbuzin-no3-pore-mask', 'lifestyle', 1),
    ingredient: p('numbuzin-no3-pore-mask', 'ingredient', 4),
    clinical: p('numbuzin-no3-pore-mask', 'clinical', 1),
    'how-to': p('numbuzin-no3-pore-mask', 'how-to', 1),
  },
  'skin1004-centella-sleeping-pack': {
    ...empty(),
    hero: ['/images/products/brand/skin1004-centella-sleeping-pack/hero-01.png'],
    lifestyle: p('skin1004-centella-sleeping-pack', 'lifestyle', 3),
    ingredient: p('skin1004-centella-sleeping-pack', 'ingredient', 1),
    // texture-01 is the pour GIF
    texture: [
      '/images/products/brand/skin1004-centella-sleeping-pack/texture-01.gif',
      '/images/products/brand/skin1004-centella-sleeping-pack/texture-02.jpg',
    ],
    'how-to': p('skin1004-centella-sleeping-pack', 'how-to', 1),
    heritage: p('skin1004-centella-sleeping-pack', 'heritage', 1),
  },
  'beauty-of-joseon-relief-sun': {
    ...empty(),
    hero: p('beauty-of-joseon-relief-sun', 'hero', 4),
    lifestyle: p('beauty-of-joseon-relief-sun', 'lifestyle', 2),
    ingredient: p('beauty-of-joseon-relief-sun', 'ingredient', 3),
    clinical: p('beauty-of-joseon-relief-sun', 'clinical', 3),
    texture: p('beauty-of-joseon-relief-sun', 'texture', 3),
    'how-to': p('beauty-of-joseon-relief-sun', 'how-to', 2),
    heritage: p('beauty-of-joseon-relief-sun', 'heritage', 2),
  },
  'heimish-artless-glow-tinted-sunscreen': {
    ...empty(),
    hero: p('heimish-artless-glow-tinted-sunscreen', 'hero', 1),
    lifestyle: p('heimish-artless-glow-tinted-sunscreen', 'lifestyle', 7),
    ingredient: p('heimish-artless-glow-tinted-sunscreen', 'ingredient', 3),
    // Both textures are animated GIFs from the detail stack
    texture: [
      '/images/products/brand/heimish-artless-glow-tinted-sunscreen/texture-01.gif',
      '/images/products/brand/heimish-artless-glow-tinted-sunscreen/texture-02.gif',
    ],
  },
  'medicube-pdrn-peptide-serum': {
    ...empty(),
    hero: p('medicube-pdrn-peptide-serum', 'hero', 2),
    lifestyle: p('medicube-pdrn-peptide-serum', 'lifestyle', 2),
    ingredient: p('medicube-pdrn-peptide-serum', 'ingredient', 2),
    clinical: p('medicube-pdrn-peptide-serum', 'clinical', 2),
    texture: p('medicube-pdrn-peptide-serum', 'texture', 2),
    'how-to': p('medicube-pdrn-peptide-serum', 'how-to', 1),
  },
  'celdyque-pdrn-egf-serum': {
    ...empty(),
    // Only the brand-hosted packshot + one CloudFront mirror + 2 ingredient slides
    hero: [
      '/images/products/brand/celdyque-pdrn-egf-serum/hero-01.webp',
      '/images/products/brand/celdyque-pdrn-egf-serum/hero-02.jpg',
    ],
    ingredient: p('celdyque-pdrn-egf-serum', 'ingredient', 2),
  },
  'anua-pdrn-ha-cream': {
    ...empty(),
    hero: [
      '/images/products/brand/anua-pdrn-ha-cream/hero-01.png',
      '/images/products/brand/anua-pdrn-ha-cream/hero-02.jpg',
      '/images/products/brand/anua-pdrn-ha-cream/hero-03.jpg',
      '/images/products/brand/anua-pdrn-ha-cream/hero-04.jpg',
    ],
    lifestyle: p('anua-pdrn-ha-cream', 'lifestyle', 6),
    ingredient: [
      '/images/products/brand/anua-pdrn-ha-cream/ingredient-01.png',
      '/images/products/brand/anua-pdrn-ha-cream/ingredient-02.png',
      '/images/products/brand/anua-pdrn-ha-cream/ingredient-03.png',
    ],
    texture: [
      '/images/products/brand/anua-pdrn-ha-cream/texture-01.png',
      '/images/products/brand/anua-pdrn-ha-cream/texture-02.png',
      '/images/products/brand/anua-pdrn-ha-cream/texture-03.png',
    ],
    heritage: [
      '/images/products/brand/anua-pdrn-ha-cream/heritage-01.jpg',
      '/images/products/brand/anua-pdrn-ha-cream/heritage-02.jpg',
      '/images/products/brand/anua-pdrn-ha-cream/heritage-03.jpg',
      '/images/products/brand/anua-pdrn-ha-cream/heritage-04.png',
    ],
  },
  // Rejuran Turnover Ampoule removed — cannot source from AWB.
  'medicube-pdrn-milky-toner': {
    ...empty(),
    hero: p('medicube-pdrn-milky-toner', 'hero', 2),
    lifestyle: p('medicube-pdrn-milky-toner', 'lifestyle', 2),
    ingredient: p('medicube-pdrn-milky-toner', 'ingredient', 2),
    clinical: p('medicube-pdrn-milky-toner', 'clinical', 2),
    texture: p('medicube-pdrn-milky-toner', 'texture', 2),
    'how-to': p('medicube-pdrn-milky-toner', 'how-to', 1),
  },
};

export function getProductMedia(handle: string): ProductMedia | null {
  return PRODUCT_MEDIA[handle] ?? null;
}

/**
 * True if the product has at least one brand asset of any role —
 * lets PDPs skip the brand-story section cleanly when nothing is available.
 */
export function hasBrandMedia(handle: string): boolean {
  const m = PRODUCT_MEDIA[handle];
  if (!m) return false;
  return (
    m.hero.length > 0 ||
    m.lifestyle.length > 0 ||
    m.ingredient.length > 0 ||
    m.clinical.length > 0 ||
    m.texture.length > 0 ||
    m['how-to'].length > 0 ||
    m.heritage.length > 0
  );
}
