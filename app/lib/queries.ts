/**
 * Storefront API queries. All queries use the @inContext directive so prices
 * and availability reflect the buyer's market. Loaders should pass
 * {country, language} from the storefront client's i18n or a cookie override.
 */

import {
  COLLECTION_FRAGMENT,
  PRODUCT_FULL_FRAGMENT,
  PRODUCT_ITEM_FRAGMENT,
} from './fragments';

/** Single product by handle — used by app/routes/products.$handle.tsx (Stage 3). */
export const PRODUCT_QUERY = `#graphql
  query ProductByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductFullFragment
    }
  }
  ${PRODUCT_FULL_FRAGMENT}
` as const;

/** Collection by handle with products — used by collections.$handle.tsx. */
export const COLLECTION_QUERY = `#graphql
  query CollectionByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...CollectionFragment
    }
  }
  ${COLLECTION_FRAGMENT}
` as const;

/**
 * Batch-fetch a specific set of products by handle. Used by the homepage and
 * cross-sell strips where we need the five rituals / elixirs / morning veil in
 * a known order.
 *
 * Storefront API `products(query:)` does NOT support `handle:` filtering
 * (only tag/vendor/product_type/etc), so we build a dynamic query that aliases
 * one `product(handle: $hN)` lookup per requested handle. Response keys are
 * `p0`, `p1`, ...; handles Shopify doesn't recognise come back as `null` —
 * the Stage 3 merge adapter falls back to products.ts for those.
 */
export function buildProductsByHandlesQuery(
  handles: readonly string[],
): string {
  if (handles.length === 0) {
    throw new Error('buildProductsByHandlesQuery: handles must be non-empty');
  }
  const varDecls = handles.map((_, i) => `$h${i}: String!`).join(', ');
  const aliases = handles
    .map((_, i) => `    p${i}: product(handle: $h${i}) { ...ProductItemFragment }`)
    .join('\n');
  return `#graphql
  query ProductsByHandles(
    ${varDecls}
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
${aliases}
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;
}

/** Build the `variables` object that pairs with buildProductsByHandlesQuery. */
export function productsByHandlesVariables(
  handles: readonly string[],
  country: string,
  language: string,
): Record<string, string> {
  const vars: Record<string, string> = {country, language};
  handles.forEach((h, i) => {
    vars[`h${i}`] = h;
  });
  return vars;
}

/**
 * Sitemap query — all product handles and updatedAt for [sitemap.xml].tsx.
 * Uses cursor pagination in case the catalogue ever exceeds 250.
 */
export const SITEMAP_QUERY = `#graphql
  query Sitemap(
    $first: Int!
    $after: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        handle
        updatedAt
        seo { title }
      }
    }
    collections(first: $first) {
      nodes {
        handle
        updatedAt
      }
    }
  }
` as const;

/** Shopify's product recommendations (related products). */
export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductItemFragment
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
