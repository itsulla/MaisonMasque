import {useCurrency} from '~/lib/currencyContext';

interface PriceProps {
  amount: number;
  className?: string;
}

export function Price({amount, className = ''}: PriceProps) {
  const {format} = useCurrency();
  return <span className={className}>{format(amount)}</span>;
}

interface PriceWithCompareProps {
  amount: number;
  compareAt: number;
  priceClassName?: string;
  compareClassName?: string;
  badgeClassName?: string;
}

export function PriceWithCompare({
  amount,
  compareAt,
  priceClassName = '',
  compareClassName = '',
  badgeClassName = '',
}: PriceWithCompareProps) {
  const {format} = useCurrency();
  const hasSavings = compareAt > amount;
  const savings = compareAt - amount;

  return (
    <>
      {hasSavings && (
        <span className={`line-through ${compareClassName}`}>
          {format(compareAt)}
        </span>
      )}
      <span className={priceClassName}>{format(amount)}</span>
      {hasSavings && (
        <span className={`badge-save ${badgeClassName}`.trim()}>
          Save {format(savings)}
        </span>
      )}
    </>
  );
}
