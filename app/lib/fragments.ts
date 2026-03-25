export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
  }
` as const;

export const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFragment on Product {
    id
    title
    handle
    vendor
    description
    descriptionHtml
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    variants(first: 10) {
      nodes {
        ...ProductVariantFragment
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
      key
      value
      namespace
    }
    sellingPlanGroups(first: 5) {
      nodes {
        name
        sellingPlans(first: 10) {
          nodes {
            id
            name
            options {
              name
              value
            }
            priceAdjustments {
              adjustmentValue {
                ... on SellingPlanPercentagePriceAdjustment {
                  adjustmentPercentage
                }
              }
              orderCount
            }
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const COLLECTION_FRAGMENT = `#graphql
  fragment CollectionFragment on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 10) {
      nodes {
        ...ProductFragment
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
