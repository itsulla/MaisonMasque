import {Link} from '@remix-run/react';
import {CurrencySelector} from '~/components/shared/CurrencySelector';

const shopLinks = [
  {label: 'The Five Rituals', href: '/collections/the-five-rituals'},
  {label: 'All Masks', href: '/collections/all'},
  {label: 'The Complete Ritual', href: '/collections/the-complete-ritual'},
  {label: 'Subscribe', href: '#subscription'},
];

const discoverLinks = [
  {label: 'Skin Ritual Quiz', href: '/quiz'},
  {label: 'Ingredient Glossary', href: '/pages/ingredients'},
  {label: 'The Practice', href: '/pages/the-practice'},
  {label: 'Journal', href: '/journal'},
];

const careLinks = [
  {label: 'Shipping & Returns', href: '/pages/shipping-returns'},
  {label: 'Contact the Maison', href: '/pages/contact'},
  {label: 'FAQ', href: '/pages/faq'},
  {label: 'Privacy', href: '/pages/privacy'},
];

function FooterLinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: {label: string; href: string}[];
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[3px] font-semibold text-ink mb-4">
        {heading}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="text-sm text-walnut hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="bg-cream border-t border-sand">
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12">
          {/* Brand column */}
          <div>
            <span className="font-display text-lg uppercase tracking-[4px] text-ink">
              MAISON MASQUE
            </span>
            <p className="text-[9px] uppercase tracking-[3px] text-stone mt-1">
              The House of Masks &middot; Est. 2026
            </p>
            <p className="text-sm text-walnut leading-relaxed mt-4">
              A curated ritual of five transformative masks, crafted with
              intention. Each mask is an invitation to pause, to honour the
              skin, and to return to yourself.
            </p>
            <div className="mt-6">
              <CurrencySelector />
            </div>
          </div>

          {/* Link columns with divider */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12 md:border-l md:border-sand md:pl-12">
            <FooterLinkColumn heading="Shop" links={shopLinks} />
            <FooterLinkColumn heading="Discover" links={discoverLinks} />
            <FooterLinkColumn heading="Care" links={careLinks} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-sand flex flex-col sm:flex-row justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[3px] text-stone">
            &copy; 2026 Maison Masque
          </span>
          <span className="text-[10px] uppercase tracking-[3px] text-stone">
            Curated with care &middot; Shipped with reverence
          </span>
        </div>
      </div>
    </footer>
  );
}
