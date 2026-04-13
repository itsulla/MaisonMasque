#!/usr/bin/env node
/**
 * Populate Shopify Store — Maison Masque
 *
 * Creates all products in the Shopify Admin using the Admin REST API,
 * matching the exact handles, prices, descriptions, and images from products.ts.
 * Also creates collections and assigns products.
 *
 * Usage:
 *   node scripts/populate-shopify.mjs              # create all products + collections
 *   node scripts/populate-shopify.mjs --dry        # preview what would be created
 *   node scripts/populate-shopify.mjs --delete-all # remove all products (DANGEROUS)
 */

import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load env ─────────────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = join(__dirname, '..', '.env');
  const content = readFileSync(envPath, 'utf-8');
  const vars = {};
  for (const line of content.split('\n')) {
    const match = line.match(/^(\w+)="?([^"]*)"?$/);
    if (match) vars[match[1]] = match[2];
  }
  return vars;
}

const env = loadEnv();
const SHOP = env.PUBLIC_STORE_DOMAIN;
const TOKEN = env.PRIVATE_STOREFRONT_API_TOKEN;
const API_VERSION = '2024-10';
const BASE_URL = `https://${SHOP}/admin/api/${API_VERSION}`;
const SITE_URL = 'https://maisonmasque.com';

if (!SHOP || !TOKEN) {
  console.error('Missing SHOP or TOKEN in .env');
  process.exit(1);
}

// ── Product Data (mirrors products.ts) ───────────────────────────────────────

