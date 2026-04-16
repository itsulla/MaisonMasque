import {createContext, useContext, useState, useCallback, useMemo, useEffect} from 'react';

export type CurrencyCode = 'USD' | 'AUD' | 'GBP' | 'EUR' | 'ZAR';

const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  AUD: 1.55,
  GBP: 0.79,
  EUR: 0.92,
  ZAR: 18.2,
};

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  AUD: 'A$',
  GBP: '£',
  EUR: '€',
  ZAR: 'R',
};

// Map country codes to currencies
const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  US: 'USD',
  AU: 'AUD',
  GB: 'GBP',
  ZA: 'ZAR',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  BE: 'EUR', AT: 'EUR', IE: 'EUR', PT: 'EUR', FI: 'EUR', GR: 'EUR',
};

function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (tz.startsWith('Australia')) return 'AU';
    if (tz.startsWith('Europe/London')) return 'GB';
    if (tz.startsWith('Africa/Johannesburg') || tz.startsWith('Africa/Cape_Town')) return 'ZA';
    if (
      tz.startsWith('Europe/Berlin') || tz.startsWith('Europe/Paris') ||
      tz.startsWith('Europe/Rome') || tz.startsWith('Europe/Madrid') ||
      tz.startsWith('Europe/Amsterdam') || tz.startsWith('Europe/Brussels') ||
      tz.startsWith('Europe/Vienna') || tz.startsWith('Europe/Dublin') ||
      tz.startsWith('Europe/Lisbon') || tz.startsWith('Europe/Helsinki') ||
      tz.startsWith('Europe/Athens')
    ) return 'DE'; // Any EU → maps to EUR

    // Try navigator language
    const lang = navigator.language ?? '';
    const parts = lang.split('-');
    if (parts.length >= 2) {
      const country = parts[1].toUpperCase();
      if (COUNTRY_CURRENCY[country]) return country;
    }
  } catch {
    // fallback
  }
  return 'US';
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  convert: (usdAmount: number) => number;
  format: (usdAmount: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// Currency → representative country for the Storefront API @inContext
// directive. EUR maps to DE (arbitrary EU member). Kept in sync with
// CURRENCY_TO_COUNTRY in server.ts.
const CURRENCY_COUNTRY: Record<CurrencyCode, string> = {
  USD: 'US',
  GBP: 'GB',
  AUD: 'AU',
  EUR: 'DE',
  ZAR: 'ZA',
};

export function CurrencyProvider({children}: {children: React.ReactNode}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  // Detect on mount (client only)
  useEffect(() => {
    const stored = getCookie('mm_currency') as CurrencyCode | null;
    if (stored && RATES[stored]) {
      setCurrencyState(stored);
      // Ensure mm_country cookie stays in sync so server-side Storefront
      // queries use the right @inContext country on the NEXT request.
      setCookie('mm_country', CURRENCY_COUNTRY[stored]);
    } else {
      const country = detectCountry();
      const detected = COUNTRY_CURRENCY[country] ?? 'USD';
      setCurrencyState(detected);
      setCookie('mm_currency', detected);
      setCookie('mm_country', CURRENCY_COUNTRY[detected]);
    }
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    setCookie('mm_currency', code);
    setCookie('mm_country', CURRENCY_COUNTRY[code]);
  }, []);

  const convert = useCallback(
    (usdAmount: number) => usdAmount * RATES[currency],
    [currency],
  );

  const format = useCallback(
    (usdAmount: number) => {
      const converted = usdAmount * RATES[currency];
      const sym = SYMBOLS[currency];
      if (currency === 'USD') {
        return `${sym}${converted.toFixed(2)}`;
      }
      return `${sym}${Math.round(converted)}`;
    },
    [currency],
  );

  const symbol = SYMBOLS[currency];

  const value = useMemo(
    () => ({currency, setCurrency, convert, format, symbol}),
    [currency, setCurrency, convert, format, symbol],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
