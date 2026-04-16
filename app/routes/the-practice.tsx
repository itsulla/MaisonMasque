import {type MetaFunction} from '@remix-run/react';
import {Link} from '@remix-run/react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {canonicalLink} from '~/lib/seo';

export const meta: MetaFunction = ({location}) => [
  {title: 'The Practice | Maison Masque'},
  {name: 'description', content: 'How to perform a ritual — the Maison Masque guide to sheet masking as ceremony, not routine.'},
  canonicalLink(location.pathname),
];

const STEPS = [
  {
    numeral: 'I',
    name: 'Cleanse',
    time: '2 minutes',
    body: 'End the day. Wash away what it left behind. Use a gentle oil or foam cleanser to remove makeup, sunscreen and pollution. Pat dry \u2014 never rub. The canvas must be clean before the ritual begins.',
  },
  {
    numeral: 'II',
    name: 'Tone & Elixir',
    time: '1 minute',
    body: 'If you use a toner, pat it in now. If you use one of our PDRN elixirs, layer it lightest to heaviest: toner first, then serum. Press each layer into the skin gently, giving it a moment to absorb before the next. This is the foundation the mask will build upon.',
  },
  {
    numeral: 'III',
    name: 'Mask',
    time: '15\u201320 minutes',
    body: 'Unfold the mask. Align to the eyes, smooth outward. Press the sheet against every curve of the face. Then stop. This is the pause. Sit, rest, breathe. The active ingredients are working. You don\u2019t need to do anything more. The mask knows what to do.',
  },
  {
    numeral: 'IV',
    name: 'Absorb',
    time: '1 minute',
    body: 'Remove the mask. Do not rinse. The remaining essence on your skin is the gift \u2014 pat it in with gentle upward motions until it vanishes. Your skin should feel hydrated, plump, and calm.',
  },
  {
    numeral: 'V',
    name: 'Seal',
    time: '30 seconds',
    body: 'If your skin is dry or if you\u2019re performing the ritual at night, follow with a light moisturiser to seal the actives in. In the morning, finish with your Morning Veil \u2014 sunscreen is always the final step before the world.',
  },
];

const PRINCIPLES = [
  {
    heading: 'Consistency over intensity',
    body: 'A ritual performed gently, twice a week, does more than a single heroic session. The skin responds to pattern, not force.',
  },
  {
    heading: 'Temperature matters',
    body: 'Store your sheet masks in the refrigerator for a cooler, more soothing application. The cold constricts pores and reduces puffiness. It also makes the pause feel like a reward.',
  },
  {
    heading: 'Timing is personal',
    body: 'Most sheet masks work in 15\u201320 minutes. Hydrogels (like Medicube\u2019s PDRN Collagen Gel Mask) can stay on for 3\u20134 hours or overnight \u2014 they turn transparent when fully absorbed. Wrapping masks dry to a film and peel off in the morning. Find the format that fits your evening.',
  },
  {
    heading: 'Alternate your masks',
    body: 'The Five Rituals are designed to be used across the week, not all at once. Each mask serves a different intention: restore, renew, calm, refine, soothe. Rotate them to address your skin\u2019s changing needs.',
  },
  {
    heading: 'The moment matters most',
    body: 'A sheet mask is not a product. It is a pause. The fifteen minutes you spend sitting still, doing nothing, letting the mask work \u2014 that is the ritual. The ingredients are secondary to the intention.',
  },
];

export default function ThePracticePage() {
  return (
    <div className="py-24 lg:py-32 px-6">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="w-px h-[60px] bg-sand mx-auto mb-8" aria-hidden="true" />
        <SectionLabel>The Practice</SectionLabel>
        <h1 className="font-display text-[clamp(36px,5.5vw,60px)] mt-4 leading-[1.1]">
          How to perform <span className="italic text-gold">a ritual</span>
        </h1>
        <div className="w-[60px] h-px bg-gold mx-auto mt-6" aria-hidden="true" />
        <p className="text-[15px] text-walnut mt-8 leading-[1.8] max-w-xl mx-auto">
          A sheet mask is not a step in your routine. It is the moment your
          routine was building toward. Here is how we suggest you approach it.
        </p>
      </div>

      {/* Five steps */}
      <section className="max-w-5xl mx-auto mb-24" aria-label="Five steps of the ritual">
        <div className="border border-sand">
          {STEPS.map((step, i) => (
            <div
              key={step.numeral}
              className={`grid grid-cols-1 md:grid-cols-[120px_1fr] ${
                i < STEPS.length - 1 ? 'border-b border-sand' : ''
              }`}
            >
              {/* Numeral column */}
              <div className="flex flex-col items-center justify-center py-8 md:py-12 md:border-r border-sand">
                <span className="font-display text-[48px] text-sand leading-none">
                  {step.numeral}
                </span>
                <span className="text-[10px] uppercase tracking-[2px] text-stone mt-2 font-body">
                  {step.time}
                </span>
              </div>

              {/* Content column */}
              <div className="px-8 py-8 md:py-12">
                <h2 className="font-display text-[clamp(20px,2.5vw,28px)]">
                  {step.name}
                </h2>
                <p className="text-[14px] text-walnut leading-[1.8] mt-4 max-w-2xl">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="max-w-3xl mx-auto mb-20" aria-label="Principles of the practice">
        <div className="text-center mb-14">
          <SectionLabel>Principles</SectionLabel>
          <h2 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
            What we believe about the practice
          </h2>
          <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
        </div>

        <div className="space-y-10">
          {PRINCIPLES.map((principle) => (
            <div key={principle.heading}>
              <h3 className="font-display text-[18px]">{principle.heading}</h3>
              <p className="text-[14px] text-walnut leading-[1.8] mt-3">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center border-t border-sand pt-14 max-w-xl mx-auto">
        <p className="text-[14px] text-walnut">
          Ready to begin?
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link
            to="/collections/the-five-rituals"
            className="bg-ink text-cream text-[11px] uppercase tracking-[3px] font-semibold font-body px-8 py-4 hover:bg-espresso transition-colors"
          >
            Explore The Five Rituals
          </Link>
          <Link
            to="/quiz"
            className="border border-sand text-ink text-[11px] uppercase tracking-[3px] font-semibold font-body px-8 py-4 hover:border-gold hover:text-gold transition-colors"
          >
            Take the Skin Ritual Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