const PRODUCTS = [
  {
    handle: 'medicube-pdrn-gel-mask',
    title: 'PDRN Pink Collagen Gel Mask',
    vendor: 'Medicube',
    product_type: 'Sheet Mask',
    body_html: '<p>A colour-changing hydrogel infused with salmon PDRN and low-molecular collagen. Apply as pink, remove when transparent — your skin has absorbed every drop.</p><p><strong>Key Ingredients:</strong> Salmon PDRN + Hydrolysed Collagen + Niacinamide</p><p><strong>How to Use:</strong> Overnight: apply at the end of your skincare routine, leave on overnight, remove in the morning. Daytime: apply after toner and serum, leave on 3–4 hours or until the mask turns transparent.</p>',
    tags: ['ritual', 'hydrogel', 'pdrn', 'collagen', 'medicube', 'Ritual I', 'Restore'],
    price: '22.00',
    compare_at_price: '28.00',
    image_filename: 'ritual-1-restore.jpg',
    collection: 'the-five-rituals',
  },
  {
    handle: 'medicube-wrapping-mask',
    title: 'Collagen Night Wrapping Mask',
    vendor: 'Medicube',
    product_type: 'Wrapping Mask',
    body_html: '<p>Apply as a clear gel. It dries to a weightless film that wraps your skin in collagen while you sleep. Peel away in the morning to reveal plumper, firmer skin.</p><p><strong>Key Ingredients:</strong> Hydrolysed Collagen + Ceramide NP + Adenosine</p><p><strong>How to Use:</strong> After cleansing and toning, apply an even layer over face avoiding eyebrows, hairline, eyes and lips. Let dry ~15 minutes, then sleep. In the morning, peel from the edges or rinse with lukewarm water. Use 3–4 times per week.</p>',
    tags: ['ritual', 'wrapping-mask', 'collagen', 'overnight', 'medicube', 'Ritual II', 'Renew'],
    price: '26.00',
    compare_at_price: '32.00',
    image_filename: 'ritual-2-renew.jpg',
    collection: 'the-five-rituals',
  },
  {
    handle: 'abib-heartleaf-gummy-mask',
    title: 'Heartleaf Gummy Sheet Mask',
    vendor: 'Abib',
    product_type: 'Sheet Mask',
    body_html: '<p>A high-adhesion microfibre sheet steeped in heartleaf extract and Abib\'s Micro TECA cica complex. The gummy-textured sheet clings to every curve of the face, while liposome-encapsulated actives deliver a fresh, non-sticky, long-lasting calm.</p><p><strong>Key Ingredients:</strong> Heartleaf (Houttuynia Cordata) + Micro TECA Cica Complex + Microfibre Gummy Sheet</p><p><strong>How to Use:</strong> After cleansing and toning, apply the gummy sheet to the face avoiding eye and lip areas. Smooth outward, pressing the microfibre into the skin. Leave for 15–20 minutes. Remove and pat the remaining ampoule essence into the skin.</p>',
    tags: ['ritual', 'sheet-mask', 'heartleaf', 'cica', 'calming', 'abib', 'Ritual III', 'Calm'],
    price: '28.00',
    compare_at_price: '40.00',
    image_filename: 'ritual-3-calm.jpg',
    collection: 'the-five-rituals',
  },
  {
    handle: 'numbuzin-no3-pore-mask',
    title: 'No.3 Tingle-Pore Softening Sheet Mask',
    vendor: 'Numbuzin',
    product_type: 'Sheet Mask',
    body_html: '<p>The glass skin ritual. A tingling, pore-softening sheet mask that refines texture, tightens pores, and reveals the luminous, poreless finish that defines Korean skincare.</p><p><strong>Key Ingredients:</strong> AHA/BHA/PHA + Centella Asiatica + 42% Bifida Ferment Lysate + 21% Galactomyces Ferment Filtrate</p><p><strong>How to Use:</strong> After cleansing, apply mask to face avoiding eyes and lips. A gentle tingle is normal — this means the acids are working. Leave for 15–20 minutes. Remove and pat remaining essence into skin. Use 2–3 times per week.</p>',
    tags: ['ritual', 'sheet-mask', 'pore-care', 'glass-skin', 'numbuzin', 'Ritual IV', 'Refine'],
    price: '22.00',
    compare_at_price: '28.00',
    image_filename: 'ritual-4-illuminate.jpg',
    collection: 'the-five-rituals',
  },
  {
    handle: 'skin1004-centella-sleeping-pack',
    title: 'Madagascar Centella Hyalu-Cica Sleeping Pack',
    vendor: 'SKIN1004',
    product_type: 'Sleeping Pack',
    body_html: '<p>An overnight ceremony of repair. Madagascar-sourced Centella Asiatica (40.9%) and triple hyaluronic acid complex work through the night to calm, hydrate, and rebuild — so you wake to skin that feels renewed.</p><p><strong>Key Ingredients:</strong> Madagascar Centella Asiatica + Hyaluronic Acid + Cica + Melatonin</p><p><strong>How to Use:</strong> As the final step of your evening ritual, apply a generous layer over face. Sleep. Rinse off in the morning. Use nightly or 2–3 times per week.</p>',
    tags: ['ritual', 'sleeping-pack', 'overnight', 'centella', 'skin1004', 'Ritual V', 'Soothe'],
    price: '20.00',
    compare_at_price: '26.00',
    image_filename: 'ritual-5-soothe.png',
    collection: 'the-five-rituals',
  },
  {
    handle: 'beauty-of-joseon-relief-sun',
    title: 'Relief Sun',
    vendor: 'Beauty of Joseon',
    product_type: 'Sunscreen',
    body_html: '<p>A weightless sun shield that melts into skin like a serum. 30% Rice extract brightens while probiotics strengthen your skin\'s natural barrier. SPF50+ PA++++ verified at 52.5 (Korea) and 63.1 (Spain).</p><p><strong>Key Ingredients:</strong> Rice Extract (30%) + Probiotics + Chemical UV Filters (SPF50+ PA++++)</p><p><strong>How to Use:</strong> Apply generously as the last step of your morning skincare routine. Reapply every 2 hours during prolonged sun exposure.</p>',
    tags: ['morning-veil', 'sunscreen', 'spf', 'beauty-of-joseon', 'Morning Veil'],
    price: '22.00',
    compare_at_price: '28.00',
    image_filename: 'morning-veil-relief-sun.jpg',
    collection: 'morning-veil',
  },
  {
    handle: 'heimish-artless-glow-tinted-sunscreen',
    title: 'Artless Glow Base',
    vendor: 'Heimish',
    product_type: 'Sunscreen',
    body_html: '<p>A luminous makeup base with built-in sun protection. Natural pearl delivers a soft, dewy glow while rosehip, marjoram, thyme and peppermint botanicals keep the skin comfortable. SPF50+ PA++++.</p><p><strong>Key Ingredients:</strong> Pearl complex (Mica + Synthetic Fluorphlogopite) + Rosehip + Thyme + Chemical UV Filters</p><p><strong>How to Use:</strong> Apply evenly over face as the final step of your morning routine, after moisturiser and before makeup.</p>',
    tags: ['morning-veil', 'sunscreen', 'spf', 'glow-primer', 'heimish', 'Morning Veil'],
    price: '18.00',
    compare_at_price: '24.00',
    image_filename: 'morning-veil-artless-glow.jpg',
    collection: 'morning-veil',
  },
  {
    handle: 'medicube-pdrn-peptide-serum',
    title: 'Elixir I — Regenerate',
    vendor: 'Medicube',
    product_type: 'Elixir',
    body_html: '<p>A lightweight elixir that delivers clinic-grade PDRN deep into the skin. Salmon-derived DNA fragments stimulate your skin\'s natural repair, while a five-peptide complex, niacinamide and adenosine work to firm, brighten and smooth.</p><p><strong>Key Ingredients:</strong> Salmon PDRN + 5-Peptide Complex + Niacinamide + Adenosine</p><p><strong>How to Use:</strong> Apply morning and night on clean, dry skin. Spread evenly over face and neck with gentle patting. Follow with moisturiser.</p>',
    tags: ['elixir', 'pdrn', 'serum', 'medicube', 'Elixir I', 'Regenerate'],
    price: '24.00',
    compare_at_price: '32.00',
    image_filename: 'elixir-1-regenerate.jpg',
    collection: 'elixirs',
  },
  {
    handle: 'celdyque-pdrn-egf-serum',
    title: 'Elixir II — Fortify',
    vendor: 'CELDYQUE',
    product_type: 'Elixir',
    body_html: '<p>Our most potent elixir. At 120,000 ppm PDRN — a 12% concentration — this microneedling-grade serum pairs salmon DNA fragments with EGF, Volufiline™ and a multi-peptide complex for intensive regeneration.</p><p><strong>Key Ingredients:</strong> 12% PDRN Complex (120,000 ppm) + EGF + Volufiline™ + Multi-Peptides + Niacinamide 2%</p><p><strong>How to Use:</strong> Cleanse and tone, ensure skin is dry. Apply 2–3 drops to face and neck, gently massage until absorbed. Use morning and night.</p>',
    tags: ['elixir', 'pdrn', 'serum', 'egf', 'volufiline', 'celdyque', 'Elixir II', 'Fortify'],
    price: '20.00',
    compare_at_price: '26.00',
    image_filename: 'elixir-2-fortify.jpg',
    collection: 'elixirs',
  },
  {
    handle: 'medicube-pdrn-milky-toner',
    title: 'Elixir III — Illuminate',
    vendor: 'Medicube',
    product_type: 'Elixir',
    body_html: '<p>The daily PDRN ritual your skin drinks in. A milky, lightweight toner that delivers salmon-derived PDRN and niacinamide in a generous 150ml format — the foundation of every morning and evening practice.</p><p><strong>Key Ingredients:</strong> PDRN + Niacinamide + Ceramides</p><p><strong>How to Use:</strong> Dispense a generous amount onto clean hands or a cotton pad. Pat gently into skin after cleansing. Use morning and evening.</p>',
    tags: ['elixir', 'pdrn', 'toner', 'niacinamide', 'medicube', 'brightening', 'Elixir III', 'Illuminate'],
    price: '22.00',
    compare_at_price: '28.00',
    image_filename: 'elixir-3-illuminate.jpg',
    collection: 'elixirs',
  },
];

