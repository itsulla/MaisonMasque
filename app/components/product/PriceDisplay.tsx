interface PriceProps {
  amount: string;
  currencyCode: string;
}

interface PriceDisplayProps {
  price: PriceProps;
  compareAtPrice?: PriceProps | null;
}

function formatPrice(price: PriceProps): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(parseFloat(price.amount));
}

export function PriceDisplay({price, compareAtPrice}: PriceDisplayProps) {
  const isOnSale =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div className="font-display text-2xl mt-4 flex items-baseline gap-2">
      {isOnSale && compareAtPrice && (
        <span className="line-through text-stone text-lg">
          {formatPrice(compareAtPrice)}
        </span>
      )}
      <span className={isOnSale ? 'text-gold' : ''}>
        {formatPrice(price)}
      </span>
    </div>
  );
}
