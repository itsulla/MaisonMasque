import {createContext, useContext, useState, useCallback, useMemo, useEffect, useRef} from 'react';
import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  getCart,
  getVariantId,
  parseShopifyCart,
  type ShopifyCartLine,
} from '~/lib/shopifyCart';
import {getRitualByHandle} from '~/lib/ritualConfig';

// ── Types ────────────────────────────────────────────────────────────────────

export interface BundleSelectedItem {
  handle: string;
  title: string;
  vendor: string;
}

export interface CartLine extends ShopifyCartLine {
  ritualLabel?: string;
  bundleHandle?: string;
  selectedItems?: BundleSelectedItem[];
  // sellingPlan is inherited from ShopifyCartLine — {id, name} | null
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  currencyCode: string;
  checkoutUrl: string;
  isOpen: boolean;
  loading: boolean;
  open: () => void;
  close: () => void;
  addItem: (product: any, qty?: number, sellingPlanId?: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
}

// ── LocalStorage for cart ID persistence ─────────────────────────────────────

const CART_ID_KEY = 'mm_cart_id';

function getSavedCartId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(CART_ID_KEY);
  } catch {
    return null;
  }
}

function saveCartId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_ID_KEY, id);
  } catch {
    // quota or unavailable
  }
}

function clearCartId() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CART_ID_KEY);
  } catch {
    // ignore
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({children}: {children: React.ReactNode}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cartIdRef = useRef<string | null>(null);

  // Hydrate: load existing cart from Shopify on mount
  useEffect(() => {
    const savedId = getSavedCartId();
    if (!savedId) return;

    cartIdRef.current = savedId;
    getCart(savedId).then((cart) => {
      if (!cart || cart.totalQuantity === 0) {
        // Cart expired or empty — clear it
        clearCartId();
        cartIdRef.current = null;
        return;
      }
      syncFromShopify(cart);
    }).catch(() => {
      clearCartId();
      cartIdRef.current = null;
    });
  }, []);

  // Sync local state from Shopify cart response
  function syncFromShopify(cart: any) {
    const parsed = parseShopifyCart(cart);
    const enriched: CartLine[] = parsed.lines.map((line) => {
      const ritual = getRitualByHandle(line.handle);
      return {
        ...line,
        ritualLabel: ritual ? `Ritual ${ritual.numeral} — ${ritual.name}` : undefined,
      };
    });
    setLines(enriched);
    setCheckoutUrl(parsed.checkoutUrl);
    if (cart.id) {
      cartIdRef.current = cart.id;
      saveCartId(cart.id);
    }
  }

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(async (product: any, qty = 1, sellingPlanId?: string) => {
    const variantId = getVariantId(product.handle);
    if (!variantId) {
      console.error(`No variant ID for handle: ${product.handle}`);
      return;
    }

    setLoading(true);
    try {
      const lineInput: {merchandiseId: string; quantity: number; sellingPlanId?: string} = {
        merchandiseId: variantId,
        quantity: qty,
      };
      if (sellingPlanId) lineInput.sellingPlanId = sellingPlanId;
      let cart;

      if (cartIdRef.current) {
        // Add to existing cart
        cart = await addCartLines(cartIdRef.current, [lineInput]);
      } else {
        // Create new cart with this item
        cart = await createCart([lineInput]);
      }

      if (cart) {
        syncFromShopify(cart);
      }
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setLoading(false);
      setIsOpen(true);
    }
  }, []);

  const updateQuantity = useCallback(async (lineId: string, qty: number) => {
    if (!cartIdRef.current) return;

    setLoading(true);
    try {
      let cart;
      if (qty <= 0) {
        cart = await removeCartLines(cartIdRef.current, [lineId]);
      } else {
        cart = await updateCartLines(cartIdRef.current, [{id: lineId, quantity: qty}]);
      }
      if (cart) {
        syncFromShopify(cart);
        if (cart.totalQuantity === 0) {
          clearCartId();
          cartIdRef.current = null;
        }
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cartIdRef.current) return;

    setLoading(true);
    try {
      const cart = await removeCartLines(cartIdRef.current, [lineId]);
      if (cart) {
        syncFromShopify(cart);
        if (cart.totalQuantity === 0) {
          clearCartId();
          cartIdRef.current = null;
        }
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + parseFloat(l.price.amount) * l.quantity, 0),
    [lines],
  );

  const currencyCode = lines[0]?.price.currencyCode ?? 'USD';

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      currencyCode,
      checkoutUrl,
      isOpen,
      loading,
      open,
      close,
      addItem,
      updateQuantity,
      removeItem,
    }),
    [lines, itemCount, subtotal, currencyCode, checkoutUrl, isOpen, loading, open, close, addItem, updateQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// ── Fulfillment helper (kept for future 3PL integration) ─────────────────────

export interface FulfillmentSku {
  handle: string;
  title: string;
  vendor: string;
  quantity: number;
  fromBundle?: string;
}

export function flattenCartForFulfillment(lines: CartLine[]): FulfillmentSku[] {
  const skus: FulfillmentSku[] = [];
  for (const line of lines) {
    if (line.bundleHandle && line.selectedItems && line.selectedItems.length > 0) {
      for (const item of line.selectedItems) {
        skus.push({
          handle: item.handle,
          title: item.title,
          vendor: item.vendor,
          quantity: line.quantity,
          fromBundle: line.bundleHandle,
        });
      }
    } else {
      skus.push({
        handle: line.handle,
        title: line.title,
        vendor: line.vendor,
        quantity: line.quantity,
      });
    }
  }
  return skus;
}
