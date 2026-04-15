import {useEffect} from 'react';
import {useLocation} from '@remix-run/react';

/**
 * GA4 + Meta Pixel loader + SPA pageview tracker.
 *
 * Replace the placeholder IDs below with real ones before go-live:
 *   - GA4 Measurement ID:  G-XXXXXXXXXX
 *   - Meta Pixel ID:       0000000000000000
 *
 * On each SPA route change, we re-fire both pageview events so the funnel
 * stays clean (Remix doesn't reload the document between routes).
 */
const GA4_ID = 'G-XXXXXXXXXX';
const META_PIXEL_ID = '0000000000000000';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export function AnalyticsScripts() {
  // Don't render real scripts until placeholders are replaced
  const ga4Active = GA4_ID.startsWith('G-') && !GA4_ID.includes('XXXXX');
  const pixelActive = META_PIXEL_ID.length === 16 && !/^0+$/.test(META_PIXEL_ID);

  return (
    <>
      {ga4Active && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', { send_page_view: false });
              `,
            }}
          />
        </>
      )}
      {pixelActive && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
            `,
          }}
        />
      )}
    </>
  );
}

/**
 * Fires a pageview on every route change. Safe to mount at root.
 */
export function AnalyticsPageview() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = location.pathname + location.search;
    if (window.gtag && GA4_ID.startsWith('G-') && !GA4_ID.includes('XXXXX')) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
    if (window.fbq && !/^0+$/.test(META_PIXEL_ID)) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, location.search]);

  return null;
}

/**
 * Helpers for e-commerce events — call these from cart/checkout components.
 */
export const analytics = {
  addToCart(params: {item_id: string; item_name: string; price: number; quantity: number; currency?: string}) {
    if (typeof window === 'undefined') return;
    window.gtag?.('event', 'add_to_cart', {
      currency: params.currency ?? 'USD',
      value: params.price * params.quantity,
      items: [{
        item_id: params.item_id,
        item_name: params.item_name,
        price: params.price,
        quantity: params.quantity,
      }],
    });
    window.fbq?.('track', 'AddToCart', {
      content_ids: [params.item_id],
      content_name: params.item_name,
      value: params.price * params.quantity,
      currency: params.currency ?? 'USD',
    });
  },
  beginCheckout(params: {value: number; currency?: string; items: Array<{item_id: string; item_name: string; price: number; quantity: number}>}) {
    if (typeof window === 'undefined') return;
    window.gtag?.('event', 'begin_checkout', {
      currency: params.currency ?? 'USD',
      value: params.value,
      items: params.items,
    });
    window.fbq?.('track', 'InitiateCheckout', {
      value: params.value,
      currency: params.currency ?? 'USD',
      num_items: params.items.length,
    });
  },
  viewItem(params: {item_id: string; item_name: string; price: number; currency?: string}) {
    if (typeof window === 'undefined') return;
    window.gtag?.('event', 'view_item', {
      currency: params.currency ?? 'USD',
      value: params.price,
      items: [{item_id: params.item_id, item_name: params.item_name, price: params.price}],
    });
    window.fbq?.('track', 'ViewContent', {
      content_ids: [params.item_id],
      content_name: params.item_name,
      value: params.price,
      currency: params.currency ?? 'USD',
    });
  },
};
