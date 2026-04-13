#!/usr/bin/env node
/**
 * Landing Cost Calculator — Maison Masque
 *
 * Calculates the true landed cost of every product sold to every destination,
 * using real wholesale costs (AWB), real shipping rates (E-Fulfill HK Y01 DDP),
 * real product weights, and real payment processing fees.
 *
 * Usage:
 *   node scripts/landing-cost.mjs                         # full matrix, all products × all destinations
 *   node scripts/landing-cost.mjs --product numbuzin      # filter by handle substring
 *   node scripts/landing-cost.mjs --dest AU               # filter by destination code
 *   node scripts/landing-cost.mjs --product medicube --dest AU
 *   node scripts/landing-cost.mjs --bundles               # show bundle economics
 *   node scripts/landing-cost.mjs --summary               # one-line-per-product overview
 *   node scripts/landing-cost.mjs --csv                   # CSV output for spreadsheets
 */

// ─── PRODUCT DATA (from products.ts + user-supplied wholesale costs) ────────

const PRODUCTS = [
  {handle: 'medicube-pdrn-gel-mask',       name: 'Ritual I — Medicube PDRN Gel Mask',     retail: 22, cogs: 6.71,  weight_g: 200},
  {handle: 'medicube-wrapping-mask',       name: 'Ritual II — Medicube Wrapping Mask',    retail: 26, cogs: 9.18,  weight_g: 135},
  {handle: 'abib-heartleaf-gummy-mask',    name: 'Ritual III — Abib Heartleaf Gummy',     retail: 28, cogs: 14.68, weight_g: 250},
  {handle: 'numbuzin-no3-pore-mask',       name: 'Ritual IV — Numbuzin No.3',             retail: 22, cogs: 6.08,  weight_g: 145},
  {handle: 'skin1004-centella-sleeping-pack', name: 'Ritual V — SKIN1004 Sleeping Pack',  retail: 20, cogs: 6.84,  weight_g: 200},
  {handle: 'medicube-pdrn-peptide-serum',  name: 'Elixir I — Medicube Peptide Serum',     retail: 24, cogs: 7.55,  weight_g: 105},
  {handle: 'celdyque-pdrn-egf-serum',      name: 'Elixir II — CELDYQUE PDRN 12%',        retail: 20, cogs: 5.99,  weight_g: 105},
  {handle: 'medicube-pdrn-milky-toner',    name: 'Elixir III — Medicube Milky Toner',     retail: 22, cogs: 6.37,  weight_g: 200},
  {handle: 'beauty-of-joseon-relief-sun',  name: 'Morning Veil — BoJ Relief Sun',         retail: 22, cogs: 7.76,  weight_g: 90},
  {handle: 'heimish-artless-glow-tinted-sunscreen', name: 'Morning Veil — Heimish Glow Base', retail: 16, cogs: 8.24, weight_g: 80},
];

const BUNDLES = [
  {
    name: 'Evening Ritual (3 masks + 2 elixirs)',
    retail: 89,
    // Typical combo: Medicube Gel + Wrapping + Numbuzin + Medicube Peptide + Milky Toner
    cogs: 6.71 + 9.18 + 6.08 + 7.55 + 6.37,  // $35.89
    weight_g: 200 + 135 + 145 + 105 + 200,     // 785g
    items: 5,
  },
  {
    name: 'Complete Ritual (5 masks + 2 elixirs + 1 veil)',
    retail: 129,
    cogs: 43.49, // from user's wholesale data
    weight_g: 950,
    items: 8,
  },
];

// ─── E-FULFILL HK Y01 DDP SHIPPING RATES ───────────────────────────────────
// Pricing: per-parcel flat fee (HK$) + per-kg weight rate (HK$)
// Source: E-FULFILL HK - INTL Shipment Rate Card 2026 V2.5

const HKD_TO_USD = 0.128;

/**
 * @typedef {Object} Destination
 * @property {string} code
 * @property {string} name
 * @property {number} perKgHkd    - HK$/kg rate
 * @property {number} perParcelHkd - HK$/parcel flat fee
 * @property {number} vatPct      - VAT % (0 if no VAT or DDP-inclusive)
 * @property {string} deliveryDays
 * @property {string} service     - Y01 DDP or E-COM DDU
 */