const COLLECTIONS = [
  {handle: 'the-five-rituals', title: 'The Five Rituals', body_html: '<p>Five masks. Five intentions. Each chosen from Korea\'s most revered houses.</p>'},
  {handle: 'elixirs',          title: 'The Elixirs',      body_html: '<p>PDRN elixirs to amplify your ritual practice.</p>'},
  {handle: 'morning-veil',     title: 'The Morning Veil',  body_html: '<p>Sun protection as the final step of your morning practice.</p>'},
];

// ── API helpers ──────────────────────────────────────────────────────────────

async function shopifyApi(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();

  if (!res.ok) {
    console.error(`  ✗ ${method} ${endpoint}: ${res.status}`);
    console.error(`    ${text.substring(0, 300)}`);
    return null;
  }

  // Rate limiting — Shopify allows 2 req/sec on Basic plan
  await new Promise(r => setTimeout(r, 600));

  return text ? JSON.parse(text) : {};
}

async function getExistingProducts() {
  const data = await shopifyApi('GET', '/products.json?limit=250&fields=id,handle');
  return data?.products ?? [];
}

async function getExistingCollections() {
  const data = await shopifyApi('GET', '/custom_collections.json?limit=50');
  return data?.custom_collections ?? [];
}

// ── Product creation ─────────────────────────────────────────────────────────

async function createProduct(p) {
  const imageUrl = `${SITE_URL}${p.image_filename.startsWith('/') ? '' : '/images/products/'}${p.image_filename}`;

  const payload = {
    product: {
      handle: p.handle,
      title: p.title,
      vendor: p.vendor,
      product_type: p.product_type,
      body_html: p.body_html,
      tags: p.tags.join(', '),
      status: 'active',
      variants: [
        {
          price: p.price,
          compare_at_price: p.compare_at_price,
          inventory_management: null, // don't track inventory
          requires_shipping: true,
          taxable: true,
          sku: p.handle,
        },
      ],
      images: [
        {src: imageUrl, alt: `${p.vendor} ${p.title} - Korean Skincare - Maison Masque`},
      ],
    },
  };

  return shopifyApi('POST', '/products.json', payload);
}

