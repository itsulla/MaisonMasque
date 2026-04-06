import {Link} from '@remix-run/react';
import {useEffect, useRef, useCallback, useState} from 'react';

const menuLinks = [
  {label: 'The Rituals', href: '/collections/the-five-rituals'},
  {label: 'Skin Quiz', href: '/quiz'},
  {label: 'Subscribe', href: '#subscription'},
  {label: 'Account', href: '/account'},
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const onClose = useCallback(() => setIsOpen(false), []);

  // Listen for open event from Navigation hamburger
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.open) setIsOpen(true);
    };
    window.addEventListener('mm:mobile-menu', handler);
    return () => window.removeEventListener('mm:mobile-menu', handler);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      const timer = setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else if (previousActiveElement.current instanceof HTMLElement) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[110] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{backgroundColor: 'rgba(26,23,20,0.4)'}}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel — slides from right */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`absolute top-0 right-0 bg-cream w-[280px] h-full p-8 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button — top right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-ink"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="mb-10">
          <span className="font-display text-lg uppercase tracking-[4px] text-ink">
            MAISON MASQUE
          </span>
        </div>

        {/* Navigation links — 48px touch targets */}
        <nav className="flex flex-col">
          {menuLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              ref={index === 0 ? firstLinkRef : undefined}
              onClick={onClose}
              className="font-display text-lg text-ink border-b border-sand hover:text-gold transition-colors flex items-center"
              style={{minHeight: '48px'}}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
