import {Link} from '@remix-run/react';

interface NavigationProps {
  cartCount: number;
  onCartOpen?: () => void;
  onMobileMenuOpen?: () => void;
}

export function Navigation({
  cartCount,
  onCartOpen,
  onMobileMenuOpen,
}: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-xl border-b border-sand">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left nav links */}
        <div className="hidden lg:flex items-center gap-8 flex-1">
          <Link
            to="/collections/the-five-rituals"
            className="text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors"
          >
            The Rituals
          </Link>
          <Link
            to="/quiz"
            className="text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors"
          >
            Skin Quiz
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-ink"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>

        {/* Center logo */}
        <div className="flex flex-col items-center">
          <Link to="/">
            <span className="font-display text-[28px] uppercase tracking-[4px] text-ink">
              MAISON MASQUE
            </span>
          </Link>
          <span className="text-[9px] uppercase tracking-[3px] text-stone">
            The House of Masks &middot; Est. 2026
          </span>
        </div>

        {/* Right nav links */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
          <Link
            to="#subscription"
            className="text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors"
          >
            Subscribe
          </Link>
          <Link
            to="/account"
            className="text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors"
          >
            Account
          </Link>
          <button
            onClick={onCartOpen}
            className="relative text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors"
          >
            Bag
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-gold text-cream rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile cart button */}
        <button
          className="lg:hidden relative"
          onClick={onCartOpen}
          aria-label="Open cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-ink"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-cream rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
