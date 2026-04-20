import {Link} from '@remix-run/react';
import {useEffect, useState, useRef} from 'react';
import {useCart} from '~/lib/cartContext';

const SCROLL_THRESHOLD = 10;
const SECTION_IDS = ['hero', 'rituals', 'philosophy', 'practice', 'subscription', 'footer'];

interface NavLinkItem {
  label: string;
  href: string;
  section?: string;
  hasMegaMenu?: boolean;
}

const LEFT_LINKS: NavLinkItem[] = [
  {label: 'The Rituals', href: '/collections/the-five-rituals', section: 'rituals', hasMegaMenu: true},
  {label: 'The Practice', href: '/the-practice', section: 'practice'},
];

const RIGHT_LINKS: NavLinkItem[] = [
  {label: 'Subscribe', href: '#subscription', section: 'subscription'},
  {label: 'Quiz', href: '/quiz'},
];

// Mega-menu content for "The Rituals".
// Handles + ritual names must match the live catalog in app/lib/products.ts —
// previously pointed at aspirational handles (biodance / torriden / mediheal)
// that produced 5 × 404 in production. Keep this in sync with the `ritualName`
// field on each product record.
const MEGA_BY_RITUAL: {numeral: string; name: string; href: string}[] = [
  {numeral: 'I',   name: 'Restore', href: '/products/medicube-pdrn-gel-mask'},
  {numeral: 'II',  name: 'Renew',   href: '/products/medicube-wrapping-mask'},
  {numeral: 'III', name: 'Calm',    href: '/products/abib-heartleaf-gummy-mask'},
  {numeral: 'IV',  name: 'Refine',  href: '/products/numbuzin-no3-pore-mask'},
  {numeral: 'V',   name: 'Soothe',  href: '/products/skin1004-centella-sleeping-pack'},
];

const MEGA_BY_COLLECTION: {label: string; href: string}[] = [
  {label: 'The Complete Ritual', href: '/products/the-complete-ritual'},
  {label: 'Build Your Bundle',   href: '/build-your-own'},
  {label: 'The Evening Ritual',  href: '/products/the-evening-ritual'},
  {label: 'Elixirs',             href: '/collections/elixirs'},
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

  // Mega-menu: track which link's panel is open (by href). Null = all closed.
  // Close is delayed 200ms via closeTimerRef so diagonal mouse paths from
  // the link to the panel don't dismiss the menu.
  const [openMega, setOpenMega] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleMegaClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenMega(null), 200);
  };
  const cancelMegaClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }, []);

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
    `text-xs uppercase tracking-[3px] transition-colors duration-300 ${
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
        <div className="hidden lg:flex items-center gap-8 flex-1">
          {LEFT_LINKS.map((link) => {
            if (!link.hasMegaMenu) {
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={navLinkClass(link.section)}
                >
                  {link.label}
                </Link>
              );
            }
            const isOpen = openMega === link.href;
            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => { cancelMegaClose(); setOpenMega(link.href); }}
                onMouseLeave={scheduleMegaClose}
                onFocus={() => { cancelMegaClose(); setOpenMega(link.href); }}
                onBlur={scheduleMegaClose}
              >
                <Link
                  to={link.href}
                  className={navLinkClass(link.section)}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}
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
            <span className={`font-logo text-[30px] uppercase tracking-[3px] ${isDark ? 'text-cream' : 'text-ink'}`}>
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
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
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

      {/* ── Mega-menu panel ─────────────────────────────────────────────
          Continues the 1px sand line from the nav (no new top border)
          via a subtle shadow only. Closes on mouseleave with a 200ms
          delay so diagonal paths from link → panel don't dismiss it.
      */}
      {LEFT_LINKS.filter((l) => l.hasMegaMenu).map((link) => {
        const isOpen = openMega === link.href;
        return (
          <div
            key={`mega-${link.href}`}
            className="hidden lg:block absolute left-0 right-0 top-full bg-cream border-t border-sand overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
            style={{
              maxHeight: isOpen ? '340px' : '0px',
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              boxShadow: isOpen ? '0 12px 40px -12px rgba(0,0,0,0.06)' : 'none',
            }}
            onMouseEnter={cancelMegaClose}
            onMouseLeave={scheduleMegaClose}
            aria-hidden={!isOpen}
          >
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 gap-16">
              {/* Column 1 — By ritual */}
              <div>
                <p className="text-[11px] uppercase tracking-[4px] font-semibold text-gold mb-5">
                  By ritual
                </p>
                <ul className="flex flex-col gap-3">
                  {MEGA_BY_RITUAL.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="font-display text-[15px] text-ink hover:text-gold transition-colors inline-flex items-baseline gap-3"
                      >
                        <span className="text-gold text-[12px] w-5 inline-block">{item.numeral}</span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 — By collection */}
              <div>
                <p className="text-[11px] uppercase tracking-[4px] font-semibold text-gold mb-5">
                  By collection
                </p>
                <ul className="flex flex-col gap-3">
                  {MEGA_BY_COLLECTION.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="font-display text-[15px] text-ink hover:text-gold transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </header>
  );
}
