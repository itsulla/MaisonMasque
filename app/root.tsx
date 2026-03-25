import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import {useState} from 'react';
import {AnnouncementBar} from '~/components/layout/AnnouncementBar';
import {Navigation} from '~/components/layout/Navigation';
import {Footer} from '~/components/layout/Footer';
import {CartDrawer} from '~/components/layout/CartDrawer';
import {MobileMenu} from '~/components/layout/MobileMenu';
import {ScrollProgress} from '~/components/shared/ScrollProgress';
import appStyles from '~/styles/app.css?url';

export function links() {
  return [
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous' as const,
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600&display=swap',
    },
    {rel: 'stylesheet', href: appStyles},
  ];
}

export const meta: MetaFunction = () => {
  return [
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width,initial-scale=1'},
    {
      title:
        'Maison Masque | Korean Sheet Masks | The House of Masks',
    },
    {
      name: 'description',
      content:
        'Curated Korean sheet masks from Biodance, Torriden, Abib, Mediheal and Numbuzin. Shipped worldwide to Australia, UK, Europe and South Africa.',
    },
  ];
};

export async function loader({context}: any) {
  // Normally fetch cart from Shopify via context.cart.get()
  // For now return null so the app compiles without a connected store
  return {cart: null};
}

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-cream text-ink font-body antialiased">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="font-display text-2xl uppercase tracking-[4px] text-ink">
              MAISON MASQUE
            </span>
            <div className="mt-4 w-8 h-px bg-gold mx-auto animate-pulse" />
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const {cart} = useLoaderData<typeof loader>();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartLines = cart?.lines?.nodes ?? cart?.lines ?? [];
  const cartCount = cartLines.reduce(
    (total: number, line: any) => total + (line.quantity ?? 0),
    0,
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-cream text-ink font-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ScrollProgress />
        <AnnouncementBar />
        <Navigation
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
        />
        <main id="main-content">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
