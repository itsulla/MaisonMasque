import {useEffect, useState, useCallback, useRef} from 'react';

type PopupPhase = 'hidden' | 'entering' | 'visible' | 'leaving' | 'success';

export function EmailPopup() {
  const [phase, setPhase] = useState<PopupPhase>('hidden');
  const [email, setEmail] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const triggered = useRef(false);

  const show = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;
    try {
      if (sessionStorage.getItem('mm_popup_shown')) return;
      sessionStorage.setItem('mm_popup_shown', '1');
    } catch {
      // sessionStorage unavailable
    }
    setPhase('entering');
    setTimeout(() => setPhase('visible'), 400);
  }, []);

  const close = useCallback(() => {
    if (phase === 'hidden' || phase === 'leaving') return;
    setPhase('leaving');
    setTimeout(() => setPhase('hidden'), 300);
  }, [phase]);

  // Trigger: 8s timer OR 60% scroll
  useEffect(() => {
    try {
      if (sessionStorage.getItem('mm_popup_shown')) return;
    } catch {
      // proceed
    }

    const timer = setTimeout(show, 8000);

    const onScroll = () => {
      const scrollPct =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct > 0.6) show();
    };

    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [show]);

  // Escape key
  useEffect(() => {
    if (phase === 'hidden') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [phase, close]);

  // Focus input on open
  useEffect(() => {
    if (phase === 'visible') {
      inputRef.current?.focus();
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const stored = JSON.parse(localStorage.getItem('mm_emails') || '[]');
      stored.push({email: email.trim(), ts: Date.now()});
      localStorage.setItem('mm_emails', JSON.stringify(stored));
    } catch {
      // localStorage unavailable
    }
    setPhase('success');
    setTimeout(close, 2500);
  };

  if (phase === 'hidden') return null;

  const isOpen = phase === 'entering' || phase === 'visible' || phase === 'success';
  const isLeaving = phase === 'leaving';

  return (
    <div
      className="email-popup-backdrop"
      style={{
        opacity: isLeaving ? 0 : isOpen ? 1 : 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Join the Maison"
    >
      <div
        className="email-popup-modal"
        style={{
          opacity: isLeaving ? 0 : isOpen ? 1 : 0,
          transform: isLeaving
            ? 'scale(0.95)'
            : isOpen
              ? 'scale(1)'
              : 'scale(0.95)',
        }}
      >
        {phase === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-6">
            {/* Gold checkmark */}
            <div className="w-[60px] h-[60px] rounded-full border border-gold flex items-center justify-center">
              <svg
                width="28"
                height="28"
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
            <p className="font-display text-xl text-ink">
              Welcome to the Maison
            </p>
          </div>
        ) : (
          <>
            {/* MM Monogram */}
            <div className="w-[60px] h-[60px] rounded-full border border-gold flex items-center justify-center mx-auto mb-5">
              <span className="font-display text-2xl text-gold leading-none">
                MM
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-2xl text-ink text-center">
              Join the Maison
            </h2>

            {/* Subtext */}
            <p className="text-sm text-walnut text-center mt-3 max-w-[320px] mx-auto leading-relaxed">
              Receive your first ritual with 10% off, plus early access to new
              masks and seasonal collections.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 w-full">
              <input
                ref={inputRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="email-popup-input"
              />
              <button type="submit" className="email-popup-submit">
                Begin the ritual
              </button>
            </form>

            {/* Dismiss */}
            <button
              type="button"
              onClick={close}
              className="mt-4 text-xs text-walnut hover:underline cursor-pointer mx-auto block"
              aria-label="Dismiss dialog"
            >
              No thank you
            </button>
          </>
        )}
      </div>
    </div>
  );
}
