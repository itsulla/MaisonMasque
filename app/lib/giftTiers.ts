export interface GiftOption {
  id: string;
  name: string;
  subtitle: string;
}

export interface GiftTier {
  threshold: number;
  /** Whether the customer can choose between gift options (Tier 1 only) */
  selectable: boolean;
  /** Display name for the gift line item */
  name: string;
  subtitle: string;
  retailUsd: number;
  label: string;
  /** Available options when selectable is true */
  options?: GiftOption[];
}

export const GIFT_OPTIONS: GiftOption[] = [
  {id: 'sun-veil', name: 'A complimentary sun veil', subtitle: 'Beauty of Joseon · 10ml'},
  {id: 'centella-foam', name: 'A complimentary centella foam', subtitle: 'SKIN1004 · mini'},
];

export const GIFT_TIERS: GiftTier[] = [
  {
    threshold: 45,
    selectable: true,
    name: '', // set dynamically from selected option
    subtitle: '',
    retailUsd: 8,
    label: 'Complimentary',
    options: GIFT_OPTIONS,
  },
  {
    threshold: 75,
    selectable: false,
    name: 'A sun veil and a centella foam — with our compliments',
    subtitle: 'Beauty of Joseon · 10ml + SKIN1004 · mini',
    retailUsd: 16,
    label: 'Complimentary',
  },
  {
    threshold: 99,
    selectable: false,
    name: 'The complete sun shield and a centella foam — with our compliments',
    subtitle: 'Beauty of Joseon Relief Sun · 50ml + SKIN1004 · mini',
    retailUsd: 28,
    label: 'With our compliments',
  },
];

export const PROGRESS_MESSAGES = {
  below45: 'a complimentary gift',
  below75: 'both gifts',
  below99: 'a full-size sun shield + centella foam',
  at99: 'The complete sun shield and centella foam are yours — with our compliments',
};

export function getCurrentTier(subtotalUsd: number): GiftTier | null {
  for (let i = GIFT_TIERS.length - 1; i >= 0; i--) {
    if (subtotalUsd >= GIFT_TIERS[i].threshold) return GIFT_TIERS[i];
  }
  return null;
}

export function getNextTier(subtotalUsd: number): GiftTier | null {
  for (const tier of GIFT_TIERS) {
    if (subtotalUsd < tier.threshold) return tier;
  }
  return null;
}
