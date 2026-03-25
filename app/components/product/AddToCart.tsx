import {useState} from 'react';
import {CartForm} from '@shopify/hydrogen';

interface AddToCartProps {
  productId: string;
  variantId: string;
  available: boolean;
}

export function AddToCart({productId, variantId, available}: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div>
      <div className="flex items-center border border-sand inline-flex mt-6">
        <button
          type="button"
          onClick={() => handleQuantityChange(quantity - 1)}
          className="w-10 h-10 flex items-center justify-center text-stone hover:text-ink transition-colors"
          aria-label="Decrease quantity"
        >
          &minus;
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
          min={1}
          className="w-14 h-10 text-center border-x border-sand font-body text-sm bg-transparent focus:outline-none"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={() => handleQuantityChange(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center text-stone hover:text-ink transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {available ? (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{
            lines: [
              {
                merchandiseId: variantId,
                quantity,
              },
            ],
          }}
        >
          <button
            type="submit"
            className="w-full mt-4 bg-ink text-cream py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-espresso transition-colors"
          >
            Add to ritual
          </button>
        </CartForm>
      ) : (
        <button
          type="button"
          disabled
          className="w-full mt-4 bg-sand text-stone py-4 text-xs uppercase tracking-[0.2em] font-semibold cursor-not-allowed"
        >
          Currently unavailable
        </button>
      )}
    </div>
  );
}
