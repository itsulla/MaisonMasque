import {useCurrency, type CurrencyCode} from '~/lib/currencyContext';

const currencies: {code: CurrencyCode; symbol: string}[] = [
  {code: 'USD', symbol: '$'},
  {code: 'GBP', symbol: '£'},
  {code: 'AUD', symbol: 'A$'},
  {code: 'EUR', symbol: '€'},
  {code: 'ZAR', symbol: 'R'},
];

interface CurrencySelectorProps {
  className?: string;
}

export function CurrencySelector({className = ''}: CurrencySelectorProps) {
  const {currency, setCurrency} = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      className={`border border-sand bg-cream text-walnut text-xs uppercase tracking-[0.15em] py-2 px-3 font-body appearance-none cursor-pointer focus:outline-none focus:border-gold transition-colors duration-300 ${className}`.trim()}
      aria-label="Select currency"
    >
      {currencies.map(({code, symbol}) => (
        <option key={code} value={code}>
          {code} ({symbol})
        </option>
      ))}
    </select>
  );
}
