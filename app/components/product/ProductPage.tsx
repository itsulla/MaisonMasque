import {Link} from '@remix-run/react';
import {ProductGallery} from './ProductGallery';
import {PriceDisplay} from './PriceDisplay';
import {AddToCart} from './AddToCart';
import {TrustBadges} from './TrustBadges';
import {ritualConfig} from '~/lib/ritualConfig';

interface ProductPageProps {
  product: any;
}

export function ProductPage({product}: ProductPageProps) {
  const handle = product.handle;
  const ritual = ritualConfig[handle] ?? null;

  const images =
    product.images?.nodes?.map((img: any) => ({
      url: img.url,
      altText: img.altText,
      width: img.width,
      height: img.height,
    })) ?? [];

  const firstVariant = product.variants?.nodes?.[0];
  const variantId = firstVariant?.id ?? '';
  const available = firstVariant?.availableForSale ?? false;
  const price = firstVariant?.price ?? product.priceRange?.minVariantPrice;
  const compareAtPrice =
    firstVariant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto py-12 px-6">
      <ProductGallery images={images} title={product.title} />

      <div>
        <nav className="text-xs text-stone">
          <Link to="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span className="mx-1">&gt;</span>
          <Link
            to="/collections/the-five-rituals"
            className="hover:text-ink transition-colors"
          >
            The Five Rituals
          </Link>
          <span className="mx-1">&gt;</span>
          <span className="text-walnut">{product.title}</span>
        </nav>

        {ritual && (
          <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold mt-4">
            Ritual {ritual.numeral} &mdash; {ritual.name}
          </p>
        )}

        {product.vendor && (
          <p className="text-[10px] uppercase tracking-[3px] text-stone mt-2">
            {product.vendor}
          </p>
        )}

        <h1 className="font-display text-[28px] mt-2">{product.title}</h1>

        {price && (
          <PriceDisplay price={price} compareAtPrice={compareAtPrice} />
        )}

        {product.description && (
          <p className="text-sm text-stone mt-4 leading-relaxed">
            {product.description}
          </p>
        )}

        <AddToCart
          productId={product.id}
          variantId={variantId}
          available={available}
        />

        <TrustBadges />
      </div>
    </div>
  );
}
