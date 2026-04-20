import {Link} from '@remix-run/react';
import {useState} from 'react';
import {ritualConfig} from '~/lib/ritualConfig';
import {ChooseYourRitual} from '~/components/home/ChooseYourRitual';

interface QuizResultProps {
  handle: string;
  onRestart?: () => void;
}

export function QuizResult({handle, onRestart}: QuizResultProps) {
  const ritual = ritualConfig[handle];
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const stored = JSON.parse(localStorage.getItem('mm_emails') || '[]');
      stored.push({email: email.trim(), source: 'quiz', ts: Date.now()});
      localStorage.setItem('mm_emails', JSON.stringify(stored));
    } catch {
      // ignore
    }
    setSubmitted(true);
  };

  return (
    <div className="mt-8">
      <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
        Your result
      </p>
      <h2 className="font-display text-[clamp(24px,3vw,32px)] mt-3">
        Your ritual is&hellip;
      </h2>

      {ritual && (
        <div className="border border-sand p-8 mt-6 max-w-sm mx-auto text-left">
          <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold">
            Ritual {ritual.numeral} &mdash; {ritual.name}
          </p>
          <p className="text-sm text-walnut mt-3 leading-relaxed">
            {ritual.theme}
          </p>
          {ritual.keyIngredient && (
            <p className="text-xs text-stone mt-2 flex items-start gap-2">
              <span className="text-gold text-[10px] mt-[2px]">&#9670;</span>
              {ritual.keyIngredient}
            </p>
          )}
          <Link
            to={`/products/${handle}`}
            className="inline-block mt-5 w-full bg-ink text-cream text-center py-3 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-espresso transition-colors"
          >
            Add to ritual
          </Link>
        </div>
      )}

      {/* Explore the other four rituals (relocated from homepage) */}
      <section className="py-14">
        <ChooseYourRitual />
      </section>

      {/* Bundle upsell */}
      <div className="mt-6">
        <p className="text-sm text-walnut">Want the complete experience?</p>
        <Link
          to="/products/the-complete-ritual"
          className="text-xs text-gold hover:text-ink transition-colors mt-1 inline-block"
        >
          The Complete Ritual &mdash; All five for &pound;99 &rarr;
        </Link>
      </div>

      {/* Email capture */}
      <div className="mt-10 border-t border-sand pt-8 max-w-sm mx-auto">
        {submitted ? (
          <div className="text-center">
            <div className="w-[48px] h-[48px] rounded-full border border-gold flex items-center justify-center mx-auto mb-3">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C5A55A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-display text-lg">Your discount awaits</p>
            <p className="text-xs text-stone mt-1">
              Check your inbox for 10% off.
            </p>
          </div>
        ) : (
          <>
            <h3 className="font-display text-lg text-center">
              Get 10% off your first ritual
            </h3>
            <form
              onSubmit={handleEmailSubmit}
              className="mt-4 flex flex-col gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="email-popup-input"
              />
              <button type="submit" className="email-popup-submit">
                Claim my discount
              </button>
            </form>
          </>
        )}
      </div>

      {/* Restart */}
      {onRestart && (
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 text-xs text-stone hover:underline"
        >
          Retake the quiz
        </button>
      )}
    </div>
  );
}
