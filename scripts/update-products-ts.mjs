#!/usr/bin/env node
/**
 * One-shot edit of app/lib/products.ts:
 * - Remove CELDYQUE (Elixir II) and Heimish Artless Glow blocks
 * - Insert 16 new product entries for the Phase 2 catalogue
 */
import {readFileSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'app', 'lib', 'products.ts');

let src = readFileSync(FILE, 'utf-8');

// ── 1. Remove the 2 obsolete product blocks ──────────────────────────────────
// Match each `{ ... handle: 'X' ... },` block including trailing newline.

function removeProductBlock(src, handle) {
  // Find the opening brace of the product object containing this handle.
  // Products are indented 2 spaces; each object starts with "  {" and ends with "  },"
  const handleLine = `handle: '${handle}'`;
  const idx = src.indexOf(handleLine);
  if (idx < 0) { console.warn(`  !! ${handle} not found`); return src; }
  // Walk backward to find the "  {" start
  let start = src.lastIndexOf('\n  {', idx);
  if (start < 0) return src;
  // Walk forward to find the matching "  },"
  let end = src.indexOf('\n  },', idx);
  if (end < 0) return src;
  end += '\n  },'.length;
  // Include trailing newline
  if (src[end] === '\n') end++;
  const removed = src.slice(start, end);
  console.log(`  ✓ removed: ${handle} (${removed.split('\n').length} lines)`);
  return src.slice(0, start) + src.slice(end);
}

src = removeProductBlock(src, 'celdyque-pdrn-egf-serum');
src = removeProductBlock(src, 'heimish-artless-glow-tinted-sunscreen');

// ── 2. New products to add (16) ──────────────────────────────────────────────