// ── Collection creation ──────────────────────────────────────────────────────

async function createCollection(c) {
  const payload = {
    custom_collection: {
      handle: c.handle,
      title: c.title,
      body_html: c.body_html,
      published: true,
    },
  };

  return shopifyApi('POST', '/custom_collections.json', payload);
}

async function addProductToCollection(collectionId, productId) {
  const payload = {
    collect: {
      collection_id: collectionId,
      product_id: productId,
    },
  };

  return shopifyApi('POST', '/collects.json', payload);
}

// ── Delete all (safety) ──────────────────────────────────────────────────────

async function deleteAllProducts() {
  const products = await getExistingProducts();
  console.log(`Deleting ${products.length} products...`);
  for (const p of products) {
    await shopifyApi('DELETE', `/products/${p.id}.json`);
    console.log(`  Deleted: ${p.handle}`);
  }
  const collections = await getExistingCollections();
  console.log(`Deleting ${collections.length} custom collections...`);
  for (const c of collections) {
    await shopifyApi('DELETE', `/custom_collections/${c.id}.json`);
    console.log(`  Deleted: ${c.handle}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry');
  const deleteAll = args.includes('--delete-all');

  console.log('━━━ MAISON MASQUE — SHOPIFY PRODUCT CREATOR ━━━');
  console.log(`Store: ${SHOP}`);
  console.log(`Products: ${PRODUCTS.length} | Collections: ${COLLECTIONS.length}`);
  console.log('');

  if (deleteAll) {
    console.log('⚠️  DELETING ALL PRODUCTS AND COLLECTIONS');
    await deleteAllProducts();
    console.log('Done.');
    return;
  }

  // Check for existing products
  const existing = await getExistingProducts();
  const existingHandles = new Set(existing.map(p => p.handle));

  if (dryRun) {
    console.log('[DRY RUN]\n');
    for (const p of PRODUCTS) {
      const status = existingHandles.has(p.handle) ? 'SKIP (exists)' : 'CREATE';
      console.log(`  ${status}: ${p.vendor} — ${p.title} (${p.handle}) @ $${p.price}`);
    }
    console.log('');
    for (const c of COLLECTIONS) {
      console.log(`  Collection: ${c.title} (${c.handle})`);
    }
    return;
  }

  // ── Create collections first ──────────────────────────────────────────
  console.log('Creating collections...');
  const existingCollections = await getExistingCollections();
  const collectionMap = {};

  for (const c of COLLECTIONS) {
    const existing = existingCollections.find(ec => ec.handle === c.handle);
    if (existing) {
      console.log(`  skip: ${c.title} (already exists, id: ${existing.id})`);
      collectionMap[c.handle] = existing.id;
      continue;
    }
    const result = await createCollection(c);
    if (result?.custom_collection) {
      collectionMap[c.handle] = result.custom_collection.id;
      console.log(`  ✓ Created: ${c.title} (id: ${result.custom_collection.id})`);
    }
  }

  // ── Create products ───────────────────────────────────────────────────
  console.log('\nCreating products...');
  const productMap = {};

  for (const p of PRODUCTS) {
    if (existingHandles.has(p.handle)) {
      const ex = existing.find(e => e.handle === p.handle);
      console.log(`  skip: ${p.title} (already exists, id: ${ex.id})`);
      productMap[p.handle] = ex.id;
      continue;
    }

    const result = await createProduct(p);
    if (result?.product) {
      productMap[p.handle] = result.product.id;
      console.log(`  ✓ Created: ${p.vendor} — ${p.title} @ $${p.price} (id: ${result.product.id})`);
    } else {
      console.log(`  ✗ Failed: ${p.title}`);
    }
  }

  // ── Assign products to collections ────────────────────────────────────
  console.log('\nAssigning products to collections...');

  for (const p of PRODUCTS) {
    const productId = productMap[p.handle];
    const collectionId = collectionMap[p.collection];

    if (!productId || !collectionId) {
      console.log(`  skip: ${p.handle} → ${p.collection} (missing id)`);
      continue;
    }

    const result = await addProductToCollection(collectionId, productId);
    if (result?.collect) {
      console.log(`  ✓ ${p.handle} → ${p.collection}`);
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Products created: ${Object.keys(productMap).length}`);
  console.log(`Collections created: ${Object.keys(collectionMap).length}`);
  console.log(`\nVerify at: https://${SHOP}/admin/products`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
