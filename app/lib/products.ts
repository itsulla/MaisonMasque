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
  },
  {
    handle: 'medicube-vita-coating-mask',
    ritualNumber: 'IV',
    ritualName: 'Illuminate',
    brand: 'Medicube',
    name: 'PDRN Pink Vita Coating Mask',
    subtitle: '10 sheets per pack',
    price: 32.0,
    compareAtPrice: 38.0,
    currency: 'USD',
    description:
      'Salmon PDRN meets vitamin radiance in a coating mask that seals brightness into skin. Each sheet leaves behind a luminous, glass-like finish.',
    keyIngredient: 'Salmon PDRN + Vitamin Complex + Niacinamide',
    howToUse:
      'After cleansing and toning, apply mask to face avoiding eyes and lips. Leave for 15-20 minutes. Remove and pat remaining essence gently into skin.',
    format: 'Sheet Mask',
    concern: 'Brightening & Glow',
    skinType: 'Dull, uneven tone',
    heroColor: '#D4BA7A',
    image: '/images/products/ritual-4-illuminate.jpg',
  },
  {
    handle: 'laneige-cica-sleeping-mask',
    ritualNumber: 'V',
    ritualName: 'Soothe',
    brand: 'Laneige',
    name: 'Cica Sleeping Mask Mini',
    subtitle: '10ml',
    price: 8.0,
    compareAtPrice: 12.0,
    currency: 'USD',
    description:
      "The final seal. Laneige's beloved sleeping mask in cica form — a weightless overnight blanket that repairs, hydrates, and soothes while the world goes quiet.",
    keyIngredient: 'Cica (Centella Asiatica) + Forest Yeast + Sleeping Microbiome',
    howToUse:
      'As the last step of your evening routine, apply a thin layer over face. Sleep. Rinse off in the morning. Use nightly or 3-4 times per week.',
    format: 'Sleeping Mask',
    concern: 'Overnight Repair & Hydration',
    skinType: 'All skin types, especially sensitive',
    heroColor: '#8FA68E',
    image: '/images/products/ritual-5-soothe.jpg',
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
      'Every mask. Every intention. The Complete Ritual brings together all five of our curated Korean masks in one considered collection — a full ceremony for your skin.',
    keyIngredient: null,
    howToUse: null,
    format: 'Bundle',
    concern: 'Complete skincare ceremony',
    skinType: 'All skin types',
    heroColor: '#C5A55A',
    image: '/images/products/complete-ritual.jpg',
    bundleIncludes: [
      'medicube-pdrn-gel-mask',
      'medicube-wrapping-mask',
      'anua-heartleaf-mask',
      'medicube-vita-coating-mask',
      'laneige-cica-sleeping-mask',
    ],
    savings: 27.0,
    savingsPercent: 21,
  },
];

export function getProductByHandle(handle: string): Product | null {
  return products.find((p) => p.handle === handle) ?? null;
}

export function getRitualProducts(): Product[] {
  return products.filter((p) => p.ritualNumber !== null);
}
