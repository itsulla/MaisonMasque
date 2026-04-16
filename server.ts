import {createRequestHandler, getStorefrontHeaders} from '@shopify/remix-oxygen';
import {createStorefrontClient} from '@shopify/hydrogen';
// @ts-ignore — virtual module provided by Remix at build time
import * as remixBuild from 'virtual:remix/server-build';

/**
 * Oxygen worker entry point.
 *
 * createRequestHandler from @shopify/remix-oxygen takes an OPTIONS OBJECT
 * {build, mode, getLoadContext}, NOT positional args. Passing positional
 * args caused Vite to tree-shake virtual:remix/server-build down to just
 * its `mode` export, leaving the routes/assets/entry undefined at runtime
 * → "Cannot read properties of undefined (reading 'routes')" → HTTP 500.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const cache = await caches.open('hydrogen');

      /**
       * Storefront client — enables loader-level queries to Shopify Storefront API
       * via `context.storefront.query(...)`. Uses the public token for SSR (no
       * private token available in worker env); i18n defaults to US/EN and can be
       * overridden per-request in Stage 5 when the currency cookie is wired.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: {country: 'US', language: 'EN'},
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontApiVersion: '2024-10',
        storefrontHeaders: getStorefrontHeaders(request),
      });

      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: 'production',
        getLoadContext: () => ({
          env,
          executionContext,
          waitUntil,
          storefront,
        }),
      });

      return await handleRequest(request);
    } catch (error) {
      console.error('Worker fetch error:', error);
      return new Response('Internal Server Error', {status: 500});
    }
  },
};
