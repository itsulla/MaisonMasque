/**
 * GraphQL fragments for the Shopify Storefront API.
 *
 * Two product fragments: a lightweight `PRODUCT_ITEM_FRAGMENT` for list views
 * (homepage grids, collection pages) and a richer `PRODUCT_FULL_FRAGMENT` for
 * PDP with descriptionHtml, gallery images, metafields, and all variants.
 *
 * Editorial copy (ritual number, key ingredient, social proof, hero colour,
 * how-to-use) lives in app/lib/products.ts — these fragments only fetch data
 * Shopify owns: price, image, title, vendor, description, availability.
 */

export const MONEY_FRAGMENT = `#graphql
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
` as const;

export const IMAGE_FRAGMENT = `#graphql
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
` as const;

/**
 * Lightweight product fragment for list views.
 * Includes the canonical first variant GID so Stage 5 cart lines can add
 * products directly from a listing without a second round-trip.
 */
export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment ProductItemFragment on Product {
    id
    handle
    title
    vendor
    productType
    tags
    availableForSale
    featuredImage {
      ...ImageFragment
    }
    priceRange {
      minVariantPrice { ...MoneyFragment }
      maxVariantPrice { ...MoneyFragment }
    }
    compareAtPriceRange {
      minVariantPrice { ...MoneyFragment }
      maxVariantPrice { ...MoneyFragment }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price { ...MoneyFragment }
        compareAtPrice { ...MoneyFragment }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
` as const;

/**
 * Full product fragment for PDP — extends PRODUCT_ITEM_FRAGMENT with
 * descriptionHtml, gallery images, SEO, metafields, and all variants.
 */
export const PRODUCT_FULL_FRAGMENT = `#graphql
  fragment ProductFullFragment on Product {
    ...ProductItemFragment
    description
    descriptionHtml
    seo {
      title
      description
    }
    images(first: 5) {
      nodes {
        ...ImageFragment
      }
    }
    options {
      name
      values
    }
    variants(first: 10) {
      nodes {
        id
        availableForSale
        price { ...MoneyFragment }
        compareAtPrice { ...MoneyFragment }
        selectedOptions {
          name
          value
        }
        image { ...ImageFragment }
      }
    }
    metafields(
      identifiers: [
        {namespace: "custom", key: "ritual_number"}
        {namespace: "custom", key: "ritual_name"}
        {namespace: "custom", key: "ritual_description"}
        {namespace: "custom", key: "key_ingredient"}
      ]
    ) {
      namespace
      key
      value
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

export const COLLECTION_FRAGMENT = `#graphql
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    image { ...ImageFragment }
    products(first: 30) {
      nodes { ...ProductItemFragment }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
