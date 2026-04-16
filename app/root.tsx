import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  type MetaFunction,
} from '@remix-run/react';
import {AnnouncementBar} from '~/components/layout/AnnouncementBar';
import {Navigation} from '~/components/layout/Navigation';
import {Footer} from '~/components/layout/Footer';
import {CartDrawer} from '~/components/layout/CartDrawer';
import {MobileMenu} from '~/components/layout/MobileMenu';
import {BottomNav} from '~/components/layout/BottomNav';
import {ScrollProgress} from '~/components/shared/ScrollProgress';
import {EmailPopup} from '~/components/shared/EmailPopup';
import {BackToTop} from '~/components/shared/BackToTop';
import {SocialProofToast} from '~/components/shared/SocialProofToast';
import {AnalyticsScripts, AnalyticsPageview} from '~/components/shared/Analytics';
import {QuizDrawer} from '~/components/shared/QuizDrawer';
import {CartProvider} from '~/lib/cartContext';
import {CurrencyProvider} from '~/lib/currencyContext';
import {QuizDrawerProvider} from '~/lib/quizDrawerContext';
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

const DARK_THEME_ROUTES = new Set<string>(['/philosophy']);

function AppShell() {
  const location = useLocation();
  const theme: 'light' | 'dark' = DARK_THEME_ROUTES.has(location.pathname) ? 'dark' : 'light';
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <ScrollProgress />
      <AnnouncementBar />
      <Navigation theme={theme} />
      <MobileMenu />
      <CartDrawer />
      <main id="main-content" className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer theme={theme} />
      <BottomNav />
      <EmailPopup />
      <SocialProofToast />
      <BackToTop />
    </>
  );
}

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Maison Masque',
  alternateName: 'The House of Masks',
  url: 'https://maisonmasque.com',
  logo: 'https://maisonmasque.com/logo.png',
  description:
    'Curated Korean sheet masks from Medicube, Anua, SKIN1004 and more. Sourced in Hong Kong, shipped worldwide to Australia, UK, Europe and South Africa.',
  sameAs: [
    'https://instagram.com/maisonmasque',
    'https://tiktok.com/@maisonmasque',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'ulrich@lekker.design',
    contactType: 'customer service',
    areaServed: ['AU', 'GB', 'EU', 'ZA', 'US'],
    availableLanguage: 'English',
  },
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Maison Masque',
  url: 'https://maisonmasque.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://maisonmasque.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function App() {
  const location = useLocation();
  const isDark = DARK_THEME_ROUTES.has(location.pathname);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(ORGANIZATION_SCHEMA)}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(WEBSITE_SCHEMA)}}
        />
        <AnalyticsScripts />
      </head>
      <body
        className={`font-body antialiased ${isDark ? 'text-cream' : 'bg-cream text-ink'}`}
        style={isDark ? {backgroundColor: '#2C2722'} : undefined}
      >
        <CurrencyProvider>
          <CartProvider>
            <QuizDrawerProvider>
              <AppShell />
              <QuizDrawer />
            </QuizDrawerProvider>
          </CartProvider>
        </CurrencyProvider>
        <AnalyticsPageview />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
