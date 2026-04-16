import {Link} from '@remix-run/react';

export function MorningVeilPromo() {
  return (
    <section
      className="py-12 lg:py-20 px-6"
      style={{background: '#F8F3EA'}}
      aria-label="The Morning Veil"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left — Text */}
        <div>
          <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold font-body">
            The Morning Veil
          </p>

          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] mt-4 leading-snug">
            Protection as ritual
          </h2>

          <p className="text-sm text-walnut mt-5 leading-[1.7] max-w-md">
            The rituals restore by night. The Morning Veil protects by day. Two
            Korean sunscreens &mdash; one weightless, one tinted &mdash; chosen
            for luminous defence.
          </p>

          <Link
            to="/the-morning-veil"
            className="inline-block mt-8 border border-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold px-8 py-3.5 hover:border-gold hover:text-gold transition-colors duration-300"
          >
            Discover The Morning Veil &rarr;
          </Link>
        </div>

        {/* Right — Visual */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Back card */}
          <div
            className="absolute w-[220px] h-[300px] rounded-sm border border-sand/60"
            style={{
              background: 'linear-gradient(160deg, #F5E6D0 0%, #FAF8F3 60%, #E8D5C4 100%)',
              transform: 'rotate(-3deg) translate(-20px, 12px)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-6xl select-none" style={{color: '#E8D5C420'}}>
                ☀
              </span>
            </div>
          </div>

          {/* Front card */}
          <div
            className="relative w-[220px] h-[300px] rounded-sm border border-sand/80"
            style={{
              background: 'linear-gradient(160deg, #FAF8F3 0%, #F5E6D0 40%, #FAF8F3 100%)',
              transform: 'rotate(2deg) translate(20px, -8px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="font-display text-5xl select-none" style={{color: '#C5A55A18'}}>
                ☀
              </span>
              <div className="text-center">
                <p className="font-display text-sm text-stone/40">SPF50+</p>
                <p className="font-display text-xs text-stone/30">PA++++</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
