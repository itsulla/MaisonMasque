import {createContext, useContext, useState, useCallback, useMemo, useEffect} from 'react';
import {getRitualByHandle} from '~/lib/ritualConfig';

export interface CartLine {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  quantity: number;
  price: {amount: string; currencyCode: string};
  image?: {url: string; altText: string | null} | null;
  ritualLabel?: string;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  currencyCode: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (product: any, qty?: number) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
}

const STORAGE_KEY = 'mm_cart';

function loadCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(lines: CartLine[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // quota exceeded or unavailable
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({children}: {children: React.ReactNode}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setLines(loadCart());
    setHydrated(true);
  }, []);

  // Persist to localStorage on change (after hydration)
  useEffect(() => {
    if (hydrated) saveCart(lines);
  }, [lines, hydrated]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: any, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.handle === product.handle);
      if (existing) {
        return prev.map((l) =>
          l.handle === product.handle
            ? {...l, quantity: l.quantity + qty}
            : l,
        );
      }
      const ritual = getRitualByHandle(product.handle);
      const ritualLabel = ritual
        ? `Ritual ${ritual.numeral} — ${ritual.name}`
        : undefined;
      return [
        ...prev,
        {
          id: product.id ?? product.handle,
          handle: product.handle,
          title: product.title,
          vendor: product.vendor,
          quantity: qty,
          price: product.priceRange?.minVariantPrice ?? {
            amount: '0',
            currencyCode: 'USD',
          },
          image: product.featuredImage,
          ritualLabel,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setLines((prev) => prev.filter((l) => l.id !== id));
    } else {
      setLines((prev) =>
        prev.map((l) => (l.id === id ? {...l, quantity: qty} : l)),
      );
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () =>
      lines.reduce(
        (sum, l) => sum + parseFloat(l.price.amount) * l.quantity,
        0,
      ),
    [lines],
  );

  const currencyCode = lines[0]?.price.currencyCode ?? 'USD';

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      currencyCode,
      isOpen,
      open,
      close,
      addItem,
      updateQuantity,
      removeItem,
    }),
    [lines, itemCount, subtotal, currencyCode, isOpen, open, close, addItem, updateQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
