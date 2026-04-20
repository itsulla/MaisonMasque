import {Link} from '@remix-run/react';
import {CurrencySelector} from '~/components/shared/CurrencySelector';

const shopLinks = [
  {label: 'The Five Rituals', href: '/collections/the-five-rituals'},
  {label: 'All Masks', href: '/collections/all'},
  {label: 'The Complete Ritual', href: '/products/the-complete-ritual'},
  {label: 'Subscribe', href: '/#subscription'},
];

const discoverLinks = [
  {label: 'Our Philosophy', href: '/philosophy'},
  {label: 'Skin Ritual Quiz', href: '/quiz'},
  {label: 'Ingredient Glossary', href: '/ingredients'},
  {label: 'The Practice', href: '/the-practice'},
];

const careLinks = [
  {label: 'Shipping & Returns', href: '/policies/shipping-policy'},
  {label: 'Contact the Maison', href: '/contact'},
  {label: 'FAQ', href: '/faq'},
  {label: 'Privacy', href: '/policies/privacy-policy'},
];

function FooterLinkColumn({
  heading,
  links,
  isDark,
}: {
  heading: string;
  links: {label: string; href: string}[];
  isDark: boolean;
}) {
  return (
    <div>
      <h3 className={`text-xs uppercase tracking-[3px] font-semibold mb-4 ${isDark ? 'text-cream' : 'text-ink'}`}>
        {heading}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className={`text-sm transition-colors ${isDark ? 'text-cream/70 hover:text-gold-light' : 'text-walnut hover:text-gold'}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface FooterProps {
  theme?: 'light' | 'dark';
}

export function Footer({theme = 'light'}: FooterProps) {
  const isDark = theme === 'dark';
  return (
    <footer
      id="footer"
      className={isDark ? 'border-t' : 'bg-cream border-t border-sand'}
      style={
        isDark
          ? {
              backgroundColor: '#2C2722',
              borderTopColor: 'rgba(197,165,90,0.15)',
            }
          : undefined
      }
    >
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12">
          {/* Brand column */}
          <div>
            <span className={`font-logo text-lg uppercase tracking-[3px] ${isDark ? 'text-cream' : 'text-ink'}`}>
              MAISON MASQUE
            </span>
            <p className={`text-[9px] uppercase tracking-[3px] mt-1 ${isDark ? 'text-cream/50' : 'text-stone'}`}>
              The House of Masks &middot; Est. 2026
            </p>
            <p className={`text-sm leading-relaxed mt-4 ${isDark ? 'text-cream/70' : 'text-walnut'}`}>
              A curated ritual of five transformative masks, crafted with
              intention. Each mask is an invitation to pause, to honour the
              skin, and to return to yourself.
            </p>
            <div className="mt-6">
              <CurrencySelector />
            </div>
          </div>

          {/* Link columns with divider */}
          <div
            className={`md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12 md:border-l md:pl-12 ${isDark ? '' : 'md:border-sand'}`}
            style={isDark ? {borderLeftColor: 'rgba(197,165,90,0.15)'} : undefined}
          >
            <FooterLinkColumn heading="Shop" links={shopLinks} isDark={isDark} />
            <FooterLinkColumn heading="Discover" links={discoverLinks} isDark={isDark} />
            <FooterLinkColumn heading="Care" links={careLinks} isDark={isDark} />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between gap-2 ${isDark ? '' : 'border-sand'}`}
          style={isDark ? {borderTopColor: 'rgba(197,165,90,0.15)'} : undefined}
        >
          <span className={`text-[10px] uppercase tracking-[3px] ${isDark ? 'text-cream/50' : 'text-stone'}`}>
            &copy; 2026 Maison Masque
          </span>
          <span className={`text-[10px] uppercase tracking-[3px] ${isDark ? 'text-cream/50' : 'text-stone'}`}>
            Curated with care &middot; Shipped with reverence
          </span>
        </div>
      </div>
    </footer>
  );
}