/** @type {Destination[]} */
const DESTINATIONS = [
  // Primary launch markets
  {code: 'AU', name: 'Australia',            perKgHkd: 128, perParcelHkd: 34, vatPct: 0,  deliveryDays: '9-13',  service: 'Y01 DDP'},
  {code: 'NZ', name: 'New Zealand',          perKgHkd: 140, perParcelHkd: 34, vatPct: 0,  deliveryDays: '8-15',  service: 'Y01 DDP'},
  {code: 'SG', name: 'Singapore',            perKgHkd: 75,  perParcelHkd: 24, vatPct: 9,  deliveryDays: '3-5',   service: 'Y01 DDP'},
  {code: 'MY', name: 'Malaysia',             perKgHkd: 56,  perParcelHkd: 18, vatPct: 0,  deliveryDays: '5-8',   service: 'Y01 DDP'},
  {code: 'TH', name: 'Thailand',             perKgHkd: 56,  perParcelHkd: 18, vatPct: 7,  deliveryDays: '5-8',   service: 'Y01 DDP'},
  {code: 'PH', name: 'Philippines',          perKgHkd: 82,  perParcelHkd: 24, vatPct: 12, deliveryDays: '7-10',  service: 'Y01 DDP'},
  {code: 'AE', name: 'UAE',                  perKgHkd: 98,  perParcelHkd: 34, vatPct: 5,  deliveryDays: '7-10',  service: 'Y01 DDP'},
  {code: 'CA', name: 'Canada',               perKgHkd: 135, perParcelHkd: 33, vatPct: 0,  deliveryDays: '8-14',  service: 'Y01 DDP'},
  {code: 'HK', name: 'Hong Kong',            perKgHkd: 0,   perParcelHkd: 0,  vatPct: 0,  deliveryDays: '1-2',   service: 'Local'},
  // Future markets (kept for modelling)
  {code: 'UK', name: 'United Kingdom',       perKgHkd: 85,  perParcelHkd: 32, vatPct: 0,  deliveryDays: '5-8',   service: 'Y01 DDP'},
  {code: 'US', name: 'United States',        perKgHkd: 135, perParcelHkd: 34, vatPct: 0,  deliveryDays: '10-14', service: 'Y01 DDP'},
  {code: 'DE', name: 'Germany',              perKgHkd: 95,  perParcelHkd: 34, vatPct: 19, deliveryDays: '6-10',  service: 'Y01 DDP'},
  {code: 'FR', name: 'France',               perKgHkd: 108, perParcelHkd: 34, vatPct: 20, deliveryDays: '6-10',  service: 'Y01 DDP'},
];

// ─── COST CONSTANTS ─────────────────────────────────────────────────────────

const PAYMENT_PROCESSING_PCT = 0.029;  // Stripe / Shopify Payments
const PAYMENT_PROCESSING_FLAT = 0.30;  // per transaction
const PACKAGING_COST_USD = 0.50;       // per parcel (box, tissue, tape)

// ─── CALCULATOR ─────────────────────────────────────────────────────────────

function calcShippingUsd(weightKg, dest) {
  const hkd = dest.perParcelHkd + (weightKg * dest.perKgHkd);
  return hkd * HKD_TO_USD;
}

function calcLandedCost(product, dest) {
  const weightKg = product.weight_g / 1000;
  const shipping = calcShippingUsd(weightKg, dest);
  const paymentFees = (product.retail * PAYMENT_PROCESSING_PCT) + PAYMENT_PROCESSING_FLAT;
  // VAT on DDP: sender pays VAT on the retail value for EU/SG/TH/PH/AE destinations
  const vatCost = product.retail * (dest.vatPct / 100);

  const totalCost = product.cogs + shipping + paymentFees + PACKAGING_COST_USD + vatCost;
  const grossProfit = product.retail - totalCost;
  const marginPct = (grossProfit / product.retail) * 100;

  return {
    retail: product.retail,
    cogs: product.cogs,
    shipping,
    paymentFees,
    packaging: PACKAGING_COST_USD,
    vat: vatCost,
    totalCost,
    grossProfit,
    marginPct,
    profitable: grossProfit > 0,
  };
}

function calcBundleLandedCost(bundle, dest) {
  const weightKg = bundle.weight_g / 1000;
  const shipping = calcShippingUsd(weightKg, dest);
  const paymentFees = (bundle.retail * PAYMENT_PROCESSING_PCT) + PAYMENT_PROCESSING_FLAT;
  const vatCost = bundle.retail * (dest.vatPct / 100);

  const totalCost = bundle.cogs + shipping + paymentFees + PACKAGING_COST_USD + vatCost;
  const grossProfit = bundle.retail - totalCost;
  const marginPct = (grossProfit / bundle.retail) * 100;

  return {
    retail: bundle.retail,
    cogs: bundle.cogs,
    shipping,
    paymentFees,
    packaging: PACKAGING_COST_USD,
    vat: vatCost,
    totalCost,
    grossProfit,
    marginPct,
    profitable: grossProfit > 0,
    shippingPerItem: shipping / bundle.items,
  };
}

