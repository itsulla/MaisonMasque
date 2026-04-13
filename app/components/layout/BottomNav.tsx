import {Link, useLocation} from '@remix-run/react';
import {Home, Sparkles, Droplet, ShoppingBag} from 'lucide-react';
import {useCart} from '~/lib/cartContext';

interface TabItem {
  label: string;
  href: string;
  icon: typeof Home;
  /** Exact match only (e.g. "/") vs. startsWith for nested routes */
  exact?: boolean;
}

const TABS: TabItem[] = [
  {label: 'Home', href: '/', icon: Home, exact: true},
  {label: 'Rituals', href: '/collections/the-five-rituals', icon: Sparkles},
  {label: 'Elixirs', href: '/collections/elixirs', icon: Droplet},
];

function isActive(pathname: string, href: string, exact: boolean | undefined) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

export function BottomNav() {
  const location = useLocation();
  const {itemCount, open: openCart} = useCart();

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-cream border-t border-sand"
      style={{
        boxShadow: '0 -2px 12px rgba(26, 23, 20, 0.04)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <ul className="grid grid-cols-4 h-16">
        {TABS.map(({label, href, icon: Icon, exact}) => {
          const active = isActive(location.pathname, href, exact);
          const color = active ? '#C5A55A' : '#8A8279';
          return (
            <li key={href} className="flex">
              <Link
                to={href}
                className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={22} strokeWidth={1.5} color={color} aria-hidden="true" />
                <span
                  className="font-body uppercase tracking-wider"
                  style={{fontSize: '10px', color}}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}

        {/* Bag — opens cart drawer, not a link */}
        <li className="flex">
          <button
            type="button"
            onClick={openCart}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
            aria-label={
              itemCount > 0
                ? `Bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
                : 'Bag, empty'
            }
          >
            <span className="relative inline-flex">
              <ShoppingBag size={22} strokeWidth={1.5} color="#8A8279" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    top: '-6px',
                    right: '-8px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    lineHeight: 1,
                    color: '#FFFFFF',
                    backgroundColor: '#C5A55A',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </span>
            <span
              className="font-body uppercase tracking-wider"
              style={{fontSize: '10px', color: '#8A8279'}}
            >
              Bag
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