const newProducts = [
  // — Masks (2) — sheet + wrapping, not in the Five Rituals
  {
    handle: 'medicube-pdrn-tension-mask',
    ritualNumber: null, ritualName: 'PDRN Tension Mask', brand: 'Medicube',
    name: 'PDRN Pink Tension Up Mask Set', subtitle: '4 sheets · Diamond Lifting Fabric',
    price: 17.99, compareAtPrice: 21.0, heroColor: '#C9928A',
    description: 'An intensive ten-minute contouring mask engineered with Diamond Lifting Fabric \u2014 an elastic weave that sculpts along the jawline, mid-face, and smile lines. Infused with 99% high-purity Salmon PDRN, Niacinamide, and Caffeine to firm, depuff, and refine contour while deeply hydrating. Three adjustable ear hooks let you personalise the tension.',
    keyIngredient: 'Salmon PDRN + Niacinamide + Caffeine',
    howToUse: 'After cleansing and toning, place the mask on the face and hook the side panels around the ears. Secure the tightening band from chin to crown, then leave on for 10 to 20 minutes before removing.',
    format: 'Sheet Mask', concern: 'Firming', skinType: 'All skin types',
    image: '/images/products/medicube-pdrn-tension-mask.png',
    collection: 'ritual',
    tags: ['mask', 'pdrn', 'firming', 'medicube', 'sheet-mask'],
    socialProof: 'Diamond Lifting Fabric · 99% Salmon PDRN · 10-20 min contouring ritual',
  },
  {
    handle: 'medicube-pdrn-caffeine-wrapping',
    ritualNumber: null, ritualName: 'PDRN Night Wrapping', brand: 'Medicube',
    name: 'PDRN Pink Caffeine Night Wrapping Mask', subtitle: '75ml · overnight peel-off',
    price: 17.99, compareAtPrice: 21.0, heroColor: '#D4BA7A',
    description: 'A shimmering pink pearl overnight wrap that sets to a second-skin film, working while you sleep to firm, decongest, and refine facial contours by morning. High-purity Salmon PDRN, Caffeine and low-molecular Collagen target puffiness and loss of definition without drying the skin beneath.',
    keyIngredient: 'Salmon PDRN + Caffeine + Low-Molecular Collagen',
    howToUse: 'As the final step of your evening routine, use the included silicone brush to apply an even layer across the face. Let it dry for 20\u201330 minutes until a snug film forms, then sleep in it and peel or rinse away in the morning.',
    format: 'Wrapping Mask', concern: 'Firming & Overnight Repair', skinType: 'All skin types',
    image: '/images/products/medicube-pdrn-caffeine-wrapping.jpg',
    collection: 'ritual',
    tags: ['mask', 'overnight', 'pdrn', 'firming', 'medicube', 'wrapping-mask'],
    socialProof: 'Peel-off second-skin film · Caffeine depuffs · Low-molecular collagen for elasticity',
  },
  // — Elixirs (12) —
  {
    handle: 'medicube-pdrn-bubble-serum',
    ritualNumber: null, ritualName: 'Elixir \u2014 Bubble Serum', brand: 'Medicube',
    name: 'PDRN Pink Bubble Serum', subtitle: '95ml · bubble-to-serum texture',
    price: 19.99, compareAtPrice: 23.0, heroColor: '#C9928A',
    description: 'A bubble-to-serum treatment that bursts into a weightless veil on contact, saturating the skin in under ten seconds with no residue. 99% high-purity Salmon PDRN, 5% Niacinamide, and low-molecular Collagen work on three fronts: deep hydration, tone correction, and visible firmness.',
    keyIngredient: 'Salmon PDRN + Niacinamide + Low-Molecular Collagen',
    howToUse: 'After toner, dispense one to two pumps into the palm and press evenly across the face. The bubble texture melts into the skin within seconds \u2014 no patting required. Follow with moisturizer, morning and evening.',
    format: 'Serum', concern: 'Hydration & Brightening', skinType: 'All skin types',
    image: '/images/products/medicube-pdrn-bubble-serum.jpg',
    collection: 'elixir',
    tags: ['elixir', 'serum', 'pdrn', 'hydration', 'medicube'],
    socialProof: '99% Salmon PDRN · 5% Niacinamide · Absorbs in under 10 seconds',
  },
  {
    handle: 'medicube-pdrn-one-day-serum',
    ritualNumber: null, ritualName: 'Elixir \u2014 One Day Course', brand: 'Medicube',
    name: 'PDRN Pink One Day Serum Set', subtitle: '10 ampoules \u00d7 1.5ml',
    price: 17.99, compareAtPrice: 21.0, heroColor: '#D4BA7A',
    description: 'A ten-day intensive programme delivered in single-dose glass ampoules, each sealed with an optimal pour of 99% high-purity Salmon PDRN. Designed as a short-form reset \u2014 travel, pre-event, post-treatment. 285Da Collagen layers with Glutathione, Elastin and seven weights of Hyaluronic Acid for radiance, tone, bounce.',
    keyIngredient: 'Salmon PDRN + 285Da Collagen + Glutathione',
    howToUse: 'Once a day after toner, twist off the cap and apply the full ampoule across the face, pressing gently until absorbed. Use one ampoule nightly for ten consecutive days.',
    format: 'Ampoule Set', concern: 'Brightening & Radiance', skinType: 'All skin types',
    image: '/images/products/medicube-pdrn-one-day-serum.jpg',
    collection: 'elixir',
    tags: ['elixir', 'ampoule', 'pdrn', 'brightening', 'medicube', 'travel'],
    socialProof: '+58.7% immediate hydration · +38.8% radiance · 10-day course in single-dose vials',
  },
  {
    handle: 'medicube-pdrn-cica-toner',
    ritualNumber: null, ritualName: 'Elixir \u2014 Cica Toner', brand: 'Medicube',
    name: 'PDRN Pink Cica Soothing Toner', subtitle: '250ml · daily prep step',
    price: 18.99, compareAtPrice: 22.0, heroColor: '#8FA68E',
    description: 'A lightweight, watery toner that calms first and radiates second \u2014 built around Salmon PDRN, Centella Asiatica, and Niacinamide for skin that runs reactive, uneven, or easily flushed. Replenishes moisture ten layers deep while quieting post-blemish marks, hyperpigmentation, and early irritation.',
    keyIngredient: 'Salmon PDRN + Centella Asiatica + Niacinamide',
    howToUse: 'After cleansing, dispense a generous amount into the palms and press across the entire face and neck. Pat gently until absorbed, then follow with serum.',
    format: 'Toner', concern: 'Soothing & Hydration', skinType: 'All skin types, especially sensitive',
    image: '/images/products/medicube-pdrn-cica-toner.jpg',
    collection: 'elixir',
    tags: ['elixir', 'toner', 'pdrn', 'soothing', 'medicube'],
    socialProof: 'Visible tone improvement in 2 weeks · Centella + PDRN · 250ml value size',
  },
  {
    handle: 'medicube-pdrn-toner-pad',
    ritualNumber: null, ritualName: 'Elixir \u2014 Toner Pad', brand: 'Medicube',
    name: 'PDRN Pink Collagen Toning Gel Toner Pad', subtitle: '70 pads · dual-texture',
    price: 19.99, compareAtPrice: 23.0, heroColor: '#C9928A',
    description: 'A hybrid of toner, essence, and gel mask \u2014 each 0.5mm pad soaks in 99% Salmon PDRN essence, swelling into a bouncy collagen gel that clings weightlessly. Ultra-low molecular 200Da Collagen, Niacinamide, Madecassoside, and a whisper of Retinol refine texture, soothe, and even tone.',
    keyIngredient: 'Salmon PDRN + 200Da Collagen + Madecassoside',
    howToUse: 'Pour a small amount of the PDRN essence over the pads before first use and wait five seconds. Sweep one pad across the face after cleansing, then leave on problem areas for two to three minutes as a quick mask.',
    format: 'Toner Pad', concern: 'Firming & Glass Skin', skinType: 'All skin types',
    image: '/images/products/medicube-pdrn-toner-pad.jpg',
    collection: 'elixir',
    tags: ['elixir', 'toner-pad', 'pdrn', 'firming', 'medicube'],
    socialProof: '200Da ultra-low molecular collagen · Dual-texture pad · Instant-glass-skin step',
  },
  {
    handle: 'medicube-pdrn-eye-cream',
    ritualNumber: null, ritualName: 'Elixir \u2014 Peptide Eye Cream', brand: 'Medicube',
    name: 'PDRN Pink Peptide Eye Cream', subtitle: '30ml · AM + PM',
    price: 19.99, compareAtPrice: 23.0, heroColor: '#D4BA7A',
    description: 'A lightweight eye treatment formulated for the most reactive part of the face, combining Salmon PDRN with 99%-purity Retinol, Peptides, and Niacinamide to address fine lines, dullness, and loss of bounce. Non-greasy, absorbs quickly, does not pill beneath concealer.',
    keyIngredient: 'Salmon PDRN + Retinol + Peptides',
    howToUse: 'Morning and evening after serum, dispense a rice-grain amount and tap gently around the orbital bone with the ring finger. Avoid direct contact with the lash line and follow with moisturizer.',
    format: 'Eye Cream', concern: 'Anti-aging & Firming', skinType: 'All skin types',
    image: '/images/products/medicube-pdrn-eye-cream.jpg',
    collection: 'elixir',
    tags: ['elixir', 'eye-cream', 'pdrn', 'anti-aging', 'medicube'],
    socialProof: '99% Retinol + PDRN + Peptides · +22.5% moisture, +2.87% firmness in 1 week',
  },
  {
    handle: 'medicube-pdrn-hyaluronic-cream',
    ritualNumber: null, ritualName: 'Elixir \u2014 Hyaluronic Cream', brand: 'Medicube',
    name: 'PDRN Pink Hyaluronic Moisturizing Cream', subtitle: '50ml · AM + PM',
    price: 19.99, compareAtPrice: 23.0, heroColor: '#D4C4B0',
    description: 'A quiet workhorse of a moisturiser \u2014 lightweight in feel, serious in function. Salmon PDRN supports visible resilience, 2% Niacinamide brightens and evens tone, and ten molecular weights of Hyaluronic Acid build hydration in layers so skin feels plump hours after application.',
    keyIngredient: 'Salmon PDRN + Niacinamide + Hyaluronic Acid',
    howToUse: 'Morning and evening, warm a moderate amount between the palms and press across the face and neck after serum. Allow to absorb for thirty seconds before SPF or sleeping.',
    format: 'Moisturizer', concern: 'Hydration', skinType: 'All skin types, especially dry',
    image: '/images/products/medicube-pdrn-hyaluronic-cream.webp',
    collection: 'elixir',
    tags: ['elixir', 'moisturizer', 'pdrn', 'hydration', 'medicube'],
    socialProof: '10 weights of hyaluronic acid · PDRN + 2% Niacinamide · Non-greasy daily cream',
  },
  {
    handle: 'centellian24-madeca-pdrn',
    ritualNumber: null, ritualName: 'Elixir \u2014 Madeca PDRN', brand: 'Centellian24',
    name: 'Expert Madeca Cream Active Renew PDRN', subtitle: '55ml · post-procedure recovery',
    price: 21.99, compareAtPrice: 26.0, heroColor: '#8FA68E',
    description: "Dongkook Pharmaceutical's flagship Tiger Grass formula reimagined through a regenerative lens. A proprietary TECA-PDRN complex dosed at 20,000ppm alongside 2,000ppm pure Sodium DNA, with Damask rose flower water and multi-weight hyaluronic acid. Targets the five signatures of post-procedure fatigue \u2014 a treatment-adjacent cream for skin in recovery.",
    keyIngredient: 'TECA-PDRN Complex + Centella Asiatica + Damask Rose Water',
    howToUse: 'Warm a small amount between fingertips and press gently over cleansed, toned skin. Layer along the jaw and cheekbones with upward motions. Suitable after in-clinic treatments.',
    format: 'Cream', concern: 'Regeneration & Firming', skinType: 'All skin types, especially compromised',
    image: '/images/products/centellian24-madeca-pdrn.jpg',
    collection: 'elixir',
    tags: ['elixir', 'cream', 'pdrn', 'centella', 'regeneration', 'centellian24'],
    socialProof: '20,000ppm TECA-PDRN + 2,000ppm Sodium DNA · Dongkook pharmaceutical heritage',
  },
  {
    handle: 'centellian24-time-reverse-zero',
    ritualNumber: null, ritualName: 'Elixir \u2014 Time Reverse Zero', brand: 'Centellian24',
    name: 'Madeca Cream Time Reverse Zero', subtitle: '80ml · water-volume anti-aging',
    price: 19.99, compareAtPrice: 24.0, heroColor: '#8FA68E',
    description: "The summer-weight iteration of Centellian24's acclaimed anti-aging cream. A concentrated TECA complex paired with retinol, ceramide NP and peptides to visibly smooth fine lines, reinforce the barrier and restore elastic tone. Clinically shown to calm redness in five seconds and elevate hydration by thirty percent within thirty.",
    keyIngredient: 'TECA (Tiger Grass Complex) + Retinol + Ceramide NP',
    howToUse: 'Apply as the closing step of your skincare routine, morning and evening, after serums. Dispense a generous pearl and press evenly across the face and neck until absorbed. New to retinol? Begin with evening use.',
    format: 'Cream', concern: 'Anti-aging', skinType: 'All skin types',
    image: '/images/products/centellian24-time-reverse-zero.jpg',
    collection: 'elixir',
    tags: ['elixir', 'cream', 'anti-aging', 'centella', 'centellian24'],
    socialProof: 'Redness calmed in 5 seconds · +30% hydration in 30 · Triple Zero texture',
  },
  {
    handle: 'centellian24-mela-capture-cream',
    ritualNumber: null, ritualName: 'Elixir \u2014 Mela Capture', brand: 'Centellian24',
    name: 'Madeca Mela Capture Ampoule Capsule Cream', subtitle: '55ml · dual-phase brightening',
    price: 24.99, compareAtPrice: 29.0, heroColor: '#C9928A',
    description: "A study in textural duality \u2014 luminous white ampoule capsules suspended within a blush-pink gel, each phase activating the other at application. Dongkook's patented Mela-Zero and Mela-Clean complexes work alongside niacinamide, TECA and an architecture of six peptides, six collagens and ten hyaluronic acids to refine uneven tone.",
    keyIngredient: 'Mela-Zero & Mela-Clean Complex + Niacinamide + TECA',
    howToUse: 'Scoop an equal measure of the white ampoule capsule and pink gel cream and blend gently on the back of the hand. Apply evenly across the face, pressing into areas of uneven tone. Use morning and evening, followed by SPF during the day.',
    format: 'Cream', concern: 'Brightening & Tone', skinType: 'All skin types',
    image: '/images/products/centellian24-mela-capture-cream.jpg',
    collection: 'elixir',
    tags: ['elixir', 'cream', 'brightening', 'centella', 'centellian24'],
    socialProof: 'Dual-phase capsule technology · 6 peptides + 6 collagens + 10 HA · Mela-Zero complex',
  },
  {
    handle: 'centellian24-pdrn-eye-cream',
    ritualNumber: null, ritualName: 'Elixir \u2014 360\u00b0 Eye Cream', brand: 'Centellian24',
    name: '360\u00b0 Shot PDRN Lifting Eye Cream', subtitle: '30ml · targeted periocular',
    price: 19.99, compareAtPrice: 23.0, heroColor: '#D4BA7A',
    description: "An eye treatment conceived with the precision of an in-clinic protocol. Salmon-derived PDRN and Centella-derived PDRN converge with retinol, hydroxypinacolone retinoate and signal peptides to firm crepey texture, soften crow's feet and lift hooded contours.",
    keyIngredient: 'Salmon PDRN + Retinol & Peptides + Centella Extract',
    howToUse: 'After serum, dot a rice-grain amount beneath each eye and along the brow bone. Tap in gently with the ring finger using outward, lifting motions. Morning and evening; during the day follow with sunscreen.',
    format: 'Eye Cream', concern: 'Anti-aging & Lifting', skinType: 'All skin types',
    image: '/images/products/centellian24-pdrn-eye-cream.jpg',
    collection: 'elixir',
    tags: ['elixir', 'eye-cream', 'pdrn', 'anti-aging', 'lifting', 'centellian24'],
    socialProof: 'Dual PDRN (Salmon + Centella) · Retinol + HPR + Peptides · In-clinic precision',
  },
  {
    handle: 'anua-pdrn-ha-capsule-serum',
    ritualNumber: null, ritualName: 'Elixir \u2014 PDRN Capsule Serum', brand: 'Anua',
    name: 'PDRN Hyaluronic Acid Capsule 100 Serum', subtitle: '30ml · emerald serum',
    price: 23.99, compareAtPrice: 28.0, heroColor: '#8FA68E',
    description: 'A jewel-toned emerald serum that pairs PDRN (salmon-DNA polynucleotides) with an 11-layered hyaluronic acid complex and hydrolysed collagen, bringing clinical-grade regeneration into an everyday ritual. Weightless yet cushioning, it drenches skin in long-wear moisture and restores a quiet, lit-from-within glow.',
    keyIngredient: 'PDRN (Salmon DNA) + 3% Hyaluronic Acid + Hydrolyzed Collagen',
    howToUse: 'After toner, press a few drops onto clean skin morning and night, patting gently until absorbed. Follow with oil or moisturiser, and finish with SPF 30+ during the day. For an overnight treatment, layer two to three times.',
    format: 'Serum', concern: 'Hydration & Regeneration', skinType: 'All skin types',
    image: '/images/products/anua-pdrn-ha-capsule-serum.png',
    collection: 'elixir',
    tags: ['elixir', 'serum', 'pdrn', 'hydration', 'anua'],
    socialProof: 'First K-beauty take-home PDRN · 11-layer HA complex · Cult counter favourite',
  },
  // — Cleanse (2) — (new category, maps to 'elixir' collection for now)
  {
    handle: 'medicube-pdrn-whip-cleanser',
    ritualNumber: null, ritualName: 'The Cleanse \u2014 PDRN Whip', brand: 'Medicube',
    name: 'PDRN Pink Niacinamide Whip Cleanser', subtitle: '120g · mask-to-foam texture',
    price: 18.99, compareAtPrice: 22.0, heroColor: '#C9928A',
    description: 'A cleanser that behaves first like a mask, then like a cream foam \u2014 a pink, marshmallow-weight texture that stretches onto dry skin to grip impurities before whipping into a soft lather under water. 99% Salmon PDRN and Niacinamide refine tone while Hyaluronic Acid and Ceramides hold the barrier intact.',
    keyIngredient: 'Salmon PDRN + Niacinamide + Ceramides',
    howToUse: 'Apply a coin-sized amount to dry skin and massage for thirty seconds, allowing the stretchy texture to lift away impurities. Add water to emulsify into a soft foam, then rinse with lukewarm water.',
    format: 'Cleanser', concern: 'Brightening & Cleanse', skinType: 'All skin types',
    image: '/images/products/medicube-pdrn-whip-cleanser.jpg',
    collection: 'elixir',
    tags: ['cleanse', 'pdrn', 'brightening', 'medicube'],
    socialProof: '\u221298.98% pore impurities · 99% Salmon PDRN · Stretch-to-foam hybrid texture',
  },
  {
    handle: 'mixsoon-bean-cleansing-oil',
    ritualNumber: null, ritualName: 'The Cleanse \u2014 Bean Oil', brand: 'Mixsoon',
    name: 'Bean Cleansing Oil', subtitle: '195ml · fermented clean beauty',
    price: 15.99, compareAtPrice: 18.75, heroColor: '#D4C4B0',
    description: "A quiet cult classic of Korean clean beauty, composed around Mixsoon's patented fermented soybean extract and a considered blend of cold-pressed plant oils. The whisper-light texture melts away sunscreen, long-wear makeup and daily impurities without stripping, emulsifying into a soft milk on contact with water.",
    keyIngredient: 'Fermented Soybean Extract + Jojoba Oil + Sunflower Oil',
    howToUse: 'Dispense two to three pumps onto dry hands and massage over a dry face, focusing on nose, chin and forehead. Add water to emulsify into a milky lather, then rinse thoroughly with lukewarm water. Follow with a foam cleanser to complete the double cleanse.',
    format: 'Cleansing Oil', concern: 'Gentle Cleansing & Barrier Care', skinType: 'All skin types, especially sensitive',
    image: '/images/products/mixsoon-bean-cleansing-oil.png',
    collection: 'elixir',
    tags: ['cleanse', 'oil', 'fermented', 'vegan', 'mixsoon'],
    socialProof: 'Patented fermented soybean extract · Vegan · HRIPT-tested · Viral TikTok favourite',
  },
  // — Morning Veil (1) — PDRN tone-up SPF
  {
    handle: 'medicube-pdrn-sun-cream',
    ritualNumber: null, ritualName: 'The Morning Veil \u2014 PDRN Tone Up', brand: 'Medicube',
    name: 'PDRN Pink Tone Up Sun Cream SPF50+ PA++++', subtitle: '50ml · triple-functional daylight',
    price: 19.99, compareAtPrice: 23.0, heroColor: '#F5E6D0',
    description: 'A triple-functional daylight cream \u2014 broad-spectrum SPF50+ PA++++ protection, tone-up radiance, and anti-wrinkle care in a single step. The peach-pink veil settles invisibly on skin \u2014 no white cast, no tackiness \u2014 while Salmon PDRN, Glutathione, and Niacinamide work beneath the surface to brighten and support firmness.',
    keyIngredient: 'Salmon PDRN + Glutathione + Niacinamide',
    howToUse: 'As the final step of your morning routine, apply an even layer across the face and neck fifteen minutes before sun exposure. Reapply every two hours outdoors.',
    format: 'Sunscreen', concern: 'UV Protection & Brightening', skinType: 'All skin types',
    image: '/images/products/medicube-pdrn-sun-cream.png',
    collection: 'morning-veil',
    tags: ['morning-veil', 'spf', 'pdrn', 'tone-up', 'medicube'],
    socialProof: 'SPF50+ PA++++ · Triple function: protect, brighten, firm · Hypoallergenic',
  },
];

