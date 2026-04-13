#!/usr/bin/env node
/**
 * Download-brand-assets
 *
 * Mirrors brand-sourced marketing imagery from each supplier's CDN into
 * `public/images/products/brand/{handle}/{role}-{n}.{ext}`. Run before launch
 * to bake the assets locally — hot-linking brand CDNs in production is fragile
 * (the Anua Heartleaf 77 case showed the CDN files outlive the product page,
 * but not forever).
 *
 * Usage:
 *   node scripts/download-brand-assets.mjs          # download everything
 *   node scripts/download-brand-assets.mjs medicube # filter by substring match
 *   node scripts/download-brand-assets.mjs --dry    # print what would happen
 *
 * Source of truth: BRAND_MATERIALS.md. The ASSET_MANIFEST below mirrors that
 * document — when you update one, update the other.
 */

import {mkdir, writeFile, stat} from 'node:fs/promises';
import {join, extname, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_BASE = join(ROOT, 'public', 'images', 'products', 'brand');

/**
 * @typedef {Object} AssetSpec
 * @property {string} role - hero|lifestyle|ingredient|clinical|texture|how-to|heritage|packaging
 * @property {string} url
 */
/**
 * @typedef {Object} ProductAssets
 * @property {string} handle
 * @property {string} brand
 * @property {AssetSpec[]} assets
 */

/** @type {ProductAssets[]} */
const ASSET_MANIFEST = [
  {
    handle: 'medicube-pdrn-gel-mask',
    brand: 'Medicube',
    assets: [
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_00_74658772-9986-43b0-b233-4dd4c8ab41b8.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/mask.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/th_PDRN_21c4fb42-38f8-450d-a708-70d6ad84dba2.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_01_e5237609-fd8c-4108-ba2b-bd101a8bd202.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_02_509768ff-5346-4248-aaf8-443cbd24cd28.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/1_109f304f-e451-4b0e-b1f5-cc4230747821.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_03.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_04.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/PDRN_2.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/PDRN_3.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_10.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_11.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_12.jpg'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_-4__2.jpg'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/PDRN_1.jpg'},
      {role: 'how-to', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/PDRN_4.jpg'},
    ],
  },
  {
    handle: 'medicube-wrapping-mask',
    brand: 'Medicube',
    assets: [
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/00_6d878aff-381d-4cd6-b9e1-d8b924225025.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/00_9431073e-bece-4754-be54-37732ddd6675.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/1_8eebab8c-2116-446e-a6bb-39bc668f24e9.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/01_1823c050-4a1c-4a12-ae1c-8a03cf397278.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/01_c28a2959-fca2-4ff5-9b40-1098a7fe1bfe.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/02_7030e20a-fe58-4f7b-80ac-8d98b1d6801e.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/03_870b4175-779e-4b15-823a-df0b1d50b618.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/02_1fb20f42-f085-475c-9b8f-d7d33711ec97.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/03_9136ccec-57c5-4edc-becb-6ef1c9c49b17.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/04_f2aa19f0-a804-4ce5-be0e-e201bfe1af5a.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/05_05511a3e-fec4-47e2-a62d-8736f6bfa830.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/06_bed0d55c-a761-408c-9451-74a861775fc1.jpg'},
      // The peel-off GIF — the hero texture moment for this product
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0140/7385/6100/files/wrapping2.gif'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/06_68b07fe5-5a64-4ba1-a59d-6faa74a88373.jpg'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/06_c345100f-ce41-4194-97bb-acdd4440dd51.jpg'},
      {role: 'how-to', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/07_d6c19538-7d36-40c8-9a6d-34af765308ad.jpg'},
      {role: 'how-to', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/08_7c70b2ad-82fa-4248-a351-06989edebc17.jpg'},
      {role: 'how-to', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/021.jpg'},
    ],
  },
  {
    handle: 'abib-heartleaf-gummy-mask',
    brand: 'Abib',
    assets: [
      // Hero packshots — confirmed from Abib's hero image naming convention
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_209be8a1-ae6f-46d0-9ec2-4d5a7f092583.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_1.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_2.jpg'},
      // ST-H_4 through ST-H_11 — Abib's long-form editorial tiles (mix of ingredient/claim/how-to)
      // Categorised conservatively as "ingredient" until visual inspection
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_4.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_5.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_6.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_8.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_9.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_10.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST-H_11.jpg'},
      // ST_thumb_* — additional lifestyle/variant crops
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST_thumb_02_9b6e48c6-0918-494e-a847-eb3606128815.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST_thumb_03_688e7da1-4f27-461f-a48a-6d6708698c74.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST_thumb_04_220fcda1-4423-44ec-a4fa-6bb55785d64c.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST_thumb_05_42875301-3c34-4f2e-86e4-3a9d07a32962.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST_thumb_06_63fe02a2-0bf8-4b61-afba-e8484e428042.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0539/0457/2611/files/ST_thumb_07_a1672c27-8a31-4ff8-a4e2-ee657ffa1aff.jpg'},
    ],
  },
  {
    handle: 'numbuzin-no3-pore-mask',
    brand: 'Numbuzin',
    assets: [
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/US__3_5__main.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/US__3_5__hover.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/US01__A____3__250604___PC_032e0f05-4bdc-459e-887d-186b45b9fb88.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/260114_________3__01.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/260114_________3__02.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/260114_________3__03.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/260114_________3__04.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/260114_________3__05.jpg'},
      {role: 'how-to', url: 'https://cdn.shopify.com/s/files/1/0573/3793/8117/files/260114_________3__06.jpg'},
    ],
  },
  {
    handle: 'skin1004-centella-sleeping-pack',
    brand: 'SKIN1004',
    assets: [
      {role: 'hero', url: 'https://www.skin1004.com/cdn/shop/products/skin1004-mask-pad-hyalu-cica-sleeping-pack-38642854985974.png'},
      {role: 'texture', url: 'https://www.skin1004.com/cdn/shop/products/skin1004-mask-pad-madagascar-centella-hyalu-cica-sleeping-pack-34557722689782.gif'},
      {role: 'lifestyle', url: 'https://www.skin1004.com/cdn/shop/products/skin1004-mask-pad-hyalu-cica-sleeping-pack-38409157214454.jpg'},
      {role: 'lifestyle', url: 'https://www.skin1004.com/cdn/shop/products/skin1004-mask-pad-hyalu-cica-sleeping-pack-38409157411062.jpg'},
      {role: 'lifestyle', url: 'https://www.skin1004.com/cdn/shop/products/skin1004-mask-pad-hyalu-cica-sleeping-pack-38609092608246.jpg'},
      {role: 'heritage', url: 'https://www.skin1004.com/cdn/shop/files/Sleeping_Pack_1.jpg'},
      {role: 'texture', url: 'https://www.skin1004.com/cdn/shop/files/Sleeping_Pack_2.jpg'},
      {role: 'how-to', url: 'https://www.skin1004.com/cdn/shop/files/Sleeping_Pack_3.jpg'},
      {role: 'ingredient', url: 'https://www.skin1004.com/cdn/shop/files/02._Hyalu-Cica_6cfd096f-b5f2-4bed-87cf-3cafa5002c52.jpg'},
    ],
  },
  {
    handle: 'beauty-of-joseon-relief-sun',
    brand: 'Beauty of Joseon',
    assets: [
      {role: 'hero', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/43/895/M_p0224389543.jpg'},
      {role: 'hero', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/37/895/M_p0224389537.jpg'},
      {role: 'hero', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/36/895/M_p0224389536.jpg'},
      {role: 'hero', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/61/895/M_p0224389561.jpg'},
      {role: 'lifestyle', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/37/308/L_g0221830837.jpg'},
      {role: 'lifestyle', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/38/308/L_g0221830838.jpg'},
      {role: 'ingredient', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/81/894/M_p0224389481.jpg'},
      {role: 'ingredient', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/85/894/M_p0224389485.jpg'},
      {role: 'ingredient', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/35/308/L_g0221830835.jpg'},
      {role: 'clinical', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/56/895/M_p0224389556.jpg'},
      {role: 'clinical', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/06/084/M_p0224408406.jpg'},
      {role: 'clinical', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/36/308/L_g0221830836.jpg'},
      {role: 'how-to', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/32/895/M_p0224389532.jpg'},
      {role: 'how-to', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/41/308/L_g0221830841.jpg'},
      {role: 'texture', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/73/895/M_p0224389573.jpg'},
      {role: 'texture', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/30/181/M_p0224318130.jpg'},
      {role: 'texture', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/45/895/M_p0224389545.jpg'},
      {role: 'heritage', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/95/834/L_p0162883495.jpg'},
      {role: 'heritage', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/29/361/M_p0215936129.jpg'},
    ],
  },
  {
    handle: 'heimish-artless-glow-tinted-sunscreen',
    brand: 'Heimish',
    assets: [
      {role: 'hero', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/big/20251128/0cd95d7e4bafc81c967fe879038d59fc.jpg'},
      {role: 'lifestyle', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/small/20251128/edc59742f55fc75a7e79e03fa1791906.jpg'},
      {role: 'lifestyle', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/extra/small/20251128/37251f2c5dbb4349b144b003caf82552.jpg'},
      {role: 'lifestyle', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/extra/small/20251128/4fa5b225c07f68b060e70baf6ff994aa.jpg'},
      {role: 'lifestyle', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/extra/small/20251128/5ca9874b229b7f38d7b0be3609e44161.jpg'},
      {role: 'lifestyle', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/extra/small/20251128/5e6975a7093d1e22339a0d50f1a537f7.jpg'},
      {role: 'lifestyle', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/extra/small/20251128/337190be15623f5618387259e7e29b11.jpg'},
      {role: 'lifestyle', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/extra/small/20251128/be2d30f3865a051379370be39db50422.jpg'},
      // 5-image detail stack — sliceable editorial blocks (inc. 2 animated GIFs)
      {role: 'ingredient', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/detail/%EA%B8%80%EB%A1%9C%EC%9A%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4/glowbase_1.jpg'},
      {role: 'texture', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/detail/%EA%B8%80%EB%A1%9C%EC%9A%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4/glowbase_2.gif'},
      {role: 'ingredient', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/detail/%EA%B8%80%EB%A1%9C%EC%9A%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4/glowbase_3.jpg'},
      {role: 'texture', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/detail/%EA%B8%80%EB%A1%9C%EC%9A%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4/glowbase_4.gif'},
      {role: 'ingredient', url: 'https://ecimg.cafe24img.com/pg2307b34327853033/eheimish/web/product/detail/%EA%B8%80%EB%A1%9C%EC%9A%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4/glowbase_5.jpg'},
    ],
  },
  {
    handle: 'medicube-pdrn-peptide-serum',
    brand: 'Medicube',
    assets: [
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_00_0623793f-64b8-47be-b16c-85d4875bfe30.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_01_afffce45-a253-43cc-a113-3bbb60bd4c32.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/pdrn_00_b13eca49-bafa-4a09-960e-6e5907261175.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/pdrn_01_15b30407-c3a3-46f6-8bcb-199d7ef716e5.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/pdrn_02_a8dc0fbe-8d59-4a5e-bb11-174ddf617276.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/pdrn_03_2fa71025-ea15-489a-b96a-f00be142ec36.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_06_2.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_07_2.jpg'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/pdrn_04_18585904-3e2e-4c53-b041-183b9e2c6491.jpg'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/pdrn_05_ccd7edf0-774f-4921-bcd8-8face164c203.jpg'},
      {role: 'how-to', url: 'https://themedicube.com.sg/cdn/shop/files/1_5f9f1f80-3411-49da-adc3-92267e890f0f.jpg'},
    ],
  },
  {
    handle: 'celdyque-pdrn-egf-serum',
    brand: 'CELDYQUE',
    assets: [
      // Brand-hosted single packshot
      {role: 'hero', url: 'https://celdyque.com/images/%EC%A0%9C%ED%92%88/Mask%20group.webp'},
      // YesStyle press-kit mirror — brand's own Korean PDP slides, redistributed
      {role: 'hero', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/93/502/XXL_p0218750293.jpg'},
      {role: 'ingredient', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/34/708/g0218870834_000.jpg'},
      {role: 'ingredient', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/34/708/g0218870834_001.jpg'},
      {role: 'ingredient', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/34/708/g0218870835.jpg'},
      {role: 'ingredient', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/34/708/g0218870836.jpg'},
      {role: 'clinical', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/34/708/g0218870837_000.jpg'},
      {role: 'clinical', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/34/708/g0218870837_001.jpg'},
      {role: 'texture', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/34/708/g0218870838_000.jpg'},
      {role: 'texture', url: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/34/708/g0218870838_001.jpg'},
    ],
  },
  {
    handle: 'anua-pdrn-ha-cream',
    brand: 'Anua',
    assets: [
      // 10 product gallery packshots from Shopify CDN — first 4 as hero, rest as lifestyle
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-1178755386.png'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-1173906789.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-pdrn-hyaluronic-acid-100-moisturizing-cream-1217453222.jpg'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-pdrn-hyaluronic-acid-100-moisturizing-cream-1217453221.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-1173906785.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-1173906782.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-1173906787.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-1173906784.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-1173906783.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-pdrn-hyaluronic-acid-100-moisturizing-cream-1173906772.jpg'},
      // Amazon A+ style hero banners used in PDP rich content — heritage feel
      {role: 'heritage', url: 'https://anua.com/cdn/shop/files/AMZ_Aplus_PC_PDRNHyaluronicAcid100MoisturizingCream_06-2_d67b0498-b6f2-4b84-84cb-2c0094d2719e.jpg'},
      {role: 'heritage', url: 'https://anua.com/cdn/shop/files/AMZ_Aplus_MO_PDRNHyaluronicAcid100MoisturizingCream_04-2.jpg'},
      {role: 'heritage', url: 'https://anua.com/cdn/shop/files/AMZ_Aplus_MO_PDRNHyaluronicAcid100MoisturizingCream_07.jpg'},
      // Ingredient infographic tiles
      {role: 'ingredient', url: 'https://anua.com/cdn/shop/files/PDRN_da0c8848-5cb7-4581-b6cd-1bc6f66cd2cf.png'},
      {role: 'ingredient', url: 'https://anua.com/cdn/shop/files/HY_a69fc4eb-1328-4105-b607-8a95ccaa45ea.png'},
      {role: 'ingredient', url: 'https://anua.com/cdn/shop/files/CO_7c5ed596-dc6c-4367-9800-b59af01fb265.png'},
      // Subsection tiles — "Powered by PDRN", "Synergy", "Youthful & Plump Look"
      {role: 'texture', url: 'https://anua.com/cdn/shop/files/sub01_09ef02e6-172b-4bbd-9e47-ae903bc01f14.png'},
      {role: 'texture', url: 'https://anua.com/cdn/shop/files/sub02_4f2592cd-556b-4395-93c1-ab4859f42d4f.png'},
      {role: 'texture', url: 'https://anua.com/cdn/shop/files/sub03_a81f3652-d755-4420-8c38-4f40a2ec9332.png'},
      // Closing brand banner
      {role: 'heritage', url: 'https://anua.com/cdn/shop/files/end_7518501f-f3bb-4a8d-bb1b-506a385a54ed.png'},
    ],
  },
  {
    handle: 'rejuran-turnover-ampoule',
    brand: 'Rejuran',
    assets: [
      // Primary packshots
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-main-zoom.webp'},
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/51aTCx9-7OL._SL1500.jpg'},
      // Sequenced gallery tiles — Rejuran does not label by category.
      // Conservative buckets below; re-sort after visual review.
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-1202603020737389600800-zoom.webp'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-2202603020737395220800-zoom.webp'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-3202603020737394520800-zoom.webp'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-4202603020737400800800-zoom.webp'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-5202603020737399860800-zoom.webp'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-6202603020737373610800-zoom.webp'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-7202603020737384290800-zoom.webp'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-8202603020737389110800-zoom.webp'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-9202603020737367830800-zoom.webp'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0581/4838/9018/files/s2974129-av-11202603020737383200800-zoom.webp'},
    ],
  },
  {
    handle: 'medicube-pdrn-milky-toner',
    brand: 'Medicube',
    assets: [
      {role: 'hero', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_00_f11333d4-d0fa-4f23-a4b9-34459ec1de07.jpg'},
      {role: 'hero', url: 'https://themedicube.com.sg/cdn/shop/files/PDRN_00_3a186a9e-bbbe-4a50-953e-52135678bf11.jpg'},
      {role: 'lifestyle', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_01_6ab3fe11-0881-4a46-8b37-b118894e747d.jpg'},
      {role: 'lifestyle', url: 'https://themedicube.com.sg/cdn/shop/files/PDRN_1_f11e46ed-98e9-4619-8a12-d4da8913d9fc.jpg'},
      {role: 'ingredient', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_02_6af2b50e-8066-4afb-affe-cd4f3f2eafd7.jpg'},
      {role: 'ingredient', url: 'https://themedicube.com.sg/cdn/shop/files/PDRN_2_509d7441-3495-4c3c-91eb-35adcad10c6f.jpg'},
      {role: 'clinical', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_03_e22fc7a8-cfc1-4e5a-87fe-ac9a3db3cc63.jpg'},
      {role: 'clinical', url: 'https://themedicube.com.sg/cdn/shop/files/PDRN_3_eb647b0c-b0f0-4963-a989-247d6d10b89b.jpg'},
      {role: 'texture', url: 'https://cdn.shopify.com/s/files/1/0156/3905/2336/files/PDRN_04_86ff4656-5e4a-489e-9a38-52fe69cbdc3c.jpg'},
      {role: 'texture', url: 'https://themedicube.com.sg/cdn/shop/files/PDRN_4_09f4103c-d1fa-46b1-bbf4-5cd7662069eb.jpg'},
      {role: 'how-to', url: 'https://themedicube.com.sg/cdn/shop/files/PDRN_6.jpg'},
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes('--dry');
const filter = args.find((a) => !a.startsWith('--'));

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function guessExtension(url) {
  const clean = url.split('?')[0];
  const ext = extname(clean).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) return ext;
  return '.jpg';
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function downloadOne(url, outPath) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif,*/*',
    },
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const buf = Buffer.from(await response.arrayBuffer());
  await writeFile(outPath, buf);
  return buf.length;
}

async function main() {
  const manifest = filter
    ? ASSET_MANIFEST.filter((p) => p.handle.includes(filter) || p.brand.toLowerCase().includes(filter.toLowerCase()))
    : ASSET_MANIFEST;

  if (manifest.length === 0) {
    console.error(`No products matched filter "${filter}"`);
    process.exit(1);
  }

  let total = 0;
  let ok = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (const product of manifest) {
    const productDir = join(OUT_BASE, product.handle);
    if (!dryRun) await mkdir(productDir, {recursive: true});

    console.log(`\n━━━ ${product.brand} · ${product.handle} ━━━`);

    // Count assets per role so we can give them stable numeric suffixes
    const roleCounter = new Map();

    for (const asset of product.assets) {
      total++;
      const n = (roleCounter.get(asset.role) ?? 0) + 1;
      roleCounter.set(asset.role, n);
      const ext = guessExtension(asset.url);
      const filename = `${asset.role}-${String(n).padStart(2, '0')}${ext}`;
      const outPath = join(productDir, filename);
      const shortPath = outPath.replace(ROOT + '/', '');

      if (dryRun) {
        console.log(`  [dry] ${filename.padEnd(18)} ← ${asset.url}`);
        continue;
      }

      if (await fileExists(outPath)) {
        console.log(`  skip ${filename.padEnd(18)} (exists)`);
        skipped++;
        continue;
      }

      try {
        const bytes = await downloadOne(asset.url, outPath);
        const kb = (bytes / 1024).toFixed(1);
        console.log(`  ✓    ${filename.padEnd(18)} ${kb} KB`);
        ok++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`  ✗    ${filename.padEnd(18)} ${msg}`);
        failed++;
        failures.push({handle: product.handle, filename, url: asset.url, error: msg});
      }

      // Be polite to CDNs — 100ms between requests
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (dryRun) {
    console.log(`Dry run: ${total} URLs across ${manifest.length} products`);
  } else {
    console.log(`Total: ${total} · Downloaded: ${ok} · Skipped: ${skipped} · Failed: ${failed}`);
    if (failures.length > 0) {
      console.log('\nFailures:');
      for (const f of failures) {
        console.log(`  ${f.handle}/${f.filename}: ${f.error}`);
        console.log(`    ${f.url}`);
      }
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
