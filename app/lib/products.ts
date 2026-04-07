export interface Product {
  handle: string;
  ritualNumber: string | null;
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
    ritualName: 'Restore',
    brand: 'Medicube',
    name: 'PDRN Pink Collagen Gel Mask',
    subtitle: '4 sheets per box',
    price: 22.0,
    compareAtPrice: 28.0,
    currency: 'USD',
    description:
      'A colour-changing hydrogel infused with salmon PDRN and low-molecular collagen. Apply as pink, remove when transparent — your skin has absorbed every drop.',
    keyIngredient: 'Salmon PDRN + Hydrolysed Collagen',
    howToUse:
      'Apply after toner. Leave for 1-3 hours or overnight. Remove when the mask turns transparent. Pat remaining essence into skin.',
    format: 'Hydrogel',
    concern: 'Elasticity & Firming',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/ritual-1-restore.jpg',
    collection: 'ritual',
  },
  {
    handle: 'medicube-wrapping-mask',
    ritualNumber: 'II',
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
      'Apply an even layer over face after your evening skincare routine, avoiding eyes and lips. Let dry 15 minutes. Sleep. Peel off gently in the morning and rinse.',
    format: 'Wrapping Mask',
    concern: 'Anti-aging & Elasticity',
    skinType: 'All skin types, especially mature',
    heroColor: '#D4BA7A',
    image: '/images/products/ritual-2-renew.jpg',
    collection: 'ritual',
  },
  {
    handle: 'anua-heartleaf-mask',
    ritualNumber: 'III',
    ritualName: 'Calm',
    brand: 'Anua',
    name: 'Heartleaf 77% Soothing Sheet Mask',
    subtitle: '10 sheets per pack',
    price: 38.0,
    compareAtPrice: 45.0,
    currency: 'USD',
    description:
      'Seventy-seven percent heartleaf extract in every sheet. A cool, calming veil for skin that needs to exhale. Redness fades. Irritation quietens. Stillness returns.',
    keyIngredient: '77% Heartleaf (Houttuynia Cordata) Extract',
    howToUse:
      'After cleansing and toning, unfold mask and align to eyes. Smooth outward. Leave for 15-20 minutes. Remove and pat remaining essence into skin.',
    format: 'Sheet Mask',
    concern: 'Calming & Soothing',
    skinType: 'Sensitive, irritated, redness-prone',
    heroColor: '#8FA68E',
    image: '/images/products/ritual-3-calm.jpg',
    collection: 'ritual',
  },
  {
    handle: 'numbuzin-no3-pore-mask',
    ritualNumber: 'IV',
    ritualName: 'Refine',
    brand: 'Numbuzin',
    name: 'No.3 Tingle-Pore Softening Sheet Mask',
    subtitle: '5 sheets per box',
    price: 18.0,
    compareAtPrice: 24.0,
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
    socialProof: 'Numbuzin\u2019s #1 bestseller \u00b7 Glass skin phenomenon',
    image: '/images/products/ritual-4-illuminate.jpg',
    collection: 'ritual',
  },
  {
    handle: 'skin1004-centella-sleeping-pack',
    ritualNumber: 'V',
    ritualName: 'Soothe',
    brand: 'SKIN1004',
    name: 'Madagascar Centella Hyalu-Cica Sleeping Pack',
    subtitle: '100ml',
    price: 22.0,
    compareAtPrice: 28.0,
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
    image: '/images/products/ritual-5-soothe.jpg',
    collection: 'ritual',
    tags: ['ritual', 'sleeping-pack', 'overnight', 'centella', 'skin1004', 'vegan', 'cruelty-free'],
    socialProof: '97.7% satisfaction \u00b7 PETA certified cruelty-free \u00b7 100% vegan',
  },
  {
    handle: 'the-complete-ritual',
    ritualNumber: null,
    ritualName: 'The Complete Ritual',
    brand: 'Maison Masque',
    name: 'The Complete Ritual',
    subtitle: 'All five rituals in one curated box',
    price: 99.0,
    compareAtPrice: 126.0,
    currency: 'USD',
    description:
      'Every mask. Every intention. The Complete Ritual brings together all five of our curated Korean masks \u2014 from Medicube\u2019s PDRN collagen to Anua\u2019s heartleaf calm, Numbuzin\u2019s glass-skin refiner, and SKIN1004\u2019s overnight centella repair \u2014 in one considered collection. A full ceremony for your skin.',
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
      'anua-heartleaf-mask',
      'numbuzin-no3-pore-mask',
      'skin1004-centella-sleeping-pack',
    ],
    savings: 27.0,
    savingsPercent: 21,
  },
  {
    handle: 'beauty-of-joseon-relief-sun',
    ritualNumber: null,
    ritualName: 'The Morning Veil',
    brand: 'Beauty of Joseon',
    name: 'Relief Sun',
    subtitle: '50ml',
    price: 20.0,
    compareAtPrice: 26.0,
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
    socialProof: '25,159 verified reviews \u00b7 97.7% satisfaction \u00b7 SPF50+ PA++++',
  },
  {
    handle: 'heimish-artless-glow-tinted-sunscreen',
    ritualNumber: null,
    ritualName: 'The Morning Veil',
    brand: 'Heimish',
    name: 'Artless Glow Tinted Sunscreen',
    subtitle: '40ml',
    price: 22.0,
    compareAtPrice: 28.0,
    currency: 'USD',
    description:
      'Sun protection that replaces your foundation. A skin-adapting tint that evens tone, blurs imperfections, and shields \u2014 all in one effortless step.',
    keyIngredient: 'Sunflower Seed Oil + Centella Asiatica + Chemical UV Filters (SPF50+ PA++++)',
    howToUse:
      'Apply evenly over face as the last step of your morning routine. Use alone for a natural finish or as a priming base under makeup. Reapply every 2 hours during prolonged sun exposure.',
    format: 'Tinted Sunscreen',
    concern: 'UV Protection & Tone Evening',
    skinType: 'All skin types, especially dull or uneven tone',
    heroColor: '#E8D5C4',
    image: '/images/products/morning-veil-artless-glow.jpg',
    collection: 'morning-veil',
    tags: ['morning-veil', 'sunscreen', 'spf', 'tinted', 'heimish'],
    socialProof: '93.1% satisfaction \u00b7 Tinted SPF50+ PA++++',
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
      'A lightweight elixir that delivers clinic-grade PDRN deep into the skin. Salmon-derived DNA fragments stimulate your skin\u2019s natural repair, while 13 peptides and niacinamide work to firm, brighten, and restore.',
    keyIngredient: 'Salmon PDRN + 13 Peptides + Niacinamide + Collagen',
    howToUse:
      'After cleansing and toning, dispense 2\u20133 drops onto fingertips. Press gently into skin, focusing on areas of concern. Follow with your ritual mask or moisturiser. Use morning and evening.',
    format: 'Elixir',
    concern: 'Regeneration & Firming',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/elixir-1-regenerate.jpg',
    collection: 'elixir',
    tags: ['elixir', 'pdrn', 'serum', 'medicube'],
    socialProof: '98% customer satisfaction',
  },
  {
    handle: 'celdyque-pdrn-egf-serum',
    ritualNumber: null,
    ritualName: 'Elixir II \u2014 Fortify',
    brand: 'CELDYQUE',
    name: 'Elixir II \u2014 Fortify',
    subtitle: '30ml',
    price: 18.0,
    compareAtPrice: 24.0,
    currency: 'USD',
    description:
      'Our most potent elixir. At 12% PDRN concentration \u2014 the highest we\u2019ve found \u2014 this formulation pairs salmon DNA fragments with EGF and a peptide complex for intensive skin regeneration.',
    keyIngredient: '12% PDRN + EGF (Epidermal Growth Factor) + Peptide Complex',
    howToUse:
      'After cleansing and toning, apply 2\u20133 drops to face and neck. Pat gently until absorbed. Layer under your ritual mask for amplified results. Suitable for daily use, morning and evening.',
    format: 'Elixir',
    concern: 'Intensive Regeneration',
    skinType: 'All skin types',
    heroColor: '#D4BA7A',
    image: '/images/products/elixir-2-fortify.jpg',
    collection: 'elixir',
    tags: ['elixir', 'pdrn', 'serum', 'egf', 'celdyque'],
    socialProof: '98.5% customer satisfaction \u00b7 441 verified reviews',
  },
];

export function getProductByHandle(handle: string): Product | null {
  return products.find((p) => p.handle === handle) ?? null;
}

export function getRitualProducts(): Product[] {
  return products.filter((p) => p.collection === 'ritual');
}

export function getMorningVeilProducts(): Product[] {
  return products.filter((p) => p.collection === 'morning-veil');
}

export function getElixirProducts(): Product[] {
  return products.filter((p) => p.collection === 'elixir');
}

export function getProductsByCollection(collection: Product['collection']): Product[] {
  return products.filter((p) => p.collection === collection);
}
