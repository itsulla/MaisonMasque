/// <reference types="vite/client" />

import type {HydrogenCart, HydrogenSessionData, Storefront} from '@shopify/hydrogen';

declare global {
  /**
   * A global `auto` variable for Oxygen Deployment.
   */
  const process: {env: Env};

  /**
   * The environment variables provided by the Oxygen/Hydrogen runtime.
   * Declared globally so server.ts (which runs outside Remix module scope)
   * can reference `Env` directly.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PRIVATE_STOREFRONT_API_TOKEN?: string;
  }
}

/**
 * Declare the AppLoadContext used in loaders and actions.
 *
 * `storefront` is wired in server.ts (Stage 1 of the Storefront API refactor).
 * `cart` is reserved for Stage 5 when createCartHandler replaces the custom
 * cart implementation in app/lib/shopifyCart.ts — keep optional until then.
 */
declare module '@shopify/remix-oxygen' {
  interface AppLoadContext {
    env: Env;
    executionContext: ExecutionContext;
    storefront: Storefront;
    cart?: HydrogenCart;
    waitUntil: ExecutionContext['waitUntil'];
  }

  interface SessionData extends HydrogenSessionData {}
}
