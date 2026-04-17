import {Link} from '@remix-run/react';
import {useEffect, useRef, useCallback, useMemo, useState} from 'react';
import {useCart, type CartLine} from '~/lib/cartContext';
import {useCurrency} from '~/lib/currencyContext';
import {Price} from '~/components/shared/Price';
import {getProductByHandle} from '~/lib/products';
import {GIFT_TIERS, GIFT_OPTIONS, PROGRESS_MESSAGES, getCurrentTier, getNextTier} from '~/lib/giftTiers';

const SUGGESTED_RITUALS = ['medicube-pdrn-gel-mask', 'abib-heartleaf-gummy-mask', 'skin1004-centella-sleeping-pack'];

export function CartDrawer() {
  const {lines, itemCount, subtotal, isOpen, close, addItem, checkoutUrl, loading} = useCart();
  const {format: formatPrice} = useCurrency();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedGift, setSelectedGift] = useState<string>(GIFT_OPTIONS[0].id);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') close();
    },
    [close],
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const currentTier = useMemo(() => getCurrentTier(subtotal), [subtotal]);
  const nextTier = useMemo(() => getNextTier(subtotal), [subtotal]);

  const progressPct = useMemo(() => {
    if (!nextTier) return 100;
    const prevThreshold = currentTier?.threshold ?? 0;
    const range = nextTier.threshold - prevThreshold;
    const progress = subtotal - prevThreshold;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  }, [subtotal, currentTier, nextTier]);

  // No-ritual nudge
  const noRitualNudge = useMemo(() => {
    if (lines.length === 0) return null;
    let hasSunscreen = false;
    let hasElixir = false;
    let hasRitual = false;
    for (const l of lines) {
      const p = getProductByHandle(l.handle);
      if (!p) continue;
      if (p.collection === 'ritual' || p.collection === 'bundle') hasRitual = true;
      else if (p.collection === 'morning-veil') hasSunscreen = true;
      else if (p.collection === 'elixir') hasElixir = true;
    }
    if (hasRitual) return null;
    if (hasElixir && hasSunscreen) return 'mixed' as const;
    if (hasElixir) return 'elixir-only' as const;
    if (hasSunscreen) return 'sunscreen-only' as const;
    return null;
  }, [lines]);

  const handleAddRitual = useCallback(
    (handle: string) => {
      const p = getProductByHandle(handle);
      if (!p) return;
      addItem({
        id: `product-${p.handle}`,
        handle: p.handle,
        title: p.name,
        vendor: p.brand,
        featuredImage: null,
        priceRange: {minVariantPrice: {amount: p.price.toFixed(2), currencyCode: p.currency}},
      });
    },
    [addItem],
  );

  // Resolve gift display for current tier
  const giftDisplay = useMemo(() => {
    if (!currentTier) return null;
    if (currentTier.selectable) {
      const option = GIFT_OPTIONS.find((o) => o.id === selectedGift) ?? GIFT_OPTIONS[0];
      return {name: option.name, subtitle: option.subtitle, retailUsd: currentTier.retailUsd, label: currentTier.label};
    }
    return {name: currentTier.name, subtitle: currentTier.subtitle, retailUsd: currentTier.retailUsd, label: currentTier.label};
  }, [currentTier, selectedGift]);

  return (
    <div
      className={`fixed inset-0 z-[110] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{backgroundColor: 'rgba(26,23,20,0.4)'}}
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`cart-drawer absolute right-0 top-0 bg-cream h-full flex flex-col border-l border-sand transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand p-6">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-xl text-ink">Your Ritual</h2>
            {itemCount > 0 && <span className="text-xs text-stone">({itemCount})</span>}
          </div>
          <button ref={closeButtonRef} onClick={close} className="text-ink" aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {lines.length > 0 ? (
          <>
            <div className="px-6 pt-5 pb-4">
              {/* No-ritual nudge */}
              {noRitualNudge && (
                <div className="bg-ivory rounded p-3 mb-4">
                  <p className="text-[13px] text-walnut">
                    {noRitualNudge === 'sunscreen-only' && (
                      <>Add{' '}<Link to="/collections/the-five-rituals" onClick={close} className="text-gold hover:text-ink transition-colors">a ritual</Link>{' '}for complimentary shipping</>
                    )}
                    {noRitualNudge === 'elixir-only' && (
                      <>Your elixir pairs with{' '}<Link to="/collections/the-five-rituals" onClick={close} className="text-gold hover:text-ink transition-colors">a ritual</Link>{' '}&mdash; add one for complimentary shipping</>
                    )}
                    {noRitualNudge === 'mixed' && (
                      <>Complete your collection &mdash; add{' '}<Link to="/collections/the-five-rituals" onClick={close} className="text-gold hover:text-ink transition-colors">a ritual</Link>{' '}for complimentary shipping</>
                    )}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {SUGGESTED_RITUALS.map((handle) => {
                      const p = getProductByHandle(handle);
                      if (!p) return null;
                      return (
                        <button key={handle} type="button" onClick={() => handleAddRitual(handle)} className="flex-1 border border-sand bg-cream rounded p-2 text-center hover:border-gold transition-colors group">
                          <span className="font-display text-xs text-stone group-hover:text-gold transition-colors block">{p.ritualNumber}</span>
                          <span className="text-[10px] text-walnut block mt-0.5 truncate">{p.ritualName}</span>
                          <span className="text-[10px] text-gold block mt-0.5">+</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div className="h-1 bg-sand rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all duration-500 ease-out" style={{width: `${progressPct}%`}} />
              </div>
              <p className="text-[13px] text-stone mt-2">
                {!nextTier ? (
                  <span className="text-gold">{PROGRESS_MESSAGES.at99}</span>
                ) : (
                  <>
                    You&apos;re{' '}
                    <span className="text-gold font-medium">{formatPrice(nextTier.threshold - subtotal)}</span>
                    {' '}away from {
                      nextTier.threshold === 45 ? PROGRESS_MESSAGES.below45
                        : nextTier.threshold === 75 ? PROGRESS_MESSAGES.below75
                          : PROGRESS_MESSAGES.below99
                    }
                  </>
                )}
              </p>
            </div>

            {/* Line items */}
            <div className="flex-1 overflow-y-auto px-6 pb-2">
              <div className="flex flex-col">
                {lines.map((line, i) => (
                  <CartLineItem key={line.id} line={line} isLast={i === lines.length - 1 && !currentTier} />
                ))}

                {/* Gift tier display */}
                {currentTier && giftDisplay && (
                  <div className="py-4 border-t border-sand animate-fade-in">
                    {/* Tier 1: selectable gift */}
                    {currentTier.selectable && currentTier.options && (
                      <div className="bg-ivory rounded p-3 mb-3">
                        <p className="text-[13px] text-walnut mb-2">Choose your complimentary gift</p>
                        <div className="flex gap-2">
                          {currentTier.options.map((option) => {
                            const isSelected = selectedGift === option.id;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setSelectedGift(option.id)}
                                className={`flex-1 border rounded p-2.5 text-left transition-colors ${
                                  isSelected ? 'border-gold bg-cream' : 'border-sand bg-cream hover:border-gold/50'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <div className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${
                                    isSelected ? 'bg-gold border-gold' : 'border-sand'
                                  }`}>
                                    {isSelected && (
                                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FAF8F3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs text-ink leading-tight">{option.name.replace('A complimentary ', '')}</p>
                                    <p className="text-[10px] text-stone mt-0.5">{option.subtitle}</p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Gift line item */}
                    <div className="flex gap-4">
                      <div className="w-[60px] h-[60px] flex-shrink-0 bg-gradient-to-b from-[#F5E6D0]/30 to-ivory flex items-center justify-center rounded">
                        <span className="text-gold text-lg">&#10022;</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-ink leading-tight flex items-center gap-1.5">
                          <span className="text-gold text-[10px]">&#10022;</span>
                          {giftDisplay.name}
                        </h4>
                        <p className="text-[10px] uppercase tracking-[3px] text-stone mt-0.5">
                          {giftDisplay.subtitle}
                        </p>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="font-display text-xs text-stone line-through">
                          {formatPrice(giftDisplay.retailUsd)}
                        </span>
                        <span className="text-[11px] text-gold mt-0.5">
                          {giftDisplay.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-sand p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink">Subtotal</span>
                <span className="font-display text-sm text-ink">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-walnut mb-1">Complimentary shipping from $45</p>
              <p className="text-[10px] text-stone mb-4 leading-relaxed">
                Asia $45 · UK &amp; SE Asia $55 · Oceania &amp; N. America $65 · EU $75
              </p>
              <div className="w-[60px] h-px bg-gold mx-auto mb-4" />
              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  className={`block w-full bg-ink text-cream text-center h-12 leading-[48px] text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-espresso transition-colors ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {loading ? 'Updating…' : 'Proceed to checkout'}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="block w-full bg-ink/40 text-cream/60 text-center h-12 text-[11px] uppercase tracking-[0.2em] font-semibold cursor-not-allowed"
                >
                  Loading checkout…
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="font-display text-xl text-ink mb-2">Your ritual awaits</h3>
            <p className="text-[13px] text-walnut mb-6">Explore our collection to begin</p>
            <a
              href="#rituals"
              onClick={close}
              className="inline-block border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold px-8 py-3 hover:border-ink hover:bg-ink hover:text-cream transition-colors"
            >
              Browse The Five Rituals
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function CartLineItem({line, isLast}: {line: CartLine; isLast: boolean}) {
  const {updateQuantity, removeItem} = useCart();
  const {format: fmtPrice} = useCurrency();
  const lineTotal = parseFloat(line.price.amount) * line.quantity;
  const isBundle = !!line.bundleHandle;

  return (
    <div className={`flex gap-4 py-4 ${isLast ? '' : 'border-b border-sand'}`}>
      <div className="w-[60px] h-[60px] flex-shrink-0 bg-cream overflow-hidden">
        {line.image?.url ? (
          <img src={line.image.url} alt={line.image.altText ?? line.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : isBundle ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{background: 'linear-gradient(135deg, #F3EFE6 0%, #E8E2D6 100%)'}}
          >
            <span className="font-display text-gold text-lg">✧</span>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-sand/30 to-ivory" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {isBundle ? (
          <h4 className="font-display text-[15px] text-ink leading-tight">{line.title}</h4>
        ) : (
          <h4 className="text-sm text-ink leading-tight truncate">{line.title}</h4>
        )}
        {!isBundle && (
          <p className="text-[10px] uppercase tracking-[3px] text-stone mt-0.5">{line.vendor}</p>
        )}
        {line.ritualLabel && <p className="text-[10px] text-gold mt-0.5">{line.ritualLabel}</p>}

        {/* Subscription badge */}
        {line.sellingPlan && (
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-gold mt-1 bg-ivory border border-gold/30 rounded-full px-2 py-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 4 21 10 15 10"/>
            </svg>
            Subscription · save 10%
          </div>
        )}

        {/* Bundle contents — indented list of included items */}
        {isBundle && line.selectedItems && line.selectedItems.length > 0 && (
          <ul className="mt-2 pl-3 border-l border-sand space-y-1">
            {line.selectedItems.map((item, i) => (
              <li key={i} className="text-[11px] text-stone leading-tight">
                <span className="text-walnut">{item.vendor}</span>
                <span className="text-stone"> — {item.title}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center border border-sand h-7 w-fit mt-2">
          <button type="button" onClick={() => updateQuantity(line.id, line.quantity - 1)} className="w-7 h-full flex items-center justify-center text-stone hover:text-ink transition-colors text-xs" aria-label={`Decrease quantity of ${line.title}`}>&minus;</button>
          <span className="w-6 h-full flex items-center justify-center text-xs font-body border-x border-sand">{line.quantity}</span>
          <button type="button" onClick={() => updateQuantity(line.id, line.quantity + 1)} className="w-7 h-full flex items-center justify-center text-stone hover:text-ink transition-colors text-xs" aria-label={`Increase quantity of ${line.title}`}>+</button>
        </div>
        <button type="button" onClick={() => removeItem(line.id)} className="text-[11px] text-stone hover:underline mt-1">Remove</button>
      </div>
      <span className="font-display text-sm text-ink flex-shrink-0">{fmtPrice(lineTotal)}</span>
    </div>
  );
}
