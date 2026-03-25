import {COLLECTION_FRAGMENT, PRODUCT_FRAGMENT} from './fragments';

export const COLLECTION_QUERY = `#graphql
  query CollectionQuery(
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

export const PRODUCT_QUERY = `#graphql
  query ProductQuery(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
