import {SectionLabel} from '~/components/shared/SectionLabel';
import {Button} from '~/components/shared/Button';

const tiers = [
  {
    name: 'The Introduction',
    masks: '5 masks',
    frequency: 'Monthly',
    price: '\u00A322/mo',
    save: 'Save 10%',
    featured: false,
  },
  {
    name: 'The Collection',
    masks: '10 masks',
    frequency: 'Monthly',
    price: '\u00A338/mo',
    save: 'Save 15%',
    featured: true,
  },
  {
    name: 'The Archive',
    masks: '20 masks',
    frequency: 'Bi-monthly',
    price: '\u00A368/2mo',
    save: 'Save 20%',
    featured: false,
  },
];

export function Subscription() {
  return (
    <section id="subscription" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="border border-sand">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left column */}
          <div className="p-12">
            <SectionLabel>La C&eacute;r&eacute;monie</SectionLabel>
            <h2 className="font-display text-[clamp(24px,3vw,36px)] mt-4">
              A ritual, delivered.
            </h2>
            <p className="text-sm text-stone mt-4 leading-relaxed">
              Choose your frequency, and we&apos;ll deliver a curated selection
              of our finest masks to your door each month. No algorithms, no
              guesswork &mdash; just the five rituals your skin needs, wrapped
              and sealed with the care of a house that believes in ceremony over
              convenience.
            </p>
            <div className="mt-8">
              <Button variant="dark" href="#">
                Subscribe now
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="p-8 flex flex-col gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`border p-6 flex justify-between items-center transition-all duration-300 hover:-translate-y-[1px] ${
                  tier.featured
                    ? 'border-gold bg-gold-pale hover:shadow-[0_4px_16px_rgba(197,165,90,0.12)]'
                    : 'border-sand hover:border-stone'
                }`}
              >
                {/* Left */}
                <div>
                  <div className="font-display text-lg">{tier.name}</div>
                  <div className="text-xs text-stone mt-1">
                    {tier.masks} &middot; {tier.frequency}
                  </div>
                </div>

                {/* Right */}
                <div className="text-right">
                  <div className="font-display text-xl">{tier.price}</div>
                  <div className="text-[10px] uppercase text-gold mt-1">
                    {tier.save}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
