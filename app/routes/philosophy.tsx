import type {MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {title: 'Our Philosophy — Maison Masque'},
  {
    name: 'description',
    content:
      'Curated Korean skincare rituals from Hong Kong. Skincare as ceremony.',
  },
  {property: 'og:title', content: 'Our Philosophy — Maison Masque'},
  {
    property: 'og:description',
    content:
      'Curated Korean skincare rituals from Hong Kong. Skincare as ceremony.',
  },
  {property: 'og:type', content: 'article'},
];

const STATS = [
  {value: '5', label: 'Curated Houses'},
  {value: '12', label: 'Rituals & Elixirs'},
  {value: '100%', label: 'Authenticated'},
];

function WaxSealMonogram() {
  return (
    <div className="relative flex items-center justify-center" aria-hidden="true">
      {/* Subtle radial glow behind the seal */}
      <div
        className="absolute inset-0 -m-12 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(197,165,90,0.18) 0%, rgba(197,165,90,0) 65%)',
          filter: 'blur(8px)',
        }}
      />
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        <defs>
          <radialGradient id="sealGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C5A55A" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#C5A55A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#sealGlow)" />
        <circle
          cx="60"
          cy="60"
          r="58"
          fill="none"
          stroke="#C5A55A"
          strokeWidth="1"
          opacity="0.9"
        />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="#C5A55A"
          strokeWidth="0.5"
          opacity="0.55"
        />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="#C5A55A"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <text
          x="60"
          y="74"
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="42"
          fontWeight="500"
          fill="#C5A55A"
          letterSpacing="2"
        >
          MM
        </text>
      </svg>
    </div>
  );
}

export default function PhilosophyRoute() {
  return (
    <div className="philosophy-page" style={{backgroundColor: '#2C2722'}}>
      {/* HERO */}
      <section
        className="relative flex items-center justify-center px-6 overflow-hidden"
        style={{minHeight: '70vh'}}
      >
        {/* Radial gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(197,165,90,0.12) 0%, rgba(197,165,90,0.04) 35%, rgba(44,39,34,0) 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center py-24">
          <p className="text-[11px] uppercase tracking-[5px] font-semibold text-gold mb-10">
            Our Philosophy
          </p>
          <h1
            className="font-display text-cream leading-[1.2]"
            style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 400,
              letterSpacing: '-0.5px',
            }}
          >
            We believe a mask is not skincare. It is{' '}
            <em className="italic text-gold-light">a moment</em>.
          </h1>
          {/* Animated gold line */}
          <div
            className="mx-auto mt-10"
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: '#C5A55A',
              opacity: 0.7,
            }}
          />
        </div>
      </section>

      {/* BODY PARAGRAPH */}
      <section className="px-6 py-20">
        <div className="max-w-[580px] mx-auto text-center">
          <p
            className="font-body text-cream/75"
            style={{fontSize: '16px', lineHeight: 1.8}}
          >
            Maison Masque is a curation, not a catalogue. We source five
            transformative rituals and a small collection of elixirs from the
            most considered houses in Korea — each chosen for the integrity of
            its formula, the precision of its craft, and the quiet clarity it
            brings to the skin. Every mask we carry has been tested by hand in
            Hong Kong before it reaches our door. We believe skincare, at its
            finest, is not a routine performed but a ceremony kept: a deliberate
            pause, a returning to oneself, an act of reverence for the skin you
            wear each day.
          </p>
        </div>
      </section>

      {/* WAX SEAL MONOGRAM */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <WaxSealMonogram />
          <p className="mt-8 text-[10px] uppercase tracking-[4px] text-cream/50">
            The House of Masks &middot; Est. 2026
          </p>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-y-12 sm:gap-y-0"
            style={{
              borderTop: '1px solid rgba(197,165,90,0.2)',
              borderBottom: '1px solid rgba(197,165,90,0.2)',
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center text-center py-16"
                style={{
                  borderLeft:
                    i > 0 ? '1px solid rgba(197,165,90,0.12)' : undefined,
                }}
              >
                <span
                  className="font-display text-gold"
                  style={{
                    fontSize: '64px',
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="mt-5 text-cream/60"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING SPACE */}
      <section className="px-6 py-16">
        <div className="max-w-md mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[4px] text-cream/40">
            Curated in Hong Kong &middot; Shipped with reverence
          </p>
        </div>
      </section>
    </div>
  );
}
