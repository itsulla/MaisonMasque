import {useId} from 'react';
import {SUBSCRIBE_SAVE_DISCOUNT_PCT, SUBSCRIBE_SAVE_CADENCE_LABEL} from '~/lib/shopifyCart';
import {Price} from '~/components/shared/Price';

export type PurchaseMode = 'subscribe' | 'one-time';

interface Props {
  price: number;
  mode: PurchaseMode;
  onChange: (mode: PurchaseMode) => void;
}

/**
 * Subscribe & Save toggle. Default selection = subscribe.
 *
 * Renders two radio options stacked:
 *   ( ) Subscribe & Save 10% · Every 2 months · $X.XX
 *   ( ) One-time purchase · $Y.YY
 */
export function SubscriptionToggle({price, mode, onChange}: Props) {
  const groupId = useId();
  const subPrice = price * (1 - SUBSCRIBE_SAVE_DISCOUNT_PCT / 100);

  return (
    <fieldset className="mt-6">
      <legend className="sr-only">Purchase options</legend>
      <div className="flex flex-col gap-2">
        <label
          className={`flex items-start gap-3 border rounded p-3.5 cursor-pointer transition-colors ${
            mode === 'subscribe'
              ? 'border-gold bg-ivory'
              : 'border-sand bg-cream hover:border-gold/50'
          }`}
        >
          <input
            type="radio"
            name={groupId}
            value="subscribe"
            checked={mode === 'subscribe'}
            onChange={() => onChange('subscribe')}
            className="sr-only"
          />
          <span
            className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${
              mode === 'subscribe' ? 'bg-gold border-gold' : 'border-sand'
            }`}
            aria-hidden="true"
          >
            {mode === 'subscribe' && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FAF8F3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-ink font-medium">
                Subscribe &amp; Save {SUBSCRIBE_SAVE_DISCOUNT_PCT}%
              </span>
              <span className="text-[13px] text-gold font-display">
                <Price amount={subPrice} />
              </span>
            </div>
            <p className="text-[11px] text-stone mt-0.5">
              {SUBSCRIBE_SAVE_CADENCE_LABEL} · pause or cancel anytime
            </p>
          </div>
        </label>

        <label
          className={`flex items-start gap-3 border rounded p-3.5 cursor-pointer transition-colors ${
            mode === 'one-time'
              ? 'border-gold bg-ivory'
              : 'border-sand bg-cream hover:border-gold/50'
          }`}
        >
          <input
            type="radio"
            name={groupId}
            value="one-time"
            checked={mode === 'one-time'}
            onChange={() => onChange('one-time')}
            className="sr-only"
          />
          <span
            className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${
              mode === 'one-time' ? 'bg-gold border-gold' : 'border-sand'
            }`}
            aria-hidden="true"
          >
            {mode === 'one-time' && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FAF8F3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-ink font-medium">One-time purchase</span>
              <span className="text-[13px] text-ink font-display">
                <Price amount={price} />
              </span>
            </div>
          </div>
        </label>
      </div>
    </fieldset>
  );
}
