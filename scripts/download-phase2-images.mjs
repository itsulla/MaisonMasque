#!/usr/bin/env node
/**
 * Download Phase 2 product images locally.
 *
 * Pulls the 16 images from brand CDNs (same URLs we fed to Shopify during the
 * catalogue-expansion populate) into public/images/products/{handle}.{ext}
 * so the hardcoded paths in app/lib/products.ts resolve to real files.
 *
 * Usage:
 *   node scripts/download-phase2-images.mjs           # download missing only
 *   node scripts/download-phase2-images.mjs --force   # re-download even if present
 */

import {writeFile, mkdir, stat} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'images', 'products');
const FORCE = process.argv.includes('--force');

// (filename, url) — filename matches the `image:` path in products.ts.
const IMAGES = [
  ['medicube-pdrn-tension-mask.png',          'https://kiokii.com/cdn/shop/files/medicube-pdrn-pink-tension-up-mask-4pcsmedicubekiokii-and-5077302.png?v=1772575544&width=1024'],
  ['medicube-pdrn-caffeine-wrapping.jpg',     'https://medicube.us/cdn/shop/files/PDRN_00_14c0be0f-debd-4d9d-a31f-0172cab531d5.jpg?v=1753148581'],
  ['medicube-pdrn-bubble-serum.jpg',          'https://medicube.us/cdn/shop/files/PDRN_00_303f5926-2524-4b0f-8ba4-7857fb459697.jpg?v=1765522697'],
  ['medicube-pdrn-one-day-serum.jpg',         'https://medicube.us/cdn/shop/files/PDRN_00_2.jpg?v=1740729152'],
  ['medicube-pdrn-whip-cleanser.jpg',         'https://medicube.us/cdn/shop/files/PDRN_00_1.jpg?v=1749430365'],
  ['medicube-pdrn-cica-toner.jpg',            'https://cdn.shopify.com/s/files/1/0267/7676/4606/files/Medicube_PDRN_Toner_1.png?v=1760352304'],
  ['medicube-pdrn-toner-pad.jpg',             'https://medicube.us/cdn/shop/files/PDRN_00_059e7f2e-0447-4206-9ca8-dbac60cf64f0.jpg?v=1747964535'],
  ['medicube-pdrn-sun-cream.png',             'https://cdn-image.oliveyoung.com/prdtImg/1148/b4c5cd12-8470-4336-9874-ecf0ae82b342.png'],
  ['medicube-pdrn-eye-cream.jpg',             'https://medicube.us/cdn/shop/files/PDRN_0.jpg?v=1741762112'],
  ['medicube-pdrn-hyaluronic-cream.webp',     'https://kiokii.com/cdn/shop/files/medicube-pdrn-pink-hyaluronic-moisturizing-cream-50mlmedicubekiokii-and-417500.webp?v=1771618651&width=1024'],
  ['centellian24-madeca-pdrn.jpg',            'https://centellian24.com/cdn/shop/files/Centellian24_Thumbnail_PDRN.jpg?v=1776213155'],
  ['centellian24-time-reverse-zero.jpg',      'https://centellian24.com/cdn/shop/files/centellian24-madeca-cream-time-reverse-zero-80ml_001_grande.jpg?v=1751432654'],
  ['centellian24-mela-capture-cream.jpg',     'https://d1flfk77wl2xk4.cloudfront.net/Assets/centellian24-madeca-mela-capture-ampoule-capsule-cream-55ml/94/044/XXL_p0220604494.jpg'],
  ['centellian24-pdrn-eye-cream.jpg',         'https://d1flfk77wl2xk4.cloudfront.net/Assets/centellian24-360-shot-pdrn-lifting-eye-cream-30ml/64/846/XXL_p0222984664.jpg'],
  ['anua-pdrn-ha-capsule-serum.png',          'https://anua.global/cdn/shop/files/anua-us-ampoule-serum-pdrn-hyaluronic-acid-capsule-100-serum-pdrn-hyaluronic-acid-capsule-100-serum-1210969147.png?v=1765516041&width=2048'],
  ['mixsoon-bean-cleansing-oil.png',          'https://mixsoon.us/cdn/shop/files/cleansingoilbestsellers.png?v=1766130512'],
];

async function fileExists(path) {
  try { await stat(path); return true; } catch { return false; }
}

async function download(filename, url) {
  const dest = join(OUT, filename);
  if (!FORCE && (await fileExists(dest))) {
    return {filename, status: 'skip', size: 0};
  }
  const res = await fetch(url, {
    headers: {
      // Some CDNs (Olive Young, Shopify asset CDNs) reject empty UAs
      'User-Agent': 'Mozilla/5.0 (Maison Masque asset mirror)',
      'Accept': 'image/webp,image/png,image/jpeg,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    return {filename, status: `fail ${res.status}`, size: 0};
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return {filename, status: 'ok', size: buf.length};
}

async function main() {
  await mkdir(OUT, {recursive: true});
  console.log(`Downloading ${IMAGES.length} Phase 2 product images → ${OUT}`);
  console.log(FORCE ? '(--force: overwriting existing)' : '(skipping files already present)');
  console.log('');

  let ok = 0, skip = 0, fail = 0, totalBytes = 0;
  for (const [name, url] of IMAGES) {
    try {
      const r = await download(name, url);
      if (r.status === 'ok') {
        ok++; totalBytes += r.size;
        console.log(`  ✓ ${name.padEnd(48)} ${(r.size / 1024).toFixed(1)} KB`);
      } else if (r.status === 'skip') {
        skip++;
        console.log(`    ${name.padEnd(48)} (exists, skipped)`);
      } else {
        fail++;
        console.log(`  ✗ ${name.padEnd(48)} ${r.status}`);
      }
    } catch (err) {
      fail++;
      console.log(`  ✗ ${name.padEnd(48)} ${err.message}`);
    }
  }

  console.log('');
  console.log(`Summary: ${ok} downloaded · ${skip} skipped · ${fail} failed · ${(totalBytes / 1024 / 1024).toFixed(2)} MB total`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