// ── 3. Serialise new products as TypeScript object literals ──────────────────

function ts(val) {
  if (val === null) return 'null';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) return '[' + val.map(v => ts(v)).join(', ') + ']';
  // String — escape backtick and interpolation
  return "'" + String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function serialiseProduct(p) {
  const lines = ['  {'];
  const order = ['handle', 'ritualNumber', 'ritualName', 'brand', 'name', 'subtitle',
                 'price', 'compareAtPrice', 'description', 'keyIngredient', 'howToUse',
                 'format', 'concern', 'skinType', 'heroColor', 'image', 'collection',
                 'tags', 'socialProof'];
  for (const key of order) {
    if (p[key] === undefined) continue;
    if (key === 'description' || key === 'howToUse') {
      lines.push(`    ${key}:\n      ${ts(p[key])},`);
    } else {
      lines.push(`    ${key}: ${ts(p[key])},`);
    }
  }
  lines.push(`    currency: 'USD',`);
  lines.push('  },');
  return lines.join('\n');
}

// ── 4. Insert new products before the closing "];" of products array ────────

// Find the end of the products array. The unlisted anua-pdrn-ha-cream is the
// last existing product — insert BEFORE the unlisted block so new ones are
// listed (visible in collections/nav), and anua-pdrn-ha-cream stays unlisted at end.

const insertionMarker = '  // ── UNLISTED PRODUCTS';
const insertionIdx = src.indexOf(insertionMarker);
if (insertionIdx < 0) {
  console.error('Could not find UNLISTED PRODUCTS marker — cannot insert');
  process.exit(1);
}

const newBlock = newProducts.map(serialiseProduct).join('\n') + '\n';
src = src.slice(0, insertionIdx) + newBlock + src.slice(insertionIdx);

writeFileSync(FILE, src);
console.log(`\n✓ Wrote ${FILE}`);
console.log(`  Added ${newProducts.length} products before unlisted section`);
console.log(`  Final line count: ${src.split('\n').length}`);