// ─── FORMATTERS ─────────────────────────────────────────────────────────────

function $(n) { return n >= 0 ? `$${n.toFixed(2)}` : `-$${Math.abs(n).toFixed(2)}`; }
function pct(n) { return `${n.toFixed(1)}%`; }
function pad(s, n) { return String(s).padEnd(n); }
function rpad(s, n) { return String(s).padStart(n); }

function statusIcon(marginPct) {
  if (marginPct >= 40) return '🟢';
  if (marginPct >= 20) return '🟡';
  if (marginPct >= 0)  return '🟠';
  return '🔴';
}

// ─── OUTPUT MODES ───────────────────────────────────────────────────────────

function printDetailedProduct(product, dest) {
  const c = calcLandedCost(product, dest);
  console.log(`
  ${product.name}  →  ${dest.name} (${dest.code})
  ─────────────────────────────────────────────
  Retail price:       ${rpad($(c.retail), 10)}
  COGS (wholesale):  ${rpad('-' + $(c.cogs), 10)}
  Shipping (${dest.code}):     ${rpad('-' + $(c.shipping), 10)}  (${product.weight_g}g via ${dest.service})
  Payment fees:      ${rpad('-' + $(c.paymentFees), 10)}  (2.9% + $0.30)
  Packaging:         ${rpad('-' + $(c.packaging), 10)}${c.vat > 0 ? `\n  VAT (${dest.vatPct}%):        ${rpad('-' + $(c.vat), 10)}` : ''}
  ─────────────────────────────────────────────
  Net profit:        ${rpad($(c.grossProfit), 10)}  ${statusIcon(c.marginPct)}
  Net margin:        ${rpad(pct(c.marginPct), 10)}
  ${!c.profitable ? '\n  ⚠  THIS PRODUCT LOSES MONEY ON STANDALONE ORDERS TO ' + dest.code : ''}
  Breakeven price:   ${rpad($(c.totalCost), 10)}`);
}

function printMatrix(products, destinations) {
  // Header
  const nameW = 42;
  const colW = 12;
  let header = pad('Product', nameW) + ' | ' + pad('Retail', 7);
  for (const d of destinations) header += ' | ' + pad(d.code, colW);
  console.log('\n' + header);
  console.log('─'.repeat(header.length));

  for (const p of products) {
    let row = pad(p.name.substring(0, nameW - 1), nameW) + ' | ' + rpad($(p.retail), 7);
    for (const d of destinations) {
      const c = calcLandedCost(p, d);
      const cell = `${statusIcon(c.marginPct)} ${$(c.grossProfit)} ${pct(c.marginPct)}`;
      row += ' | ' + pad(cell, colW);
    }
    console.log(row);
  }
}

function printSummary(products, destinations) {
  console.log('\n━━━ LANDING COST SUMMARY ━━━\n');
  console.log(pad('Product', 42) + ' | ' + pad('Retail', 7) + ' | ' + pad('COGS', 7) + ' | ' + pad('Best Dest', 12) + ' | ' + pad('Best Margin', 12) + ' | ' + pad('Worst Dest', 12) + ' | ' + pad('Worst Margin', 12));
  console.log('─'.repeat(120));

  for (const p of products) {
    let best = {marginPct: -Infinity, dest: null, profit: 0};
    let worst = {marginPct: Infinity, dest: null, profit: 0};

    for (const d of destinations) {
      const c = calcLandedCost(p, d);
      if (c.marginPct > best.marginPct) best = {marginPct: c.marginPct, dest: d, profit: c.grossProfit};
      if (c.marginPct < worst.marginPct) worst = {marginPct: c.marginPct, dest: d, profit: c.grossProfit};
    }

    console.log(
      pad(p.name.substring(0, 41), 42) + ' | ' +
      rpad($(p.retail), 7) + ' | ' +
      rpad($(p.cogs), 7) + ' | ' +
      pad(`${statusIcon(best.marginPct)} ${best.dest.code} ${$(best.profit)}`, 12) + ' | ' +
      pad(pct(best.marginPct), 12) + ' | ' +
      pad(`${statusIcon(worst.marginPct)} ${worst.dest.code} ${$(worst.profit)}`, 12) + ' | ' +
      pad(pct(worst.marginPct), 12)
    );
  }
}

