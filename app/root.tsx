import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type MetaFunction,
} from '@remix-run/react';
import {AnnouncementBar} from '~/components/layout/AnnouncementBar';
import {Navigation} from '~/components/layout/Navigation';
import {Footer} from '~/components/layout/Footer';
import {CartDrawer} from '~/components/layout/CartDrawer';
import {MobileMenu} from '~/components/layout/MobileMenu';
import {ScrollProgress} from '~/components/shared/ScrollProgress';
import {EmailPopup} from '~/components/shared/EmailPopup';
import {BackToTop} from '~/components/shared/BackToTop';
import {SocialProofToast} from '~/components/shared/SocialProofToast';
import {CartProvider} from '~/lib/cartContext';
import {CurrencyProvider} from '~/lib/currencyContext';
import appStyles from '~/styles/app.css?url';

export function links() {
  const googleFontsUrl =
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600&display=swap';

  return [
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous' as const,
    },
    {
      rel: 'preload',
      href: googleFontsUrl,
      as: 'style',
    },
    {
      rel: 'stylesheet',
      href: googleFontsUrl,
    },
    {rel: 'stylesheet', href: appStyles},
  ];
}

export const meta: MetaFunction = () => {
  const title = 'Maison Masque | Korean Sheet Masks | The House of Masks';
  const description =
    'Curated Korean sheet masks from Biodance, Torriden, Abib, Mediheal and Numbuzin. Shipped worldwide to Australia, UK, Europe and South Africa.';

  return [
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width,initial-scale=1'},
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: 'Maison Masque'},
    {property: 'og:locale', content: 'en_US'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ];
};

export async function loader({context}: any) {
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

function AppShell() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <ScrollProgress />
      <AnnouncementBar />
      <Navigation />
      <MobileMenu />
      <CartDrawer />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <EmailPopup />
      <SocialProofToast />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-cream text-ink font-body antialiased">
        <CurrencyProvider>
          <CartProvider>
            <AppShell />
          </CartProvider>
        </CurrencyProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
