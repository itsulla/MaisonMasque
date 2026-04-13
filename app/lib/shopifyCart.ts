/**
 * Shopify Storefront Cart API — real cart mutations that create
 * actual Shopify checkouts customers can pay through.
 *
 * All operations are client-side only (use the public Storefront API token).
 */

const STOREFRONT_API_URL = `https://0gk4tx-0x.myshopify.com/api/2024-10/graphql.json`;
const STOREFRONT_TOKEN = '3a5a4b00408e0b920fd5fa764080e8fb';

// ── Handle → Shopify Variant GID mapping ────────────────────────────────────

const VARIANT_MAP: Record<string, string> = {
  'medicube-pdrn-gel-mask': 'gid://shopify/ProductVariant/51956063535415',
  'medicube-wrapping-mask': 'gid://shopify/ProductVariant/51956064321847',
  'abib-heartleaf-gummy-mask': 'gid://shopify/ProductVariant/51956065665335',
  'numbuzin-no3-pore-mask': 'gid://shopify/ProductVariant/51956065730871',
  'skin1004-centella-sleeping-pack': 'gid://shopify/ProductVariant/51956065861943',
  'beauty-of-joseon-relief-sun': 'gid://shopify/ProductVariant/51956065993015',
  'heimish-artless-glow-tinted-sunscreen': 'gid://shopify/ProductVariant/51956066255159',
  'medicube-pdrn-peptide-serum': 'gid://shopify/ProductVariant/51956066418999',
  'celdyque-pdrn-egf-serum': 'gid://shopify/ProductVariant/51956072579383',
  'medicube-pdrn-milky-toner': 'gid://shopify/ProductVariant/51956072743223',
};

export function getVariantId(handle: string): string | null {
  return VARIANT_MAP[handle] ?? null;
}

// ── GraphQL helper ──────────────────────────────────────────────────────────

async function storefrontFetch(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({query, variables}),
  });
  const json = await res.json() as {data?: any; errors?: any[]};
  if (json.errors) {
    console.error('Storefront API error:', json.errors);
  }
  return json.data;
}

// ── Cart fragments ──────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { amount currencyCode }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              image { url altText }
              product {
                handle
                title
                vendor
              }
            }
          }
        }
      }
    }
  }
`;

// ── Mutations ───────────────────────────────────────────────────────────────

export async function createCart(lines?: {merchandiseId: string; quantity: number}[]) {
  const data = await storefrontFetch(`
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `, {
    input: lines ? {lines} : {},
  });
  return data?.cartCreate?.cart ?? null;
}

export async function addCartLines(
  cartId: string,
  lines: {merchandiseId: string; quantity: number}[],
) {
  const data = await storefrontFetch(`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `, {cartId, lines});
  return data?.cartLinesAdd?.cart ?? null;
}

export async function updateCartLines(
  cartId: string,
  lines: {id: string; quantity: number}[],
) {
  const data = await storefrontFetch(`
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `, {cartId, lines});
  return data?.cartLinesUpdate?.cart ?? null;
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await storefrontFetch(`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `, {cartId, lineIds});
  return data?.cartLinesRemove?.cart ?? null;
}

export async function getCart(cartId: string) {
  const data = await storefrontFetch(`
    query getCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
    ${CART_FRAGMENT}
  `, {cartId});
  return data?.cart ?? null;
}

// ── Cart → local format converter ───────────────────────────────────────────

export interface ShopifyCartLine {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  quantity: number;
  price: {amount: string; currencyCode: string};
  image?: {url: string; altText: string | null} | null;
}

export function parseShopifyCart(cart: any): {
  lines: ShopifyCartLine[];
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  currencyCode: string;
} {
  const lines: ShopifyCartLine[] = (cart?.lines?.edges ?? []).map((edge: any) => {
    const node = edge.node;
    const merch = node.merchandise;
    return {
      id: node.id,
      handle: merch.product.handle,
      title: merch.product.title,
      vendor: merch.product.vendor,
      quantity: node.quantity,
      price: merch.price,
      image: merch.image,
    };
  });

  return {
    lines,
    checkoutUrl: cart?.checkoutUrl ?? '',
    totalQuantity: cart?.totalQuantity ?? 0,
    subtotal: parseFloat(cart?.cost?.subtotalAmount?.amount ?? '0'),
    currencyCode: cart?.cost?.subtotalAmount?.currencyCode ?? 'USD',
  };
}
