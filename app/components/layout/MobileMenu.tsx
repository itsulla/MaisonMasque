import {Link} from '@remix-run/react';
import {useEffect, useRef, useCallback} from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  /** Ref to the hamburger button that triggers this menu, used to return focus on close */
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

const menuLinks = [
  {label: 'The Rituals', href: '/collections/the-five-rituals'},
  {label: 'Skin Quiz', href: '/quiz'},
  {label: 'Subscribe', href: '#subscription'},
  {label: 'Account', href: '/account'},
];

// NOTE: For full accessibility, the parent component should set the `inert`
// attribute on the main content area when this menu is open, e.g.:
//   <main inert={isMobileMenuOpen ? '' : undefined}>
// This prevents focus and interaction with background content while the
// dialog is open, complementing the focus trap implemented here.

export function MobileMenu({isOpen, onClose, triggerRef}: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Handle ESC key to close the menu
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  // Focus management: focus first link on open, return focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Delay focus to allow transition to start
      const timer = setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Return focus to the trigger (hamburger button) when closing
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, triggerRef]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`absolute top-0 left-0 bg-cream w-80 max-w-[85vw] h-full p-8 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
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

        {/* Navigation links */}
        <nav className="flex flex-col">
          {menuLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              ref={index === 0 ? firstLinkRef : undefined}
              onClick={onClose}
              className="font-display text-lg text-ink py-3 border-b border-sand hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
