import {useEffect, useRef} from 'react';
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

/**
 * "How to perform a ritual" — four steps that fade up in sequence as the
 * section enters the viewport. Uses IntersectionObserver once; after the
 * reveal triggers, the observer disconnects. Respects prefers-reduced-motion
 * (CSS takes care of the fallback by forcing opacity:1).
 */
export function RitualGuide() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const stepEls = grid.querySelectorAll<HTMLElement>('.practice-step');
          stepEls.forEach((el, i) => {
            el.style.setProperty('--stagger', `${i * 150}ms`);
            el.classList.add('practice-visible');
          });
          io.disconnect();
          break;
        }
      },
      {threshold: 0.25},
    );
    io.observe(grid);
    return () => io.disconnect();
  }, []);

  return (
    <section id="practice" aria-label="The Practice" className="py-14 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionLabel>The Practice</SectionLabel>
        <h2 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
          How to perform a ritual
        </h2>
      </div>

      {/* Steps grid — airy, no dividers, staggered fade-up on viewport entry */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4"
      >
        {steps.map((step) => (
          <div key={step.numeral} className="practice-step p-8 text-center">
            <div className="font-display text-5xl text-sand">
              {step.numeral}
            </div>
            <h3 className="font-display text-base mt-4">{step.heading}</h3>
            <p className="text-xs text-walnut mt-2 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
