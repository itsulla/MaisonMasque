import {Link, type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: 'Your Ritual Awaits Elsewhere | Maison Masque'}];
};

export function loader() {
  throw new Response('Not Found', {status: 404});
}

export default function NotFound() {
  return null;
}

export function ErrorBoundary() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Decorative vertical line */}
        <div className="w-px h-[60px] bg-sand mx-auto mb-8" />

        <span className="text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body">
          Lost in the Maison
        </span>

        <h1 className="font-display text-[clamp(48px,8vw,96px)] leading-none mt-4 text-sand">
          404
        </h1>

        <h2 className="font-display text-2xl mt-4">
          Your ritual awaits elsewhere
        </h2>

        <p className="text-sm text-walnut mt-4 leading-relaxed">
          The page you&apos;re looking for has vanished like a mask after the
          ceremony. Let us guide you back to the collection.
        </p>

        <div className="flex gap-4 justify-center mt-10 flex-wrap">
          <Link
            to="/"
            className="inline-block font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-ink text-cream hover:bg-espresso hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
          >
            Return to the Maison
          </Link>
          <Link
            to="/collections/all"
            className="inline-block font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-transparent border border-sand text-ink hover:text-gold hover:border-gold hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
          >
            Browse all masks
          </Link>
        </div>

        {/* Decorative gold line */}
        <div className="w-[60px] h-px bg-gold mx-auto mt-12" />
      </div>
    </div>
  );
}
