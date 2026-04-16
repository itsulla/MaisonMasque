#!/usr/bin/env node
/**
 * Mirror the Shopify catalogue curation in app/lib/products.ts:
 *  - Remove 10 product blocks (9 deleted from Shopify + 1 unlisted duplicate)
 *  - Add "The Medicube Bundle" as a new product
 */
import {readFileSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'app', 'lib', 'products.ts');

let src = readFileSync(FILE, 'utf-8');

const DELETE_HANDLES = [
  'medicube-pdrn-bubble-serum',
  'medicube-pdrn-one-day-serum',
  'medicube-pdrn-cica-toner',
  'medicube-pdrn-toner-pad',
  'medicube-pdrn-eye-cream',
  'medicube-pdrn-hyaluronic-cream',
  'centellian24-time-reverse-zero',
  'centellian24-mela-capture-cream',
  'centellian24-pdrn-eye-cream',
  'anua-pdrn-ha-cream',
];

/**
 * Find the byte range of a top-level product object whose handle matches.
 * Works on the UNMODIFIED source — we compute all ranges first, then splice
 * them out back-to-front so earlier offsets don't shift underneath us.
 */
function blockRange(src, handle) {
  // Anchor on `    handle: 'X',` at indent depth 4 — ignores nested strings
  const anchor = `    handle: '${handle}',`;
  const idx = src.indexOf(anchor);
  if (idx < 0) return null;
  const start = src.lastIndexOf('\n  {', idx);
  let end = src.indexOf('\n  },', idx);
  if (start < 0 || end < 0) return null;
  end += '\n  },'.length;
  if (src[end] === '\n') end++;
  return [start, end];
}

// Compute all ranges on the ORIGINAL source, sort by start desc, splice
const ranges = [];
for (const h of DELETE_HANDLES) {
  const r = blockRange(src, h);
  if (r) {
    ranges.push({handle: h, start: r[0], end: r[1]});
    console.log(`  ✓ queued: ${h} (range ${r[0]}-${r[1]})`);
  } else {
    console.log(`  !! ${h} not found`);
  }
}
// Reverse-order splice
ranges.sort((a, b) => b.start - a.start);
for (const {start, end} of ranges) {
  src = src.slice(0, start) + src.slice(end);
}
console.log(`  Deleted ${ranges.length} blocks cleanly\n`);

// ── Insert Medicube Bundle ──────────────────────────────────────────────────

const medicubeBundle = `  {
    handle: 'the-medicube-bundle',
    ritualNumber: null,
    ritualName: 'The Medicube Bundle',
    brand: 'Medicube',
    name: 'The Medicube Bundle',
    subtitle: '5 PDRN Pink heroes \u2014 save 18%',
    price: 94.00,
    compareAtPrice: 113.99,
    currency: 'USD',
    description:
      'Five Medicube PDRN heroes, one ceremony. The gel mask to begin. The night-wrapping to seal. The peptide serum to restore, the milky toner to prepare, the tone-up sun to protect. Curated into a single ritual, priced as one \u2014 18% off the sum of its parts.',
    keyIngredient: 'Salmon PDRN + Peptides + Niacinamide + Collagen',
    howToUse:
      'Begin the ritual with the Milky Toner after cleansing. Press in the Peptide Serum. Apply the Night Wrapping Mask 2\u20133 times per week as your final evening step, or use the Gel Mask for an immediate hydration surge. By day, finish with the Tone-Up Sun Cream.',
    format: 'Bundle',
    concern: 'Complete PDRN ritual',
    skinType: 'All skin types',
    heroColor: '#C9928A',
    image: '/images/products/medicube-pdrn-caffeine-wrapping.jpg',
    collection: 'bundle',
    tags: ['bundle', 'medicube', 'pdrn', 'featured'],
    socialProof: '5 products \u00b7 Save $19.99 vs individual \u00b7 Includes gel mask, night wrap, serum, toner, SPF',
    bundleIncludes: [
      'PDRN Collagen Gel Mask Set (4 sheets)',
      'Collagen Night Wrapping Mask (75ml)',
      'PDRN Peptide Serum / Elixir I (30ml)',
      'PDRN Niacinamide Milky Toner / Elixir III (150ml)',
      'PDRN Tone-Up Sun Cream SPF50+ (50ml)',
    ],
    savings: 19.99,
    savingsPercent: 18,
  },
`;

// Insert before the "── UNLISTED PRODUCTS" marker so it lands in the listed set
const insertionMarker = '  // \u2500\u2500 UNLISTED PRODUCTS';
const insertionIdx = src.indexOf(insertionMarker);
if (insertionIdx < 0) {
  console.error('Could not find UNLISTED PRODUCTS marker — inserting before closing ];');
  const closeIdx = src.lastIndexOf('];');
  src = src.slice(0, closeIdx) + medicubeBundle + src.slice(closeIdx);
} else {
  src = src.slice(0, insertionIdx) + medicubeBundle + src.slice(insertionIdx);
}

writeFileSync(FILE, src);
console.log('\n✓ wrote', FILE);
console.log('  line count:', src.split('\n').length);