function printBundles(destinations) {
  console.log('\n━━━ BUNDLE ECONOMICS ━━━\n');

  for (const bundle of BUNDLES) {
    console.log(`\n  ${bundle.name}`);
    console.log(`  Retail: ${$(bundle.retail)} | COGS: ${$(bundle.cogs)} | Weight: ${bundle.weight_g}g | Items: ${bundle.items}`);
    console.log('  ' + '─'.repeat(80));
    console.log('  ' + pad('Destination', 15) + pad('Shipping', 10) + pad('/item', 8) + pad('VAT', 8) + pad('Total Cost', 12) + pad('Profit', 10) + pad('Margin', 8) + 'Status');
    console.log('  ' + '─'.repeat(80));

    for (const d of destinations) {
      const c = calcBundleLandedCost(bundle, d);
      console.log('  ' +
        pad(d.code + ' ' + d.name, 15) +
        pad($(c.shipping), 10) +
        pad($(c.shippingPerItem), 8) +
        pad(c.vat > 0 ? $(c.vat) : '—', 8) +
        pad($(c.totalCost), 12) +
        pad($(c.grossProfit), 10) +
        pad(pct(c.marginPct), 8) +
        statusIcon(c.marginPct)
      );
    }
  }
}

function printCsv(products, destinations) {
  const headers = ['handle', 'name', 'retail', 'cogs', 'weight_g'];
  for (const d of destinations) {
    headers.push(`${d.code}_shipping`, `${d.code}_vat`, `${d.code}_total_cost`, `${d.code}_profit`, `${d.code}_margin_pct`, `${d.code}_profitable`);
  }
  console.log(headers.join(','));

  for (const p of products) {
    const row = [p.handle, `"${p.name}"`, p.retail, p.cogs, p.weight_g];
    for (const d of destinations) {
      const c = calcLandedCost(p, d);
      row.push(c.shipping.toFixed(2), c.vat.toFixed(2), c.totalCost.toFixed(2), c.grossProfit.toFixed(2), c.marginPct.toFixed(1), c.profitable);
    }
    console.log(row.join(','));
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const productFilter = args.find((_, i, a) => a[i - 1] === '--product');
const destFilter = args.find((_, i, a) => a[i - 1] === '--dest');
const showBundles = args.includes('--bundles');
const showSummary = args.includes('--summary');
const showCsv = args.includes('--csv');

const filteredProducts = productFilter
  ? PRODUCTS.filter(p => p.handle.includes(productFilter) || p.name.toLowerCase().includes(productFilter.toLowerCase()))
  : PRODUCTS;

// Default to primary launch markets only (exclude UK/US/DE/FR unless --dest specifies or --all)
const showAll = args.includes('--all');
const primaryCodes = new Set(['AU', 'NZ', 'SG', 'MY', 'TH', 'PH', 'AE', 'CA', 'HK']);
const filteredDests = destFilter
  ? DESTINATIONS.filter(d => d.code === destFilter.toUpperCase())
  : showAll
    ? DESTINATIONS
    : DESTINATIONS.filter(d => primaryCodes.has(d.code));

if (filteredProducts.length === 0) {
  console.error(`No products matched filter "${productFilter}"`);
  process.exit(1);
}
if (filteredDests.length === 0) {
  console.error(`No destinations matched filter "${destFilter}"`);
  process.exit(1);
}

// Output
console.log('━━━ MAISON MASQUE — LANDING COST CALCULATOR ━━━');
console.log(`Products: ${filteredProducts.length} | Destinations: ${filteredDests.length} | HKD/USD: ${HKD_TO_USD}`);
console.log(`Payment: ${PAYMENT_PROCESSING_PCT * 100}% + $${PAYMENT_PROCESSING_FLAT} | Packaging: $${PACKAGING_COST_USD}/parcel`);

if (showCsv) {
  printCsv(filteredProducts, filteredDests);
} else if (showSummary) {
  printSummary(filteredProducts, filteredDests);
} else if (filteredProducts.length === 1 && filteredDests.length === 1) {
  // Single product × single destination → detailed view
  printDetailedProduct(filteredProducts[0], filteredDests[0]);
} else if (filteredProducts.length === 1) {
  // Single product → detailed for each destination
  for (const d of filteredDests) {
    printDetailedProduct(filteredProducts[0], d);
  }
} else {
  // Matrix view
  printMatrix(filteredProducts, filteredDests);
}

if (showBundles || (!showCsv && !productFilter)) {
  printBundles(filteredDests);
}

// Legend
if (!showCsv) {
  console.log('\n  Legend: 🟢 ≥40% margin  🟡 20-39%  🟠 0-19%  🔴 negative');
  console.log('  All shipping via E-Fulfill HK Y01 DDP (duties paid by sender)');
  console.log('  VAT charged on retail value for applicable destinations');
}
