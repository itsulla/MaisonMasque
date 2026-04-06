import {useEffect, useState, useRef, useCallback} from 'react';

const MESSAGES = [
  {name: 'Sarah', city: 'Melbourne', product: 'Ritual I — Restore'},
  {name: 'Emma', city: 'London', product: 'Ritual III — Calm'},
  {name: 'Yuki', city: 'Tokyo', product: 'The Complete Ritual'},
  {name: 'Chloé', city: 'Paris', product: 'Ritual IV — Illuminate'},
  {name: 'Leah', city: 'Cape Town', product: 'Ritual II — Renew'},
  {name: 'Mia', city: 'Sydney', product: 'Ritual V — Soothe'},
];

const TIMESTAMPS = ['2 minutes ago', '5 minutes ago', '8 minutes ago', '12 minutes ago', 'just now', '3 minutes ago'];
const MAX_TOASTS_PER_SESSION = 3;
const INITIAL_DELAY = 12000;
const DISPLAY_DURATION = 5000;

function randomInterval() {
  return 30000 + Math.random() * 15000; // 30–45s
}

export function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [timestamp, setTimestamp] = useState(TIMESTAMPS[0]);
  const indexRef = useRef(0);
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback(() => {
    // Check session limit
    try {
      const stored = parseInt(sessionStorage.getItem('mm_toast_count') || '0', 10);
      if (stored >= MAX_TOASTS_PER_SESSION) return;
      countRef.current = stored;
    } catch {
      // proceed
    }

    const idx = indexRef.current % MESSAGES.length;
    setMessage(MESSAGES[idx]);
    setTimestamp(TIMESTAMPS[idx % TIMESTAMPS.length]);
    indexRef.current++;
    setVisible(true);

    countRef.current++;
    try {
      sessionStorage.setItem('mm_toast_count', String(countRef.current));
    } catch {
      // ignore
    }

    // Auto-dismiss
    setTimeout(() => {
      setVisible(false);

      // Schedule next if under limit
      if (countRef.current < MAX_TOASTS_PER_SESSION) {
        timerRef.current = setTimeout(showToast, randomInterval());
      }
    }, DISPLAY_DURATION);
  }, []);

  useEffect(() => {
    try {
      const stored = parseInt(sessionStorage.getItem('mm_toast_count') || '0', 10);
      if (stored >= MAX_TOASTS_PER_SESSION) return;
    } catch {
      // proceed
    }

    timerRef.current = setTimeout(showToast, INITIAL_DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showToast]);

  return (
    <div
      className={`social-proof-toast ${visible ? 'social-proof-visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      {/* Gold avatar circle */}
      <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center flex-shrink-0">
        <span className="font-display text-xs text-gold">
          {message.name[0]}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink leading-snug">
          <span className="font-semibold">{message.name}</span> from{' '}
          {message.city} just purchased{' '}
          <span className="text-gold">{message.product}</span>
        </p>
        <p className="text-[10px] text-stone mt-0.5">{timestamp}</p>
      </div>
    </div>
  );
}
