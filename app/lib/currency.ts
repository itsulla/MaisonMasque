export type SupportedCurrencyCode = 'USD' | 'GBP' | 'AUD' | 'EUR' | 'ZAR';

export const CURRENCY_MAP: Record<string, SupportedCurrencyCode> = {
  US: 'USD',
  GB: 'GBP',
  AU: 'AUD',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  PT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  ZA: 'ZAR',
};

const CURRENCY_SYMBOLS: Record<SupportedCurrencyCode, string> = {
  USD: '$',
  GBP: '\u00A3',
  AUD: 'A$',
  EUR: '\u20AC',
  ZAR: 'R',
};

/**
 * Reads the buyer's country from request headers set by Shopify Oxygen.
 * Falls back to the provided default or 'US'.
 */
export function getCountryFromRequest(
  request: Request,
  defaultCountry = 'US',
): string {
  return (
    request.headers.get('Oxygen-Buyer-Country') ??
    request.headers.get('oxygen-buyer-country') ??
    defaultCountry
  );
}

/**
 * Returns the currency symbol for a given currency code.
 */
export function getCurrencySymbol(currencyCode: SupportedCurrencyCode): string {
  return CURRENCY_SYMBOLS[currencyCode] ?? currencyCode;
}

/**
 * Formats a numeric price string with the appropriate currency symbol.
 */
export function formatPrice(
  amount: string | number,
  currencyCode: SupportedCurrencyCode,
): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(value)) {
    return `${getCurrencySymbol(currencyCode)}0.00`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value);
}
