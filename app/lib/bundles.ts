/**
 * Bundle configuration — "The Evening Ritual" and "The Complete Ritual".
 *
 * Bundles are composed of slot groups. Each slot group has a type, a count,
 * and either an eligible set of product handles (user chooses) or an
 * included set (fixed, no selection).
 *
 * Pricing is stored both as a USD canonical value (used by the cart and
 * for math) and an explicit per-currency `prices` map (used on marketing
 * surfaces where we want exact, hand-tuned numbers — e.g. "$102").
 */

import type {CurrencyCode} from '~/lib/currencyContext';

export type BundleSlotType = 'mask' | 'elixir' | 'sunscreen';

export interface BundleSlot {
  type: BundleSlotType;
  count: number;
  label: string;
  /** If true, the slot is preselected — the customer cannot change it. */
  fixed?: boolean;
  /** For selectable slots: handles the user can pick from. */
  eligibleHandles?: string[];
  /** For fixed slots: handles always included. */
  includedHandles?: string[];
}

export interface Bundle {
  handle: string;
  name: string;
  tagline: string;
  description: string;
  /** Whole-number percent, e.g. 18 for 18% off. */
  discountPercent: number;
  heroColor: string;
  slots: BundleSlot[];
  /** Canonical USD price, used for cart math and currency conversion. */
  price: number;
  /** Pre-computed list price (sum of individual items before discount). */
  compareAtPrice: number;
  /** Per-currency hand-tuned prices for marketing display. */
  prices: Record<CurrencyCode, number>;
  /** Per-currency compare-at prices (strikethrough). */
  comparePrices: Record<CurrencyCode, number>;
}

export const bundles: Bundle[] = [
  {
    handle: 'the-evening-ritual',
    name: 'The Evening Ritual',
    tagline: 'The core nighttime practice',
    description:
      'Three masks and two elixirs, chosen by you. The considered evening ritual.',
    discountPercent: 18,
    heroColor: '#C9928A',
    slots: [
      {
        type: 'mask',
        count: 3,
        label: 'Choose 3 masks',
        eligibleHandles: [
          'medicube-pdrn-gel-mask',
          'medicube-wrapping-mask',
          'abib-heartleaf-gummy-mask',
          'numbuzin-no3-pore-mask',
          'skin1004-centella-sleeping-pack',
        ],
      },
      {
        type: 'elixir',
        count: 2,
        label: 'Choose 2 elixirs',
        eligibleHandles: [
          'medicube-pdrn-peptide-serum',
          'celdyque-pdrn-egf-serum',
          'medicube-pdrn-milky-toner',
        ],
      },
    ],
    price: 89,
    compareAtPrice: 116,
    prices: {USD: 89, GBP: 70, AUD: 138, EUR: 82, ZAR: 1620},
    comparePrices: {USD: 116, GBP: 92, AUD: 180, EUR: 107, ZAR: 2110},
  },
  {
    handle: 'the-complete-ritual',
    name: 'The Complete Ritual',
    tagline: 'The full day, day and night',
    description:
      'All five masks, two elixirs of your choosing, and one Morning Veil. The deepest commitment, the deepest reward.',
    discountPercent: 25,
    heroColor: '#C5A55A',
    slots: [
      {
        type: 'mask',
        count: 5,
        label: 'All 5 masks included',
        fixed: true,
        includedHandles: [
          'medicube-pdrn-gel-mask',
          'medicube-wrapping-mask',
          'abib-heartleaf-gummy-mask',
          'numbuzin-no3-pore-mask',
          'skin1004-centella-sleeping-pack',
        ],
      },
      {
        type: 'elixir',
        count: 2,
        label: 'Choose 2 elixirs',
        eligibleHandles: [
          'medicube-pdrn-peptide-serum',
          'celdyque-pdrn-egf-serum',
          'medicube-pdrn-milky-toner',
        ],
      },
      {
        type: 'sunscreen',
        count: 1,
        label: 'Choose 1 Morning Veil',
        eligibleHandles: [
          'beauty-of-joseon-relief-sun',
          'heimish-artless-glow-tinted-sunscreen',
        ],
      },
    ],
    price: 129,
    compareAtPrice: 183,
    prices: {USD: 129, GBP: 102, AUD: 199, EUR: 119, ZAR: 2350},
    comparePrices: {USD: 183, GBP: 145, AUD: 284, EUR: 168, ZAR: 3330},
  },
];

export function getBundleByHandle(handle: string): Bundle | null {
  return bundles.find((b) => b.handle === handle) ?? null;
}

/**
 * Counts how many items across every slot need to be selected in total.
 * For fixed slots this is always satisfied, so only selectable slots count.
 */
export function getRequiredSelectionCount(bundle: Bundle): number {
  return bundle.slots
    .filter((s) => !s.fixed)
    .reduce((sum, s) => sum + s.count, 0);
}
