import {createRequestHandler, getStorefrontHeaders} from '@shopify/remix-oxygen';
import {createStorefrontClient} from '@shopify/hydrogen';
import type {
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';
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

// Currency → country mapping. Kept in sync with the client-side
// CurrencyProvider so cookie round-trips produce a consistent i18n context.
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: 'US',
  GBP: 'GB',
  AUD: 'AU',
  EUR: 'DE',
  ZAR: 'ZA',
};

const SUPPORTED_COUNTRIES = new Set([
  'US',
  'GB',
  'AU',
  'ZA',
  'DE',
  'FR',
  'IT',
  'ES',
  'NL',
  'BE',
  'AT',
  'IE',
  'PT',
  'FI',
  'GR',
  'HK',
]);

function parseCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Determine the Storefront API @inContext country for this request, in order:
 *   1. `mm_country` cookie (explicit user override via CurrencySelector)
 *   2. `mm_currency` cookie mapped back to a representative country
 *   3. Oxygen-Buyer-Country header (edge IP geolocation)
 *   4. 'US' fallback
 *
 * Returns a country code that Shopify Markets can interpret. Today only HK is
 * configured in Shopify Admin, so non-HK countries silently fall back to the
 * shop's base context — see Stage 5 handoff notes.
 */
function resolveCountry(request: Request): string {
  const cookieHeader = request.headers.get('Cookie');
  const countryCookie = parseCookie(cookieHeader, 'mm_country');
  if (countryCookie && SUPPORTED_COUNTRIES.has(countryCookie.toUpperCase())) {
    return countryCookie.toUpperCase();
  }
  const currencyCookie = parseCookie(cookieHeader, 'mm_currency');
  if (currencyCookie && CURRENCY_TO_COUNTRY[currencyCookie.toUpperCase()]) {
    return CURRENCY_TO_COUNTRY[currencyCookie.toUpperCase()];
  }
  const oxygenCountry =
    request.headers.get('Oxygen-Buyer-Country') ??
    request.headers.get('oxygen-buyer-country');
  if (oxygenCountry && SUPPORTED_COUNTRIES.has(oxygenCountry.toUpperCase())) {
    return oxygenCountry.toUpperCase();
  }
  return 'US';
}

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const cache = await caches.open('hydrogen');
      const country = resolveCountry(request);

      /**
       * Storefront client — enables loader-level queries to Shopify Storefront
       * API via `context.storefront.query(...)`. The `i18n` config drives the
       * @inContext directive in every query (see app/lib/queries.ts). Loaders
       * can keep passing `country`/`language` variables explicitly, or rely on
       * Hydrogen's auto-injection from this i18n config when variables are
       * omitted.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: {
          country: country as CountryCode,
          language: 'EN' as LanguageCode,
        },
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
