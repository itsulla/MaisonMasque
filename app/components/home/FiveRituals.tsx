import {SectionLabel} from '~/components/shared/SectionLabel';
import {Button} from '~/components/shared/Button';
import {RitualCard} from '~/components/home/RitualCard';

interface FiveRitualsProps {
  products: any[];
}

export function FiveRituals({products}: FiveRitualsProps) {
  return (
    <section id="rituals" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionLabel>The Five Rituals</SectionLabel>
        <h2 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
          One mask for every intention
        </h2>
        <p className="text-sm text-stone mt-3">
          Curated from Korea&apos;s most revered skincare houses
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border border-sand">
        {products.map((product: any, index: number) => (
          <div key={product.id}>
            <RitualCard
              product={product}
              index={index}
              className={
                index < products.length - 1 ? 'border-r border-sand' : ''
              }
            />
          </div>
        ))}
      </div>

      {/* Below grid CTA */}
      <div className="text-center mt-12">
        <Button variant="dark" href="/products/the-complete-ritual">
          The Complete Ritual &mdash; All five for &pound;99
        </Button>
      </div>
    </section>
  );
}
