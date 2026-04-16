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
  },  {
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
  },  {
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
  {
    handle: 'medicube-pdrn-tension-mask',
    ritualNumber: null,
    ritualName: 'PDRN Tension Mask',
    brand: 'Medicube',
    name: 'PDRN Pink Tension Up Mask Set',
    subtitle: '4 sheets · Diamond Lifting Fabric',
    price: 17.99,
    compareAtPrice: 21,
    description:
      'An intensive ten-minute contouring mask engineered with Diamond Lifting Fabric — an elastic weave that sculpts along the jawline, mid-face, and smile lines. Infused with 99% high-purity Salmon PDRN, Niacinamide, and Caffeine to firm, depuff, and refine contour while deeply hydrating. Three adjustable ear hooks let you personalise the tension.',
    keyIngredient: 'Salmon PDRN + Niacinamide + Caffeine',
    howToUse:
      'After cleansing and toning, place the mask on the face and hook the side panels around the ears. Secure the tightening band from chin to crown, then leave on for 10 to 20 minutes before removing.',
    format: 'Sheet Mask',
    concern: 'Firming',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/medicube-pdrn-tension-mask.png',
    collection: 'ritual',
    tags: ['mask', 'pdrn', 'firming', 'medicube', 'sheet-mask'],
    socialProof: 'Diamond Lifting Fabric · 99% Salmon PDRN · 10-20 min contouring ritual',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-caffeine-wrapping',
    ritualNumber: null,
    ritualName: 'PDRN Night Wrapping',
    brand: 'Medicube',
    name: 'PDRN Pink Caffeine Night Wrapping Mask',
    subtitle: '75ml · overnight peel-off',
    price: 17.99,
    compareAtPrice: 21,
    description:
      'A shimmering pink pearl overnight wrap that sets to a second-skin film, working while you sleep to firm, decongest, and refine facial contours by morning. High-purity Salmon PDRN, Caffeine and low-molecular Collagen target puffiness and loss of definition without drying the skin beneath.',
    keyIngredient: 'Salmon PDRN + Caffeine + Low-Molecular Collagen',
    howToUse:
      'As the final step of your evening routine, use the included silicone brush to apply an even layer across the face. Let it dry for 20–30 minutes until a snug film forms, then sleep in it and peel or rinse away in the morning.',
    format: 'Wrapping Mask',
    concern: 'Firming & Overnight Repair',
    skinType: 'All skin types',
    heroColor: '#D4BA7A',
    image: '/images/products/medicube-pdrn-caffeine-wrapping.jpg',
    collection: 'ritual',
    tags: ['mask', 'overnight', 'pdrn', 'firming', 'medicube', 'wrapping-mask'],
    socialProof: 'Peel-off second-skin film · Caffeine depuffs · Low-molecular collagen for elasticity',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-bubble-serum',
    ritualNumber: null,
    ritualName: 'Elixir — Bubble Serum',
    brand: 'Medicube',
    name: 'PDRN Pink Bubble Serum',
    subtitle: '95ml · bubble-to-serum texture',
    price: 19.99,
    compareAtPrice: 23,
    description:
      'A bubble-to-serum treatment that bursts into a weightless veil on contact, saturating the skin in under ten seconds with no residue. 99% high-purity Salmon PDRN, 5% Niacinamide, and low-molecular Collagen work on three fronts: deep hydration, tone correction, and visible firmness.',
    keyIngredient: 'Salmon PDRN + Niacinamide + Low-Molecular Collagen',
    howToUse:
      'After toner, dispense one to two pumps into the palm and press evenly across the face. The bubble texture melts into the skin within seconds — no patting required. Follow with moisturizer, morning and evening.',
    format: 'Serum',
    concern: 'Hydration & Brightening',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/medicube-pdrn-bubble-serum.jpg',
    collection: 'elixir',
    tags: ['elixir', 'serum', 'pdrn', 'hydration', 'medicube'],
    socialProof: '99% Salmon PDRN · 5% Niacinamide · Absorbs in under 10 seconds',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-one-day-serum',
    ritualNumber: null,
    ritualName: 'Elixir — One Day Course',
    brand: 'Medicube',
    name: 'PDRN Pink One Day Serum Set',
    subtitle: '10 ampoules × 1.5ml',
    price: 17.99,
    compareAtPrice: 21,
    description:
      'A ten-day intensive programme delivered in single-dose glass ampoules, each sealed with an optimal pour of 99% high-purity Salmon PDRN. Designed as a short-form reset — travel, pre-event, post-treatment. 285Da Collagen layers with Glutathione, Elastin and seven weights of Hyaluronic Acid for radiance, tone, bounce.',
    keyIngredient: 'Salmon PDRN + 285Da Collagen + Glutathione',
    howToUse:
      'Once a day after toner, twist off the cap and apply the full ampoule across the face, pressing gently until absorbed. Use one ampoule nightly for ten consecutive days.',
    format: 'Ampoule Set',
    concern: 'Brightening & Radiance',
    skinType: 'All skin types',
    heroColor: '#D4BA7A',
    image: '/images/products/medicube-pdrn-one-day-serum.jpg',
    collection: 'elixir',
    tags: ['elixir', 'ampoule', 'pdrn', 'brightening', 'medicube', 'travel'],
    socialProof: '+58.7% immediate hydration · +38.8% radiance · 10-day course in single-dose vials',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-cica-toner',
    ritualNumber: null,
    ritualName: 'Elixir — Cica Toner',
    brand: 'Medicube',
    name: 'PDRN Pink Cica Soothing Toner',
    subtitle: '250ml · daily prep step',
    price: 18.99,
    compareAtPrice: 22,
    description:
      'A lightweight, watery toner that calms first and radiates second — built around Salmon PDRN, Centella Asiatica, and Niacinamide for skin that runs reactive, uneven, or easily flushed. Replenishes moisture ten layers deep while quieting post-blemish marks, hyperpigmentation, and early irritation.',
    keyIngredient: 'Salmon PDRN + Centella Asiatica + Niacinamide',
    howToUse:
      'After cleansing, dispense a generous amount into the palms and press across the entire face and neck. Pat gently until absorbed, then follow with serum.',
    format: 'Toner',
    concern: 'Soothing & Hydration',
    skinType: 'All skin types, especially sensitive',
    heroColor: '#8FA68E',
    image: '/images/products/medicube-pdrn-cica-toner.jpg',
    collection: 'elixir',
    tags: ['elixir', 'toner', 'pdrn', 'soothing', 'medicube'],
    socialProof: 'Visible tone improvement in 2 weeks · Centella + PDRN · 250ml value size',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-toner-pad',
    ritualNumber: null,
    ritualName: 'Elixir — Toner Pad',
    brand: 'Medicube',
    name: 'PDRN Pink Collagen Toning Gel Toner Pad',
    subtitle: '70 pads · dual-texture',
    price: 19.99,
    compareAtPrice: 23,
    description:
      'A hybrid of toner, essence, and gel mask — each 0.5mm pad soaks in 99% Salmon PDRN essence, swelling into a bouncy collagen gel that clings weightlessly. Ultra-low molecular 200Da Collagen, Niacinamide, Madecassoside, and a whisper of Retinol refine texture, soothe, and even tone.',
    keyIngredient: 'Salmon PDRN + 200Da Collagen + Madecassoside',
    howToUse:
      'Pour a small amount of the PDRN essence over the pads before first use and wait five seconds. Sweep one pad across the face after cleansing, then leave on problem areas for two to three minutes as a quick mask.',
    format: 'Toner Pad',
    concern: 'Firming & Glass Skin',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/medicube-pdrn-toner-pad.jpg',
    collection: 'elixir',
    tags: ['elixir', 'toner-pad', 'pdrn', 'firming', 'medicube'],
    socialProof: '200Da ultra-low molecular collagen · Dual-texture pad · Instant-glass-skin step',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-eye-cream',
    ritualNumber: null,
    ritualName: 'Elixir — Peptide Eye Cream',
    brand: 'Medicube',
    name: 'PDRN Pink Peptide Eye Cream',
    subtitle: '30ml · AM + PM',
    price: 19.99,
    compareAtPrice: 23,
    description:
      'A lightweight eye treatment formulated for the most reactive part of the face, combining Salmon PDRN with 99%-purity Retinol, Peptides, and Niacinamide to address fine lines, dullness, and loss of bounce. Non-greasy, absorbs quickly, does not pill beneath concealer.',
    keyIngredient: 'Salmon PDRN + Retinol + Peptides',
    howToUse:
      'Morning and evening after serum, dispense a rice-grain amount and tap gently around the orbital bone with the ring finger. Avoid direct contact with the lash line and follow with moisturizer.',
    format: 'Eye Cream',
    concern: 'Anti-aging & Firming',
    skinType: 'All skin types',
    heroColor: '#D4BA7A',
    image: '/images/products/medicube-pdrn-eye-cream.jpg',
    collection: 'elixir',
    tags: ['elixir', 'eye-cream', 'pdrn', 'anti-aging', 'medicube'],
    socialProof: '99% Retinol + PDRN + Peptides · +22.5% moisture, +2.87% firmness in 1 week',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-hyaluronic-cream',
    ritualNumber: null,
    ritualName: 'Elixir — Hyaluronic Cream',
    brand: 'Medicube',
    name: 'PDRN Pink Hyaluronic Moisturizing Cream',
    subtitle: '50ml · AM + PM',
    price: 19.99,
    compareAtPrice: 23,
    description:
      'A quiet workhorse of a moisturiser — lightweight in feel, serious in function. Salmon PDRN supports visible resilience, 2% Niacinamide brightens and evens tone, and ten molecular weights of Hyaluronic Acid build hydration in layers so skin feels plump hours after application.',
    keyIngredient: 'Salmon PDRN + Niacinamide + Hyaluronic Acid',
    howToUse:
      'Morning and evening, warm a moderate amount between the palms and press across the face and neck after serum. Allow to absorb for thirty seconds before SPF or sleeping.',
    format: 'Moisturizer',
    concern: 'Hydration',
    skinType: 'All skin types, especially dry',
    heroColor: '#D4C4B0',
    image: '/images/products/medicube-pdrn-hyaluronic-cream.webp',
    collection: 'elixir',
    tags: ['elixir', 'moisturizer', 'pdrn', 'hydration', 'medicube'],
    socialProof: '10 weights of hyaluronic acid · PDRN + 2% Niacinamide · Non-greasy daily cream',
    currency: 'USD',
  },
  {
    handle: 'centellian24-madeca-pdrn',
    ritualNumber: null,
    ritualName: 'Elixir — Madeca PDRN',
    brand: 'Centellian24',
    name: 'Expert Madeca Cream Active Renew PDRN',
    subtitle: '55ml · post-procedure recovery',
    price: 21.99,
    compareAtPrice: 26,
    description:
      'Dongkook Pharmaceutical\'s flagship Tiger Grass formula reimagined through a regenerative lens. A proprietary TECA-PDRN complex dosed at 20,000ppm alongside 2,000ppm pure Sodium DNA, with Damask rose flower water and multi-weight hyaluronic acid. Targets the five signatures of post-procedure fatigue — a treatment-adjacent cream for skin in recovery.',
    keyIngredient: 'TECA-PDRN Complex + Centella Asiatica + Damask Rose Water',
    howToUse:
      'Warm a small amount between fingertips and press gently over cleansed, toned skin. Layer along the jaw and cheekbones with upward motions. Suitable after in-clinic treatments.',
    format: 'Cream',
    concern: 'Regeneration & Firming',
    skinType: 'All skin types, especially compromised',
    heroColor: '#8FA68E',
    image: '/images/products/centellian24-madeca-pdrn.jpg',
    collection: 'elixir',
    tags: ['elixir', 'cream', 'pdrn', 'centella', 'regeneration', 'centellian24'],
    socialProof: '20,000ppm TECA-PDRN + 2,000ppm Sodium DNA · Dongkook pharmaceutical heritage',
    currency: 'USD',
  },
  {
    handle: 'centellian24-time-reverse-zero',
    ritualNumber: null,
    ritualName: 'Elixir — Time Reverse Zero',
    brand: 'Centellian24',
    name: 'Madeca Cream Time Reverse Zero',
    subtitle: '80ml · water-volume anti-aging',
    price: 19.99,
    compareAtPrice: 24,
    description:
      'The summer-weight iteration of Centellian24\'s acclaimed anti-aging cream. A concentrated TECA complex paired with retinol, ceramide NP and peptides to visibly smooth fine lines, reinforce the barrier and restore elastic tone. Clinically shown to calm redness in five seconds and elevate hydration by thirty percent within thirty.',
    keyIngredient: 'TECA (Tiger Grass Complex) + Retinol + Ceramide NP',
    howToUse:
      'Apply as the closing step of your skincare routine, morning and evening, after serums. Dispense a generous pearl and press evenly across the face and neck until absorbed. New to retinol? Begin with evening use.',
    format: 'Cream',
    concern: 'Anti-aging',
    skinType: 'All skin types',
    heroColor: '#8FA68E',
    image: '/images/products/centellian24-time-reverse-zero.jpg',
    collection: 'elixir',
    tags: ['elixir', 'cream', 'anti-aging', 'centella', 'centellian24'],
    socialProof: 'Redness calmed in 5 seconds · +30% hydration in 30 · Triple Zero texture',
    currency: 'USD',
  },
  {
    handle: 'centellian24-mela-capture-cream',
    ritualNumber: null,
    ritualName: 'Elixir — Mela Capture',
    brand: 'Centellian24',
    name: 'Madeca Mela Capture Ampoule Capsule Cream',
    subtitle: '55ml · dual-phase brightening',
    price: 24.99,
    compareAtPrice: 29,
    description:
      'A study in textural duality — luminous white ampoule capsules suspended within a blush-pink gel, each phase activating the other at application. Dongkook\'s patented Mela-Zero and Mela-Clean complexes work alongside niacinamide, TECA and an architecture of six peptides, six collagens and ten hyaluronic acids to refine uneven tone.',
    keyIngredient: 'Mela-Zero & Mela-Clean Complex + Niacinamide + TECA',
    howToUse:
      'Scoop an equal measure of the white ampoule capsule and pink gel cream and blend gently on the back of the hand. Apply evenly across the face, pressing into areas of uneven tone. Use morning and evening, followed by SPF during the day.',
    format: 'Cream',
    concern: 'Brightening & Tone',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/centellian24-mela-capture-cream.jpg',
    collection: 'elixir',
    tags: ['elixir', 'cream', 'brightening', 'centella', 'centellian24'],
    socialProof: 'Dual-phase capsule technology · 6 peptides + 6 collagens + 10 HA · Mela-Zero complex',
    currency: 'USD',
  },
  {
    handle: 'centellian24-pdrn-eye-cream',
    ritualNumber: null,
    ritualName: 'Elixir — 360° Eye Cream',
    brand: 'Centellian24',
    name: '360° Shot PDRN Lifting Eye Cream',
    subtitle: '30ml · targeted periocular',
    price: 19.99,
    compareAtPrice: 23,
    description:
      'An eye treatment conceived with the precision of an in-clinic protocol. Salmon-derived PDRN and Centella-derived PDRN converge with retinol, hydroxypinacolone retinoate and signal peptides to firm crepey texture, soften crow\'s feet and lift hooded contours.',
    keyIngredient: 'Salmon PDRN + Retinol & Peptides + Centella Extract',
    howToUse:
      'After serum, dot a rice-grain amount beneath each eye and along the brow bone. Tap in gently with the ring finger using outward, lifting motions. Morning and evening; during the day follow with sunscreen.',
    format: 'Eye Cream',
    concern: 'Anti-aging & Lifting',
    skinType: 'All skin types',
    heroColor: '#D4BA7A',
    image: '/images/products/centellian24-pdrn-eye-cream.jpg',
    collection: 'elixir',
    tags: ['elixir', 'eye-cream', 'pdrn', 'anti-aging', 'lifting', 'centellian24'],
    socialProof: 'Dual PDRN (Salmon + Centella) · Retinol + HPR + Peptides · In-clinic precision',
    currency: 'USD',
  },
  {
    handle: 'anua-pdrn-ha-capsule-serum',
    ritualNumber: null,
    ritualName: 'Elixir — PDRN Capsule Serum',
    brand: 'Anua',
    name: 'PDRN Hyaluronic Acid Capsule 100 Serum',
    subtitle: '30ml · emerald serum',
    price: 23.99,
    compareAtPrice: 28,
    description:
      'A jewel-toned emerald serum that pairs PDRN (salmon-DNA polynucleotides) with an 11-layered hyaluronic acid complex and hydrolysed collagen, bringing clinical-grade regeneration into an everyday ritual. Weightless yet cushioning, it drenches skin in long-wear moisture and restores a quiet, lit-from-within glow.',
    keyIngredient: 'PDRN (Salmon DNA) + 3% Hyaluronic Acid + Hydrolyzed Collagen',
    howToUse:
      'After toner, press a few drops onto clean skin morning and night, patting gently until absorbed. Follow with oil or moisturiser, and finish with SPF 30+ during the day. For an overnight treatment, layer two to three times.',
    format: 'Serum',
    concern: 'Hydration & Regeneration',
    skinType: 'All skin types',
    heroColor: '#8FA68E',
    image: '/images/products/anua-pdrn-ha-capsule-serum.png',
    collection: 'elixir',
    tags: ['elixir', 'serum', 'pdrn', 'hydration', 'anua'],
    socialProof: 'First K-beauty take-home PDRN · 11-layer HA complex · Cult counter favourite',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-whip-cleanser',
    ritualNumber: null,
    ritualName: 'The Cleanse — PDRN Whip',
    brand: 'Medicube',
    name: 'PDRN Pink Niacinamide Whip Cleanser',
    subtitle: '120g · mask-to-foam texture',
    price: 18.99,
    compareAtPrice: 22,
    description:
      'A cleanser that behaves first like a mask, then like a cream foam — a pink, marshmallow-weight texture that stretches onto dry skin to grip impurities before whipping into a soft lather under water. 99% Salmon PDRN and Niacinamide refine tone while Hyaluronic Acid and Ceramides hold the barrier intact.',
    keyIngredient: 'Salmon PDRN + Niacinamide + Ceramides',
    howToUse:
      'Apply a coin-sized amount to dry skin and massage for thirty seconds, allowing the stretchy texture to lift away impurities. Add water to emulsify into a soft foam, then rinse with lukewarm water.',
    format: 'Cleanser',
    concern: 'Brightening & Cleanse',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/medicube-pdrn-whip-cleanser.jpg',
    collection: 'elixir',
    tags: ['cleanse', 'pdrn', 'brightening', 'medicube'],
    socialProof: '−98.98% pore impurities · 99% Salmon PDRN · Stretch-to-foam hybrid texture',
    currency: 'USD',
  },
  {
    handle: 'mixsoon-bean-cleansing-oil',
    ritualNumber: null,
    ritualName: 'The Cleanse — Bean Oil',
    brand: 'Mixsoon',
    name: 'Bean Cleansing Oil',
    subtitle: '195ml · fermented clean beauty',
    price: 15.99,
    compareAtPrice: 18.75,
    description:
      'A quiet cult classic of Korean clean beauty, composed around Mixsoon\'s patented fermented soybean extract and a considered blend of cold-pressed plant oils. The whisper-light texture melts away sunscreen, long-wear makeup and daily impurities without stripping, emulsifying into a soft milk on contact with water.',
    keyIngredient: 'Fermented Soybean Extract + Jojoba Oil + Sunflower Oil',
    howToUse:
      'Dispense two to three pumps onto dry hands and massage over a dry face, focusing on nose, chin and forehead. Add water to emulsify into a milky lather, then rinse thoroughly with lukewarm water. Follow with a foam cleanser to complete the double cleanse.',
    format: 'Cleansing Oil',
    concern: 'Gentle Cleansing & Barrier Care',
    skinType: 'All skin types, especially sensitive',
    heroColor: '#D4C4B0',
    image: '/images/products/mixsoon-bean-cleansing-oil.png',
    collection: 'elixir',
    tags: ['cleanse', 'oil', 'fermented', 'vegan', 'mixsoon'],
    socialProof: 'Patented fermented soybean extract · Vegan · HRIPT-tested · Viral TikTok favourite',
    currency: 'USD',
  },
  {
    handle: 'medicube-pdrn-sun-cream',
    ritualNumber: null,
    ritualName: 'The Morning Veil — PDRN Tone Up',
    brand: 'Medicube',
    name: 'PDRN Pink Tone Up Sun Cream SPF50+ PA++++',
    subtitle: '50ml · triple-functional daylight',
    price: 19.99,
    compareAtPrice: 23,
    description:
      'A triple-functional daylight cream — broad-spectrum SPF50+ PA++++ protection, tone-up radiance, and anti-wrinkle care in a single step. The peach-pink veil settles invisibly on skin — no white cast, no tackiness — while Salmon PDRN, Glutathione, and Niacinamide work beneath the surface to brighten and support firmness.',
    keyIngredient: 'Salmon PDRN + Glutathione + Niacinamide',
    howToUse:
      'As the final step of your morning routine, apply an even layer across the face and neck fifteen minutes before sun exposure. Reapply every two hours outdoors.',
    format: 'Sunscreen',
    concern: 'UV Protection & Brightening',
    skinType: 'All skin types',
    heroColor: '#F5E6D0',
    image: '/images/products/medicube-pdrn-sun-cream.png',
    collection: 'morning-veil',
    tags: ['morning-veil', 'spf', 'pdrn', 'tone-up', 'medicube'],
    socialProof: 'SPF50+ PA++++ · Triple function: protect, brighten, firm · Hypoallergenic',
    currency: 'USD',
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
