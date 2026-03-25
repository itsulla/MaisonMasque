import {SectionLabel} from '~/components/shared/SectionLabel';

const steps = [
  {
    numeral: 'I',
    heading: 'Cleanse',
    description:
      'Begin with a clean canvas. Wash away the day with gentle, circular motions.',
  },
  {
    numeral: 'II',
    heading: 'Apply',
    description:
      'Unfold your mask with intention. Smooth from center outward, releasing each air pocket.',
  },
  {
    numeral: 'III',
    heading: 'Rest',
    description:
      'Set a timer for fifteen minutes. Close your eyes. Let the essence do its work.',
  },
  {
    numeral: 'IV',
    heading: 'Reveal',
    description:
      'Peel slowly from the edges. Press remaining serum into skin. Feel the difference.',
  },
];

export function RitualGuide() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionLabel>The Practice</SectionLabel>
        <h2 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
          How to perform a ritual
        </h2>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-sand">
        {steps.map((step, index) => (
          <div
            key={step.numeral}
            className={`p-8 text-center ${
              index < steps.length - 1 ? 'border-r border-sand' : ''
            }`}
          >
            <div className="font-display text-5xl text-sand">
              {step.numeral}
            </div>
            <h3 className="font-display text-base mt-4">{step.heading}</h3>
            <p className="text-xs text-stone mt-2 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
