interface CurrencySelectorProps {
  currentCurrency: string;
  onChange: (currency: string) => void;
  className?: string;
}

const currencies = [
  {code: 'USD', symbol: '$'},
  {code: 'GBP', symbol: '£'},
  {code: 'AUD', symbol: 'A$'},
  {code: 'EUR', symbol: '€'},
  {code: 'ZAR', symbol: 'R'},
] as const;

export function CurrencySelector({
  currentCurrency,
  onChange,
  className = '',
}: CurrencySelectorProps) {
  return (
    <select
      value={currentCurrency}
      onChange={(e) => onChange(e.target.value)}
      className={`border border-sand bg-cream text-stone text-xs uppercase tracking-[0.15em] py-2 px-3 font-body appearance-none cursor-pointer focus:outline-none focus:border-gold transition-colors duration-300 ${className}`.trim()}
    >
      {currencies.map(({code, symbol}) => (
        <option key={code} value={code}>
          {code} ({symbol})
        </option>
      ))}
    </select>
  );
}
