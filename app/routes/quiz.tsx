import {type MetaFunction} from '@remix-run/react';

// Skin quiz component — try to import, fallback to inline placeholder
let SkinQuiz: React.FC;

try {
  SkinQuiz = require('~/components/quiz/SkinQuiz').SkinQuiz;
} catch {
  SkinQuiz = SkinQuizPlaceholder;
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Find Your Ritual | Maison Masque'},
    {
      name: 'description',
      content:
        'Take the Maison Masque skin ritual quiz to discover which Korean sheet mask is perfect for your skin type and concerns.',
    },
  ];
};

function SkinQuizPlaceholder() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <span className="text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body">
        Discover Your Ritual
      </span>
      <h1 className="font-display text-[clamp(28px,3.5vw,42px)] mt-3">
        Find Your <em className="italic text-gold">Perfect</em> Mask
      </h1>
      <p className="text-sm text-stone mt-4 max-w-md mx-auto leading-relaxed">
        Answer five simple questions about your skin type, concerns, and
        preferences. We will recommend the ritual that is right for you.
      </p>

      {/* Placeholder steps */}
      <div className="mt-12 border border-sand p-8">
        <p className="text-xs uppercase tracking-[3px] text-stone mb-6">
          Step 1 of 5
        </p>

        {/* Progress bar */}
        <div className="w-full h-px bg-sand mb-8">
          <div className="w-1/5 h-full bg-gold" />
        </div>

        <h2 className="font-display text-xl mb-6">
          What is your skin type?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Dry', 'Oily', 'Combination', 'Sensitive'].map((option) => (
            <button
              key={option}
              className="border border-sand py-4 px-6 text-sm text-ink hover:border-gold hover:text-gold transition-colors"
            >
              {option}
            </button>
          ))}
        </div>

        <p className="text-xs text-stone mt-8">
          Quiz functionality coming soon. In the meantime, explore{' '}
          <a
            href="/collections/the-five-rituals"
            className="text-gold hover:underline"
          >
            The Five Rituals
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function QuizRoute() {
  return <SkinQuiz />;
}
