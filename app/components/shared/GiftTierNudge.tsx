import {useCart} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';
import {getCurrentTier, getNextTier, GIFT_TIERS} from '~/lib/giftTiers';

interface GiftTierNudgeProps {
  productPriceUsd: number;
  qty?: number;
}

// Crossing messages — what you get when adding pushes past a threshold
const CROSSING_MESSAGES: Record<number, React.ReactNode> = {
  45: <>Add to cart and choose <span className="text-gold">a complimentary gift — sun veil or centella foam</span></>,
  75: <>Add to cart and receive <span className="text-gold">both the sun veil and centella foam</span></>,
  99: <>Add to cart and receive <span className="text-gold">a full-size sun shield + centella foam</span></>,
};

// Distance messages — how far to the next tier
const DISTANCE_GIFTS: Record<number, string> = {
  45: 'a complimentary gift',
  75: 'both the sun veil and centella foam',
  99: 'a full-size sun shield + centella foam',
};

export function GiftTierNudge({productPriceUsd, qty = 1}: GiftTierNudgeProps) {
  const {subtotal} = useCart();
  const {format} = useCurrency();

  const projectedTotal = subtotal + productPriceUsd * qty;
  const currentTier = getCurrentTier(subtotal);
  const projectedTier = getCurrentTier(projectedTotal);
  const highestThreshold = GIFT_TIERS[GIFT_TIERS.length - 1].threshold;

  // Already at highest tier
  if (currentTier && currentTier.threshold >= highestThreshold) {
    return null;
  }

  // Adding this product would cross a new tier
  if (projectedTier && (!currentTier || projectedTier.threshold > currentTier.threshold)) {
    const msg = CROSSING_MESSAGES[projectedTier.threshold];
    if (!msg) return null;
    return <p className="text-[13px] text-stone mt-3">{msg}</p>;
  }

  // Below all tiers or won't cross next — show distance
  const nextTier = getNextTier(projectedTotal);
  if (nextTier) {
    const remaining = nextTier.threshold - projectedTotal;
    if (remaining <= 0) return null;
    const gift = DISTANCE_GIFTS[nextTier.threshold];
    if (!gift) return null;
    return (
      <p className="text-[13px] text-stone mt-3">
        Spend <span className="text-gold font-medium">{format(remaining)}</span> more for{' '}
        <span className="text-gold">{gift}</span>
      </p>
    );
  }

  return null;
}
