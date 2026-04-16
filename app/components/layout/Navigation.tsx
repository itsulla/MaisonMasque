import {Link} from '@remix-run/react';
import {useEffect, useState, useRef} from 'react';
import {useCart} from '~/lib/cartContext';

const SCROLL_THRESHOLD = 10;
const SECTION_IDS = ['hero', 'rituals', 'philosophy', 'practice', 'subscription', 'footer'];

interface NavLinkItem {
  label: string;
  href: string;
  section?: string;
}

// Shortened labels keep the row on a single line at lg, match editorial
// voice, and balance the logo with a 4/3 left-right split.
const LEFT_LINKS: NavLinkItem[] = [
  {label: 'All', href: '/collections/all'},
  {label: 'Rituals', href: '/collections/the-five-rituals', section: 'rituals'},
  {label: 'Elixirs', href: '/collections/elixirs'},
  {label: 'Evening', href: '/products/the-evening-ritual'},
];

const RIGHT_LINKS: NavLinkItem[] = [
  {label: 'Complete Ritual', href: '/products/the-complete-ritual'},
  {label: 'Bundles', href: '/build-your-own'},
  {label: 'Quiz', href: '/quiz'},
];

export interface NavigationProps {
  theme?: 'light' | 'dark';
}

export function Navigation({theme = 'light'}: NavigationProps) {
  const isDark = theme === 'dark';
  const {itemCount, open: openCart} = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll-aware background transition
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const visibleSections = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        }
        let best = '';
        let bestRatio = 0;
        for (const [id, ratio] of visibleSections) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActiveSection(best);
      },
      {
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const bagLabel =
    itemCount > 0
      ? `Bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
      : 'Bag, empty';

  const navLinkClass = (section?: string) =>
    `text-xs uppercase tracking-[3px] whitespace-nowrap transition-colors duration-300 ${
      section && activeSection === section
        ? 'text-gold'
        : isDark
          ? 'text-cream/70 hover:text-gold-light'
          : 'text-walnut hover:text-gold'
    }`;

  return (
    <header
      className={`nav-header sticky top-0 z-[100] transition-all duration-300 ease-in-out ${
        scrolled ? 'nav-scrolled' : 'nav-top'
      } ${isDark ? 'nav-dark' : ''}`}
      style={isDark ? {backgroundColor: '#2C2722', borderBottom: '1px solid rgba(197,165,90,0.15)'} : undefined}
    >
      <nav
        className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Left nav links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1">
          {LEFT_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={navLinkClass(link.section)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          onClick={() => {
            // Dispatch custom event for MobileMenu
            window.dispatchEvent(new CustomEvent('mm:mobile-menu', {detail: {open: true}}));
          }}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-6 h-6 ${isDark ? 'text-cream' : 'text-ink'}`}
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
          <Link
            to="/"
            className="nav-logo-link block transition-transform duration-300 ease-in-out"
            style={{transform: scrolled ? 'scale(0.9)' : 'scale(1)'}}
          >
            <span className={`font-display text-[28px] uppercase tracking-[4px] ${isDark ? 'text-cream' : 'text-ink'}`}>
              MAISON MASQUE
            </span>
          </Link>
          <span
            className={`nav-subtitle text-[9px] uppercase tracking-[3px] transition-all duration-300 ease-in-out overflow-hidden ${isDark ? 'text-cream/50' : 'text-stone'}`}
            style={{
              opacity: scrolled ? 0 : 1,
              maxHeight: scrolled ? '0px' : '20px',
            }}
          >
            The House of Masks &middot; Est. 2026
          </span>
        </div>

        {/* Right nav links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-end">
          {RIGHT_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={navLinkClass(link.section)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={openCart}
            className={`relative text-xs uppercase tracking-[3px] transition-colors ${isDark ? 'text-cream/70 hover:text-gold-light' : 'text-walnut hover:text-gold'}`}
            aria-label={bagLabel}
          >
            Bag
            {itemCount > 0 && (
              <span
                className="cart-badge"
                aria-hidden="true"
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile cart button */}
        <button
          className="lg:hidden relative"
          onClick={openCart}
          aria-label={bagLabel}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-6 h-6 ${isDark ? 'text-cream' : 'text-ink'}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          {itemCount > 0 && (
            <span
              className="cart-badge cart-badge-mobile"
              aria-hidden="true"
            >
              {itemCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
