import {useLoaderData, type MetaFunction} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    image: {url: string; altText: string | null} | null;
    title: string;
    product: {title: string} | null;
  };
  cost: {
    totalAmount: {amount: string; currencyCode: string} | null;
    amountPerQuantity: {amount: string; currencyCode: string} | null;
  };
}

interface Cart {
  lines: {nodes: CartLine[]} | CartLine[];
  cost: {
    subtotalAmount: {amount: string; currencyCode: string} | null;
    totalAmount: {amount: string; currencyCode: string} | null;
  };
  checkoutUrl: string | null;
}

interface LoaderData {
  cart: Cart | null;
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Your Ritual | Maison Masque'},
    {
      name: 'description',
      content: 'Review your curated selection of Korean sheet masks.',
    },
  ];
};

export async function loader({context}: LoaderFunctionArgs): Promise<LoaderData> {
  try {
    const cart = await (context as any).cart?.get();
    return {cart: cart ?? null};
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[MOCK_FALLBACK]', {route: 'cart', reason: message});
    return {cart: null};
  }
}

function formatMoney(amount: string | number, currencyCode: string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

function EmptyCart() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <div className="w-px h-[40px] bg-sand mx-auto mb-8" />
      <span className="text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body">
        Your Ritual Awaits
      </span>
      <h1 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
        Your cart is empty
      </h1>
      <p className="text-sm text-stone mt-4 max-w-md mx-auto leading-relaxed">
        Discover our curated selection of Korean sheet masks and begin your ritual.
      </p>
      <a
        href="/collections/the-five-rituals"
        className="inline-block mt-8 font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-ink text-cream hover:bg-espresso hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
      >
        Explore The Five Rituals
      </a>
      <div className="w-[60px] h-px bg-gold mx-auto mt-12" />
    </div>
  );
}

export default function CartPage() {
  const {cart} = useLoaderData<LoaderData>();
  const lines: CartLine[] = cart
    ? Array.isArray(cart.lines)
      ? cart.lines
      : (cart.lines as {nodes: CartLine[]})?.nodes ?? []
    : [];

  if (!cart || lines.length === 0) {
    return <EmptyCart />;
  }

  const subtotal =
    cart.cost?.subtotalAmount?.amount ??
    cart.cost?.totalAmount?.amount ??
    '0';
  const currencyCode =
    cart.cost?.subtotalAmount?.currencyCode ??
    cart.cost?.totalAmount?.currencyCode ??
    'USD';

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-[clamp(28px,3.5vw,42px)] text-center mb-12">
        Your Ritual
      </h1>

      {/* Line items */}
      <div className="border-t border-sand">
        {lines.map((line: CartLine) => {
          const merchandise = line.merchandise;
          const image = merchandise?.image;
          const title =
            merchandise?.product?.title ?? merchandise?.title ?? '';
          const linePrice =
            line.cost?.totalAmount?.amount ??
            line.cost?.amountPerQuantity?.amount ??
            '0';
          const lineCurrency =
            line.cost?.totalAmount?.currencyCode ??
            line.cost?.amountPerQuantity?.currencyCode ??
            'USD';

          return (
            <div
              key={line.id}
              className="flex gap-6 py-6 border-b border-sand"
            >
              {/* Image */}
              {image?.url && (
                <img
                  src={image.url}
                  alt={image.altText ?? title}
                  className="w-20 h-20 object-cover"
                />
              )}

              <div className="flex-1">
                <h3 className="font-display text-base text-ink">{title}</h3>
                <p className="text-xs text-stone mt-1">
                  Qty: {line.quantity}
                </p>
              </div>

              <span className="font-display text-base">
                {formatMoney(linePrice, lineCurrency)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <span className="text-sm font-body font-medium uppercase tracking-[2px]">
          Subtotal
        </span>
        <span className="font-display text-xl">
          {formatMoney(subtotal, currencyCode)}
        </span>
      </div>

      <p className="text-xs text-stone mb-6">
        Complimentary shipping on orders over &pound;45
      </p>

      <div className="w-full h-px bg-gold mb-6" />

      <a
        href={cart?.checkoutUrl ?? '/checkout'}
        className="block w-full bg-ink text-cream text-center py-4 text-xs uppercase tracking-[3px] font-body font-medium hover:bg-espresso transition-colors"
      >
        Proceed to checkout
      </a>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-3xl mb-4">Something went wrong</h1>
      <p className="text-stone text-sm mb-8">We couldn't load this page. Please try again.</p>
      <a href="/" className="text-xs uppercase tracking-[3px] text-gold hover:text-ink transition-colors">
        Return to the Maison
      </a>
    </div>
  );
}
