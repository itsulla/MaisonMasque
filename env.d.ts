/// <reference types="vite/client" />

import type {HydrogenCart, HydrogenSessionData} from '@shopify/hydrogen';
import type {CustomerAccount, Storefront} from '@shopify/hydrogen/storefront-api-types';

declare global {
  /**
   * A global `auto` variable for Oxygen Deployment.
   */
  const process: {env: Env};
}

/**
 * The environment variables provided by the Oxygen/Hydrogen runtime.
 */
interface Env {
  SESSION_SECRET: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_STORE_DOMAIN: string;
}

/**
 * Declare the AppLoadContext used in loaders and actions.
 */
declare module '@shopify/remix-oxygen' {
  interface AppLoadContext {
    env: Env;
    cart: HydrogenCart;
    storefront: Storefront;
    waitUntil: ExecutionContext['waitUntil'];
  }

  interface SessionData extends HydrogenSessionData {}
}
