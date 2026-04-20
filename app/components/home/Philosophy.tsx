import {useState, useEffect, useRef} from 'react';
import {Seal} from '~/components/shared/Seal';

export function Philosophy() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  // Pulse the Seal only while the section is actually on screen.
  // threshold 0.2 = ~20% of the section must be visible to be considered in view.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      {threshold: 0.2},
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Diamond divider — replaces the old cream→ink gradient with the
          same ◆ motif used throughout the site. Cream background so the
          transition into ink below reads as a deliberate pause, not a
          low-contrast gradient fade. */}
      <div className="flex justify-center py-12 bg-cream" aria-hidden="true">
        <span className="text-gold text-sm">&#9670;</span>
      </div>

      <section
        ref={sectionRef}
        id="philosophy"
        aria-label="Our Philosophy"
        className={`philosophy ${inView ? 'in-view' : ''} py-24 px-6 overflow-hidden relative bg-ink`}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full border border-gold/5" />
        <div className="absolute top-[200px] left-[60%] w-[300px] h-[300px] rounded-full border border-gold/5" />
        <div className="absolute top-[100px] left-[30%] w-[200px] h-[200px] rounded-full border border-gold/5" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div>
            <span className="text-gold-light text-[11px] uppercase tracking-[4px] font-semibold font-body">
              Our Philosophy
            </span>

            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] text-cream mt-4 leading-snug">
              We believe a mask is not{' '}
              <em className="italic text-gold-light">skincare.</em> It is a{' '}
              <em className="italic text-gold-light">moment.</em>
            </h2>

            <p className="text-sm text-cream/45 leading-relaxed mt-6">
              In a world of ten-step routines and algorithm-driven hauls, we
              chose a different path. Maison Masque curates only five masks
              &mdash; each selected from Korea&apos;s most revered skincare
              houses for a single, clear intention. We source directly from Hong
              Kong, authenticate every batch, and ship with the care of a house
              that believes in fewer, better things.
            </p>

            <p className="text-sm text-cream/45 leading-relaxed mt-6">
              A sheet mask is fifteen minutes of stillness. A veil between the
              world and your skin. We don&apos;t sell products &mdash; we offer
              rituals. Each one an invitation to pause, to breathe, to feel the
              difference between routine and ceremony.
            </p>

            {/* Stats row */}
            <div className="philo-stats flex gap-8 mt-10">
              <div>
                <div className="font-display text-3xl text-gold">5</div>
                <div className="text-[10px] uppercase tracking-[3px] text-cream/40 mt-1">
                  Curated Brands
                </div>
              </div>
              <div>
                <div className="font-display text-3xl text-gold">40+</div>
                <div className="text-[10px] uppercase tracking-[3px] text-cream/40 mt-1">
                  Countries
                </div>
              </div>
              <div>
                <div className="font-display text-3xl text-gold">100%</div>
                <div className="text-[10px] uppercase tracking-[3px] text-cream/40 mt-1">
                  Authenticated
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex justify-center">
            <Seal />
          </div>
        </div>
      </section>
    </>
  );
}
