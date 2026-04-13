import {useCurrency} from '~/lib/currencyContext';

const THRESHOLDS: Record<string, number> = {
  USD: 45,
  AUD: 70,
  GBP: 36,
  EUR: 42,
  ZAR: 820,
};

export function AnnouncementBar() {
  const {currency, format} = useCurrency();
  const threshold = THRESHOLDS[currency] ?? 45;
  // Convert threshold back to USD for the format function
  // since format() expects USD input. Thresholds are in local currency,
  // so we display them directly with the symbol.
  const formatted = format(threshold / getRate(currency));

  return (
    <div className="announcement-bar w-full bg-ink py-2.5 text-center">
      <p className="text-cream text-[11px] uppercase tracking-[3px] font-body font-medium">
        Complimentary shipping on orders over{' '}
        <span className="text-gold">{formatted}</span>
        {' '}&mdash; Worldwide delivery
      </p>
    </div>
  );
}

function getRate(currency: string): number {
  const rates: Record<string, number> = {
    USD: 1, AUD: 1.55, GBP: 0.79, EUR: 0.92, ZAR: 18.2,
  };
  return rates[currency] ?? 1;
}
