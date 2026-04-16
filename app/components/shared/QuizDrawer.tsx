import {useEffect, useRef} from 'react';
import {Link} from '@remix-run/react';
import {useQuizDrawer} from '~/lib/quizDrawerContext';

/**
 * Right-side offcanvas drawer for the Skin Ritual Quiz trigger.
 * 480px wide on desktop, full-screen on mobile (via CSS).
 * Focus-trapped within the drawer while open; Escape closes it.
 *
 * For now the drawer shows an intro panel + "Begin the quiz" CTA that
 * navigates to /quiz. The actual 5-step quiz flow remains on the /quiz
 * route — we're only adding the preview/entry experience here. The
 * architecture is ready for the quiz itself to be ported inline later.
 */
export function QuizDrawer() {
  const {open, closeDrawer} = useQuizDrawer();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when the drawer opens (accessible entry point)
  useEffect(() => {
    if (open) {
      // Small delay for CSS transition to start before focus shifts
      const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Primitive focus trap — Tab cycles within the drawer only
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Backdrop — click-outside to close */}
      <div
        className={`quiz-drawer-backdrop ${open ? 'is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        className={`quiz-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-drawer-title"
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-sand">
            <p className="text-[11px] uppercase tracking-[4px] font-semibold text-gold-deep">
              Skin Ritual Quiz
            </p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeDrawer}
              className="text-ink hover:text-gold-deep transition-colors text-2xl leading-none"
              aria-label="Close quiz drawer"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-10">
            {/* Decorative vertical line */}
            <div className="w-px h-[60px] bg-sand mx-auto mb-8" />

            <h2
              id="quiz-drawer-title"
              className="font-display text-[clamp(28px,4vw,38px)] text-ink text-center leading-tight"
            >
              Find <em className="italic text-gold">your</em> ritual
            </h2>

            <div className="w-[60px] h-px bg-gold mx-auto mt-6 mb-8" />

            <p className="text-[14px] text-walnut leading-relaxed text-center max-w-sm mx-auto">
              Five questions, one minute. We&rsquo;ll match you with the mask that
              meets your skin where it is tonight.
            </p>

            {/* Quiz preview — what the five steps cover */}
            <ul className="mt-10 space-y-3 max-w-sm mx-auto">
              {[
                'Your skin type',
                'Today&rsquo;s concerns',
                'Masking frequency',
                'Texture preference',
                'Priority: brighten, calm, firm?',
              ].map((step, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-[13px] text-walnut"
                >
                  <span className="font-display text-gold text-base w-6 text-center">
                    {['I', 'II', 'III', 'IV', 'V'][i]}
                  </span>
                  <span dangerouslySetInnerHTML={{__html: step}} />
                </li>
              ))}
            </ul>
          </div>

          {/* Footer CTA */}
          <div className="border-t border-sand px-6 md:px-8 py-5">
            <Link
              to="/quiz"
              onClick={closeDrawer}
              className="block w-full text-center h-[52px] leading-[52px] bg-ink text-cream font-display text-[13px] uppercase tracking-[3px] hover:bg-espresso transition-colors"
            >
              Begin the quiz
            </Link>
            <p className="text-[10px] uppercase tracking-[2px] text-stone text-center mt-3">
              Takes about 1 minute
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
