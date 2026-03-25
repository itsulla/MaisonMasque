import {Link} from '@remix-run/react';
import {ritualConfig} from '~/lib/ritualConfig';

interface QuizResultProps {
  handle: string;
}

export function QuizResult({handle}: QuizResultProps) {
  const ritual = ritualConfig[handle];

  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl">Your ritual is</h2>

      {ritual && (
        <div className="border border-sand p-8 mt-6 max-w-sm mx-auto text-left">
          <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
            Ritual {ritual.numeral} &mdash; {ritual.name}
          </p>
          <p className="text-sm text-stone mt-2">{ritual.theme}</p>
          <Link
            to={`/products/${handle}`}
            className="inline-block mt-4 bg-ink text-cream py-3 px-8 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-espresso transition-colors"
          >
            View this ritual
          </Link>
        </div>
      )}

      {/* Email capture */}
      <div className="mt-10">
        <h3 className="font-display text-lg">
          Join the Maison for 10% off
        </h3>
        <p className="text-xs text-stone mt-1">
          Your first order, delivered with reverence.
        </p>
        <form className="flex gap-2 mt-4 max-w-sm mx-auto">
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="border border-sand p-3 flex-1 text-sm bg-transparent placeholder:text-stone focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            className="bg-ink text-cream px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-espresso transition-colors"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
