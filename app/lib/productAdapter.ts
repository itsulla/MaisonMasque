/**
 * Merge adapter: combines Shopify Storefront API data with the local
 * editorial overlay in products.ts.
 *
 * Shopify owns: price, compareAtPrice, currency, title, vendor, description,
 * availability, variant GID, gallery images.
 * Local products.ts owns: editorial copy (ritual number/name, key ingredient
 * string, how-to-use, social proof, hero colour), categorisation (format,
 * concern, skin type, collection), bundle membership, subtitle.
 *
 * When Shopify returns null for a handle (invisible in Storefront API or
 * truly missing), we fall back entirely to products.ts so the PDP renders
 * identically to pre-refactor behaviour. Source is recorded in `_source`
 * so future telemetry/debugging can see which products are still local-only.
 */

import type {Product as EditorialProduct} from './products';
import {getProductByHandle} from './products';

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id?: string | null;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

/** Shape of a product returned by PRODUCT_QUERY via ProductFullFragment. */
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType?: string | null;
  tags?: string[];
  availableForSale: boolean;
  description?: string | null;
  descriptionHtml?: string | null;
  featuredImage?: ShopifyImage | null;
  priceRange?: {
    minVariantPrice?: MoneyV2;
    maxVariantPrice?: MoneyV2;
  } | null;
  compareAtPriceRange?: {
    minVariantPrice?: MoneyV2;
    maxVariantPrice?: MoneyV2;
  } | null;
  images?: {nodes?: ShopifyImage[]} | null;
  variants?: {
    nodes?: Array<{
      id: string;
      availableForSale: boolean;
      price?: MoneyV2;
      compareAtPrice?: MoneyV2 | null;
    }>;
  } | null;
  seo?: {title?: string | null; description?: string | null} | null;
  metafields?: Array<{
    namespace: string;
    key: string;
    value: string;
  } | null> | null;
}

export interface MergedProduct extends EditorialProduct {
  /** First variant GID — enables Stage 5 cart mutations to use real Shopify IDs. */
  variantId?: string;
  /** Live stock flag from Shopify; true when falling back (assumed in stock). */
  availableForSale: boolean;
  /** Live MoneyV2 for <Money> rendering once Shopify Markets is configured. */
  priceMoney?: MoneyV2;
  compareAtPriceMoney?: MoneyV2;
  /** Full gallery (up to 5 images) for PDP zoom/carousel. */
  images?: ShopifyImage[];
  /** descriptionHtml for rich PDP copy (falls back to plain editorial string). */
  descriptionHtml?: string | null;
  /** Indicates whether the merged data included live Shopify fields. */
  _source: 'shopify' | 'fallback';
}

function num(s: string | undefined | null, fallback: number): number {
  if (!s) return fallback;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Merge one Shopify product with its editorial record. Returns null if neither
 * side has data for the handle — the caller should 404.
 */
export function mergeProduct(
  handle: string,
  live: ShopifyProduct | null | undefined,
): MergedProduct | null {
  const editorial = getProductByHandle(handle);

  // No editorial record → we can't render the PDP (too many editorial-only fields
  // like heroColor, format, skinType). Surface the Shopify-only case in logs so
  // the catalogue drift is visible, but treat it as a 404 for the PDP.
  if (!editorial) {
    if (live) {
      console.warn(
        `[productAdapter] Shopify knows '${handle}' but products.ts does not; add an editorial record to surface it.`,
      );
    }
    return null;
  }

  // No live data → pure fallback. Behaves identically to pre-refactor behaviour.
  if (!live) {
    return {
      ...editorial,
      availableForSale: true,
      _source: 'fallback',
    };
  }

  const liveMinPrice = live.priceRange?.minVariantPrice;
  const liveMinCompare = live.compareAtPriceRange?.minVariantPrice;
  const liveImage =
    live.featuredImage?.url ?? live.images?.nodes?.[0]?.url ?? null;
  const variantId = live.variants?.nodes?.[0]?.id;

  return {
    ...editorial,
    // Shopify-sourced when present; otherwise editorial.
    name: live.title || editorial.name,
    brand: live.vendor || editorial.brand,
    description: live.description || editorial.description,
    price: num(liveMinPrice?.amount, editorial.price),
    compareAtPrice: num(liveMinCompare?.amount, editorial.compareAtPrice),
    currency: liveMinPrice?.currencyCode || editorial.currency,
    image: liveImage || editorial.image,
    // Live-only metadata (Stage 5 uses these).
    availableForSale: live.availableForSale,
    variantId,
    priceMoney: liveMinPrice,
    compareAtPriceMoney: liveMinCompare ?? undefined,
    images: live.images?.nodes?.filter(Boolean) ?? undefined,
    descriptionHtml: live.descriptionHtml,
    _source: 'shopify',
  };
}
