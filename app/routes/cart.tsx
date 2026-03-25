import {useLoaderData, type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Your Ritual | Maison Masque'},
    {
      name: 'description',
      content: 'Review your curated selection of Korean sheet masks.',
    },
  ];
};

export async function loader({context}: any) {
  try {
    const cart = await context.cart?.get();
    const lines = cart?.lines?.nodes ?? cart?.lines ?? [];

    // Redirect to home if cart is empty
    if (!cart || lines.length === 0) {
      return new Response(null, {
        status: 302,
        headers: {Location: '/'},
      });
    }

    return {cart};
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return new Response(null, {
      status: 302,
      headers: {Location: '/'},
    });
  }
}

function formatMoney(amount: string | number, currencyCode: string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

export default function CartPage() {
  const {cart} = useLoaderData<typeof loader>();
  const lines = cart?.lines?.nodes ?? cart?.lines ?? [];
  const subtotal =
    cart?.cost?.subtotalAmount?.amount ??
    cart?.cost?.totalAmount?.amount ??
    '0';
  const currencyCode =
    cart?.cost?.subtotalAmount?.currencyCode ??
    cart?.cost?.totalAmount?.currencyCode ??
    'USD';

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-[clamp(28px,3.5vw,42px)] text-center mb-12">
        Your Ritual
      </h1>

      {/* Line items */}
      <div className="border-t border-sand">
        {lines.map((line: any) => {
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
