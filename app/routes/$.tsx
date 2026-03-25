import {Link, type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: 'Page Not Found | Maison Masque'}];
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Decorative vertical line */}
        <div className="w-px h-[40px] bg-sand mx-auto mb-8" />

        <span className="text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body">
          Lost in the Maison
        </span>

        <h1 className="font-display text-[clamp(48px,8vw,96px)] leading-none mt-4 text-sand">
          404
        </h1>

        <p className="text-sm text-stone mt-4 leading-relaxed">
          The page you seek has vanished like a mask after the ritual.
          Perhaps it was never meant to be found.
        </p>

        <div className="flex gap-4 justify-center mt-10 flex-wrap">
          <Link
            to="/"
            className="inline-block font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-ink text-cream hover:bg-espresso hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
          >
            Return home
          </Link>
          <Link
            to="/quiz"
            className="inline-block font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-transparent border border-sand text-ink hover:text-gold hover:border-gold hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
          >
            Take the quiz
          </Link>
        </div>

        {/* Decorative bottom line */}
        <div className="w-[60px] h-px bg-gold mx-auto mt-12" />
      </div>
    </div>
  );
}
