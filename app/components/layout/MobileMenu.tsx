import {Link} from '@remix-run/react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  {label: 'The Rituals', href: '/collections/the-five-rituals'},
  {label: 'Skin Quiz', href: '/quiz'},
  {label: 'Subscribe', href: '#subscription'},
  {label: 'Account', href: '/account'},
];

export function MobileMenu({isOpen, onClose}: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Menu panel */}
      <div
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
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
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
