export interface Product {
  handle: string;
  ritualNumber: string | null;
  ritualNumeral?: string;
  ritualName: string;
  brand: string;
  name: string;
  subtitle: string;
  price: number;
  compareAtPrice: number;
  currency: string;
  description: string;
  keyIngredient: string | null;
  howToUse: string | null;
  format: string;
  concern: string;
  skinType: string;
  heroColor: string;
  image: string;
  collection: 'ritual' | 'morning-veil' | 'elixir' | 'bundle';
  tags?: string[];
  socialProof?: string;
  bundleIncludes?: string[];
  savings?: number;
  savingsPercent?: number;
}

export const products: Product[] = [
  {
    handle: 'medicube-pdrn-gel-mask',
    ritualNumber: 'I',
    ritualNumeral: 'I',
    ritualName: 'Restore',
    brand: 'Medicube',
    name: 'PDRN Pink Collagen Gel Mask',
    subtitle: '4 sheets per box',
    price: 22.0,
    compareAtPrice: 28.0,
    currency: 'USD',
    description:
      'A colour-changing hydrogel infused with salmon PDRN and low-molecular collagen. Apply as pink, remove when transparent — your skin has absorbed every drop.',
    keyIngredient: 'Salmon PDRN + Hydrolysed Collagen + Niacinamide',
    howToUse:
      'Overnight: apply at the end of your skincare routine, leave on overnight, remove in the morning. Daytime: apply after toner and serum, leave on 3–4 hours or until the mask turns transparent.',
    format: 'Hydrogel',
    concern: 'Elasticity & Firming',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/ritual-1-restore.jpg',
    collection: 'ritual',
    tags: ['ritual', 'hydrogel', 'pdrn', 'collagen', 'medicube'],
    socialProof: '+51.45% skin radiance · +71.77% surface hydration · KFDA dual-functional cosmetic',
  },
  {
    handle: 'medicube-wrapping-mask',
    ritualNumber: 'II',
    ritualNumeral: 'II',
    ritualName: 'Renew',
    brand: 'Medicube',
    name: 'Collagen Night Wrapping Mask',
    subtitle: '75ml tube — approximately 15 uses',
    price: 26.0,
    compareAtPrice: 32.0,
    currency: 'USD',
    description:
      'Apply as a clear gel. It dries to a weightless film that wraps your skin in collagen while you sleep. Peel away in the morning to reveal plumper, firmer skin.',
    keyIngredient: 'Hydrolysed Collagen + Ceramide NP + Adenosine',
    howToUse:
      'After cleansing and toning, apply an even layer over face avoiding eyebrows, hairline, eyes and lips. Let dry ~15 minutes, then sleep. In the morning, peel from the edges or rinse with lukewarm water. Use 3–4 times per week.',
    format: 'Wrapping Mask',
    concern: 'Anti-aging & Elasticity',
    skinType: 'All skin types, especially mature',
    heroColor: '#D4BA7A',
    image: '/images/products/ritual-2-renew.jpg',
    collection: 'ritual',
    tags: ['ritual', 'wrapping-mask', 'collagen', 'overnight', 'medicube'],
    socialProof: '+31.4% skin elasticity in 2 weeks · +24.8% 24-hour moisture retention · Dermatologist-tested',
  },
  {
    handle: 'abib-heartleaf-gummy-mask',
    ritualNumber: 'III',
    ritualNumeral: 'III',
    ritualName: 'Calm',
    brand: 'Abib',
    name: 'Heartleaf Gummy Sheet Mask',
    subtitle: '10 sheets per pack \u00b7 27ml per sheet',
    price: 28.0,
    compareAtPrice: 40.0,
    currency: 'USD',
    description:
      'A high-adhesion microfibre sheet steeped in heartleaf extract and Abib\u2019s Micro TECA cica complex. The gummy-textured sheet clings to every curve of the face, while liposome-encapsulated actives deliver a fresh, non-sticky, long-lasting calm. Redness fades. Irritation quietens. Stillness returns.',
    keyIngredient: 'Heartleaf (Houttuynia Cordata) + Micro TECA Cica Complex + Microfibre Gummy Sheet',
    howToUse:
      'After cleansing and toning, apply the gummy sheet to the face avoiding eye and lip areas. Smooth outward, pressing the microfibre into the skin. Leave for 15\u201320 minutes. Remove and pat the remaining ampoule essence into the skin. Use twice a week or as needed.',
    format: 'Gummy Sheet Mask',
    concern: 'Calming & Soothing',
    skinType: 'Sensitive, irritated, redness-prone, acne-prone',
    heroColor: '#8FA68E',
    image: '/images/products/ritual-3-calm.jpg',
    collection: 'ritual',
    tags: ['ritual', 'sheet-mask', 'heartleaf', 'cica', 'calming', 'abib'],
    socialProof: 'Micro TECA cica complex (liposome-encapsulated) \u00b7 High-adhesion microfibre sheet \u00b7 Ampoule-type essence',
  },
  {
    handle: 'numbuzin-no3-pore-mask',
    ritualNumber: 'IV',
    ritualNumeral: 'IV',
    ritualName: 'Refine',
    brand: 'Numbuzin',
    name: 'No.3 Tingle-Pore Softening Sheet Mask',
    subtitle: '5 sheets per box',
    price: 22.0,
    compareAtPrice: 28.0,
    currency: 'USD',
    description:
      'The glass skin ritual. A tingling, pore-softening sheet mask that refines texture, tightens pores, and reveals the luminous, poreless finish that defines Korean skincare.',
    keyIngredient: 'AHA/BHA/PHA + Centella Asiatica',
    howToUse:
      'After cleansing, apply mask to face avoiding eyes and lips. A gentle tingle is normal \u2014 this means the acids are working. Leave for 15\u201320 minutes. Remove and pat remaining essence into skin. Use 2\u20133 times per week.',
    format: 'Sheet Mask',
    concern: 'Pore Care & Glass Skin',
    skinType: 'Oily, combination, textured',
    heroColor: '#D4BA7A',
    tags: ['ritual', 'sheet-mask', 'pore-care', 'glass-skin', 'numbuzin'],
    socialProof: '42% Bifida Ferment Lysate · 21% Galactomyces Ferment Filtrate · Low-irritation tested',
    image: '/images/products/ritual-4-illuminate.jpg',
    collection: 'ritual',
  },
  {
    handle: 'skin1004-centella-sleeping-pack',
    ritualNumber: 'V',
    ritualNumeral: 'V',
    ritualName: 'Soothe',
    brand: 'SKIN1004',
    name: 'Madagascar Centella Hyalu-Cica Sleeping Pack',
    subtitle: '100ml',
    price: 20.0,
    compareAtPrice: 26.0,
    currency: 'USD',
    description:
      'An overnight ceremony of repair. Madagascar-sourced Centella Asiatica and hyaluronic acid work through the night to calm, hydrate, and rebuild \u2014 so you wake to skin that feels renewed.',
    keyIngredient: 'Madagascar Centella Asiatica + Hyaluronic Acid + Cica',
    howToUse:
      'As the final step of your evening ritual, apply a generous layer over face. Sleep. Rinse off in the morning. Use nightly or 2\u20133 times per week for best results.',
    format: 'Sleeping Pack',
    concern: 'Overnight Repair & Hydration',
    skinType: 'All skin types, especially sensitive',
    heroColor: '#8FA68E',
    image: '/images/products/ritual-5-soothe.png',
    collection: 'ritual',
    tags: ['ritual', 'sleeping-pack', 'overnight', 'centella', 'skin1004'],
    socialProof: '40.9% Madagascar Centella Asiatica · Triple hyaluronic acid complex · Melatonin',
  },
  {
    handle: 'the-complete-ritual',
    ritualNumber: null,
    ritualName: 'The Complete Ritual',
    brand: 'Maison Masque',
    name: 'The Complete Ritual',
    subtitle: 'All 5 masks + 2 elixirs + 1 Morning Veil',
    price: 129.0,
    compareAtPrice: 183.0,
    currency: 'USD',
    description:
      'All five masks, two elixirs of your choosing, and one Morning Veil. The deepest commitment, the deepest reward \u2014 the full day, day and night.',
    keyIngredient: null,
    howToUse: null,
    format: 'Bundle',
    concern: 'Complete skincare ceremony',
    skinType: 'All skin types',
    heroColor: '#C5A55A',
    image: '/images/products/complete-ritual.jpg',
    collection: 'bundle',
    bundleIncludes: [
      'medicube-pdrn-gel-mask',
      'medicube-wrapping-mask',
      'abib-heartleaf-gummy-mask',
      'numbuzin-no3-pore-mask',
      'skin1004-centella-sleeping-pack',
    ],
    savings: 39.0,
    savingsPercent: 23,
  },
  {
    handle: 'beauty-of-joseon-relief-sun',
    ritualNumber: null,
    ritualName: 'The Morning Veil',
    brand: 'Beauty of Joseon',
    name: 'Relief Sun',
    subtitle: '50ml',
    price: 22.0,
    compareAtPrice: 28.0,
    currency: 'USD',
    description:
      'A weightless sun shield that melts into skin like a serum. Rice extract brightens while probiotics strengthen your skin\u2019s natural barrier. The final step before you face the world.',
    keyIngredient: 'Rice Extract + Probiotics + Chemical UV Filters (SPF50+ PA++++)',
    howToUse:
      'Apply generously as the last step of your morning skincare routine, after moisturiser. Reapply every 2 hours during prolonged sun exposure. Allow to absorb for 2\u20133 minutes before makeup.',
    format: 'Sunscreen',
    concern: 'UV Protection & Brightening',
    skinType: 'All skin types',
    heroColor: '#F5E6D0',
    image: '/images/products/morning-veil-relief-sun.jpg',
    collection: 'morning-veil',
    tags: ['morning-veil', 'sunscreen', 'spf', 'beauty-of-joseon'],
    socialProof: 'SPF lab-verified at 52.5 (Korea) and 63.1 (Spain) · 30% Rice Extract · EWG-certified ingredients',
  },
  {
    handle: 'heimish-artless-glow-tinted-sunscreen',
    ritualNumber: null,
    ritualName: 'The Morning Veil',
    brand: 'Heimish',
    name: 'Artless Glow Base',
    subtitle: '40ml \u2014 pearlescent glow primer with SPF',
    price: 18.0,
    compareAtPrice: 24.0,
    currency: 'USD',
    description:
      'A luminous makeup base with built-in sun protection. Natural pearl delivers a soft, dewy glow while rosehip, marjoram, thyme and peppermint botanicals keep the skin comfortable. Broad-spectrum chemical filters provide SPF50+ PA++++ protection \u2014 the first step before makeup, the last step of your morning ritual.',
    keyIngredient: 'Pearl complex (Mica + Synthetic Fluorphlogopite) + Rosehip + Thyme + Chemical UV Filters (SPF50+ PA++++)',
    howToUse:
      'Apply evenly over face as the final step of your morning routine, after moisturiser and before makeup. Use alone for a natural pearl finish or as a priming base for foundation. Reapply every 2 hours during prolonged sun exposure.',
    format: 'Glow Base / Sunscreen',
    concern: 'UV Protection & Luminous Finish',
    skinType: 'All skin types',
    heroColor: '#E8D5C4',
    image: '/images/products/morning-veil-artless-glow.jpg',
    collection: 'morning-veil',
    tags: ['morning-veil', 'sunscreen', 'spf', 'glow-primer', 'heimish'],
    socialProof: 'SPF50+ PA++++ (4 chemical filters) · Low-irritation tested · Pearlescent glow finish',
  },
  {
    handle: 'medicube-pdrn-peptide-serum',
    ritualNumber: null,
    ritualName: 'Elixir I \u2014 Regenerate',
    brand: 'Medicube',
    name: 'Elixir I \u2014 Regenerate',
    subtitle: '30ml',
    price: 24.0,
    compareAtPrice: 32.0,
    currency: 'USD',
    description:
      'A lightweight elixir that delivers clinic-grade PDRN deep into the skin. Salmon-derived DNA fragments stimulate your skin\u2019s natural repair, while a five-peptide complex, niacinamide and adenosine work to firm, brighten and smooth. Also available in a vegan Rose PDRN variant.',
    keyIngredient: 'Salmon PDRN (or Rose PDRN vegan) + 5-Peptide Complex + Niacinamide + Adenosine',
    howToUse:
      'Apply morning and night on clean, dry skin. Spread evenly over face and neck with gentle patting. Follow with moisturiser, and sunscreen during daytime.',
    format: 'Elixir',
    concern: 'Regeneration & Firming',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/elixir-1-regenerate.jpg',
    collection: 'elixir',
    tags: ['elixir', 'pdrn', 'serum', 'medicube'],
    socialProof: 'Visible improvements in 2 weeks · KFDA dual-functional cosmetic · Dermatologist-tested',
  },
  {
    handle: 'celdyque-pdrn-egf-serum',
    ritualNumber: null,
    ritualName: 'Elixir II \u2014 Fortify',
    brand: 'CELDYQUE',
    name: 'Elixir II \u2014 Fortify',
    subtitle: '30ml',
    price: 20.0,
    compareAtPrice: 26.0,
    currency: 'USD',
    description:
      'Our most potent elixir. At 120,000 ppm PDRN \u2014 a 12% concentration \u2014 this microneedling-grade serum pairs salmon DNA fragments with EGF, Volufiline\u2122 and a multi-peptide complex for intensive regeneration. Liposome encapsulation technology carries the actives deeper without irritation.',
    keyIngredient: '12% PDRN Complex (120,000 ppm) + EGF + Volufiline\u2122 + Multi-Peptides + Niacinamide 2%',
    howToUse:
      'Prep: cleanse and tone, ensure skin is dry. Apply 2\u20133 drops to face and neck, gently massage until fully absorbed. Excellent after microneedling or laser treatments to speed up recovery. Use morning and night; always follow with moisturiser.',
    format: 'Elixir',
    concern: 'Intensive Regeneration',
    skinType: 'All skin types',
    heroColor: '#D4BA7A',
    image: '/images/products/elixir-2-fortify.jpg',
    collection: 'elixir',
    tags: ['elixir', 'pdrn', 'serum', 'egf', 'volufiline', 'celdyque'],
    socialProof: '120,000 ppm PDRN complex · Volufiline™ + EGF + Multi-Peptides · Made in Korea',
  },
  {
    handle: 'medicube-pdrn-milky-toner',
    ritualNumber: null,
    ritualName: 'Elixir III \u2014 Illuminate',
    brand: 'Medicube',
    name: 'Elixir III \u2014 Illuminate',
    subtitle: '150ml',
    price: 22.0,
    compareAtPrice: 28.0,
    currency: 'USD',
    description:
      'The daily PDRN ritual your skin drinks in. A milky, lightweight toner that delivers salmon-derived PDRN and niacinamide in a generous 150ml format \u2014 the foundation of every morning and evening practice.',
    keyIngredient: 'PDRN + Niacinamide + Ceramides',
    howToUse:
      'Dispense a generous amount onto clean hands or a cotton pad. Pat gently into skin after cleansing, before serums or moisturiser. Use morning and evening. The milky texture absorbs in seconds \u2014 don\u2019t be shy with the amount. At 150ml, this elixir is designed for daily generosity.',
    format: 'Elixir',
    concern: 'Brightening & PDRN Prep',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/elixir-3-illuminate.jpg',
    collection: 'elixir',
    tags: ['elixir', 'pdrn', 'toner', 'niacinamide', 'medicube', 'brightening'],
    socialProof: '+48.3% hydration in 2 weeks (Global Institute of Dermatological Sciences) · Non-comedogenic tested',
  },
  // ── UNLISTED PRODUCTS ─────────────────────────────────────────────────
  // Reachable via direct URL only — filtered out of getElixirProducts(),
  // collection pages, cross-sells, and navigation via the 'unlisted' tag.
  // Remove the 'unlisted' tag to surface them in the main catalogue.
  // NOTE: Rejuran Turnover Ampoule removed — cannot source from AWB.
  {
    handle: 'anua-pdrn-ha-cream',
    ritualNumber: null,
    ritualName: 'The Cream',
    brand: 'Anua',
    name: 'PDRN Hyaluronic Acid 100 Moisturizing Cream',
    subtitle: '60ml \u00b7 Low-molecular PDRN + 10-type hyaluronic acid complex + collagen',
    price: 19.0,
    compareAtPrice: 25.0,
    currency: 'USD',
    description:
      'A glow-boosting hydration formula. Low-molecular PDRN derived from salmon DNA revives the skin from within, while ten molecular weights of hyaluronic acid replenish moisture at every depth and low-molecular collagen strengthens the structure. Fast-absorbing, non-sticky, and finished with a silky glass-skin veil. The first cream in the Maison Masque catalogue.',
    keyIngredient: 'Low-Molecular PDRN (Salmon DNA) + 10 Types of Hyaluronic Acid + Low-Molecular Collagen',
    howToUse:
      'Suitable for daily AM and PM use. Apply as the final step of your skincare routine, massaging gently into face and neck until absorbed. Free from artificial colorants and fragrance.',
    format: 'Moisturiser',
    concern: 'Regeneration & Deep Hydration',
    skinType: 'All skin types, especially normal to dry',
    heroColor: '#D4C4B0',
    image: '/images/products/anua-pdrn-ha-cream.png',
    collection: 'elixir',
    tags: ['cream', 'moisturiser', 'pdrn', 'hyaluronic-acid', 'collagen', 'anua', 'unlisted'],
    socialProof: 'Collagen +68.3% \u00b7 Moisture plumping +10.79% \u00b7 100-hour dermal hydration (Anua clinical test) \u00b7 4.8\u2605 / 54 reviews',
  },
];

/**
 * True if the product carries the 'unlisted' tag — unlisted products are
 * reachable via direct URL only. They're filtered out of collection pages,
 * cross-sells, navigation, and bundles. Used for products that have been
 * added to the database but not yet wired into the main catalogue.
 */
function isUnlisted(p: Product): boolean {
  return p.tags?.includes('unlisted') ?? false;
}

export function getProductByHandle(handle: string): Product | null {
  // Unlisted products ARE findable by direct handle — their PDPs still render.
  return products.find((p) => p.handle === handle) ?? null;
}

export function getRitualProducts(): Product[] {
  return products.filter((p) => p.collection === 'ritual' && !isUnlisted(p));
}

export function getMorningVeilProducts(): Product[] {
  return products.filter((p) => p.collection === 'morning-veil' && !isUnlisted(p));
}

export function getElixirProducts(): Product[] {
  return products.filter((p) => p.collection === 'elixir' && !isUnlisted(p));
}

export function getProductsByCollection(collection: Product['collection']): Product[] {
  return products.filter((p) => p.collection === collection && !isUnlisted(p));
}
