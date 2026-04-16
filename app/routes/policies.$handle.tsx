import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {canonicalLink} from '~/lib/seo';

interface LoaderData {
  handle: string;
}

const POLICIES: Record<string, {title: string; sections: {heading: string; body: string}[]}> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'When you visit Maison Masque, we collect information you provide directly — your name, email address, shipping address, and payment details when you place an order. We also collect browsing data automatically, including your IP address, browser type, pages viewed, and referring URL, through cookies and analytics tools.',
      },
      {
        heading: 'How We Use Your Information',
        body: 'We use your information to fulfil orders, process payments, send shipping notifications, and communicate with you about your account. If you subscribe to our newsletter, we will send occasional emails about new products and promotions. You may unsubscribe at any time.',
      },
      {
        heading: 'Data Sharing',
        body: 'We do not sell your personal information. We share data only with service providers essential to operating the store: Shopify (hosting and payments), our shipping carrier, and Google Analytics. Each provider is bound by their own privacy commitments.',
      },
      {
        heading: 'Cookies',
        body: 'We use essential cookies for cart functionality and session management, plus analytics cookies (Google Analytics) to understand how visitors use the site. You can disable non-essential cookies in your browser settings.',
      },
      {
        heading: 'Your Rights',
        body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us. EU and UK residents have additional rights under GDPR, including data portability and the right to restrict processing.',
      },
      {
        heading: 'Contact',
        body: 'For questions about this policy, please contact the maison at hello@maisonmasque.com.',
      },
    ],
  },
  'terms-of-service': {
    title: 'Terms of Service',
    sections: [
      {
        heading: 'Agreement to Terms',
        body: 'By accessing or using maisonmasque.com, you agree to be bound by these terms. If you do not agree, please do not use the site. We reserve the right to update these terms at any time.',
      },
      {
        heading: 'Products & Pricing',
        body: 'All products are subject to availability. Prices are displayed in your selected currency and include applicable taxes where required. We reserve the right to modify prices without notice. Errors in pricing will be corrected and, if an order has been charged incorrectly, we will refund the difference.',
      },
      {
        heading: 'Orders & Payment',
        body: 'By placing an order, you represent that you are at least 18 years old and that the payment information you provide is accurate. We accept payment via Shopify Payments and Stripe. Orders are confirmed via email once payment is processed.',
      },
      {
        heading: 'Intellectual Property',
        body: 'All content on this site — including text, images, logos, and design — is the property of Maison Masque and may not be reproduced, distributed, or used without written permission.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'Maison Masque is not liable for any indirect, incidental, or consequential damages arising from your use of the site or products. Our total liability is limited to the amount you paid for the relevant order.',
      },
      {
        heading: 'Governing Law',
        body: 'These terms are governed by the laws of Hong Kong SAR. Any disputes will be resolved in the courts of Hong Kong.',
      },
    ],
  },
  'refund-policy': {
    title: 'Refund Policy',
    sections: [
      {
        heading: '30-Day Returns',
        body: 'We accept returns within 30 days of delivery for unopened products in their original packaging. To initiate a return, email us at hello@maisonmasque.com with your order number.',
      },
      {
        heading: 'Refund Process',
        body: 'Once we receive and inspect the returned product, we will process your refund to the original payment method within 5-7 business days. Shipping costs are non-refundable unless the return is due to our error.',
      },
      {
        heading: 'Damaged or Incorrect Items',
        body: 'If your order arrives damaged or you received the wrong product, contact us within 48 hours of delivery with photos. We will send a replacement at no additional cost or issue a full refund including shipping.',
      },
      {
        heading: 'Subscription Cancellations',
        body: 'La Cérémonie subscriptions can be cancelled at any time before your next billing date. Already-shipped orders cannot be refunded under the subscription policy, but the standard 30-day return policy applies to the products themselves.',
      },
    ],
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    sections: [
      {
        heading: 'Processing Time',
        body: 'Orders are processed within 1-2 business days. You will receive a confirmation email with tracking information once your order ships.',
      },
      {
        heading: 'Delivery Estimates',
        body: 'Australia: 5-8 business days. United Kingdom: 7-12 business days. European Union: 8-14 business days. South Africa: 10-16 business days. Rest of World: 10-21 business days. Express options are available at checkout.',
      },
      {
        heading: 'Complimentary Shipping',
        body: 'We offer complimentary standard shipping on orders over the following thresholds: Australia A$70, New Zealand NZ$75, Canada CA$62, United Kingdom \u00A336, European Union \u20AC42, UAE AED 165, United States $45. Orders below these thresholds carry a flat-rate shipping fee of $6.99 USD. Malaysia, Thailand, Singapore and Hong Kong orders enjoy complimentary shipping on all orders.',
      },
      {
        heading: 'Customs & Duties',
        body: 'International orders may be subject to customs duties and taxes imposed by the destination country. These charges are the responsibility of the recipient and are not included in the product price or shipping cost.',
      },
      {
        heading: 'Lost or Delayed Shipments',
        body: 'If your order has not arrived within the estimated delivery window, please contact us. We will work with our carrier to locate your package. If it cannot be found, we will reship or refund your order at no cost.',
      },
    ],
  },
};

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  const handle = data?.handle ?? '';
  const policy = POLICIES[handle];
  const title = policy ? `${policy.title} | Maison Masque` : 'Policy | Maison Masque';
  return [
    {title},
    {name: 'description', content: `${policy?.title ?? 'Legal policy'} for Maison Masque.`},
    canonicalLink(location.pathname),
  ];
};

export async function loader({params}: LoaderFunctionArgs): Promise<LoaderData> {
  const handle = params.handle ?? '';
  if (!POLICIES[handle]) {
    throw new Response('Not Found', {status: 404});
  }
  return {handle};
}

export default function PolicyRoute() {
  const {handle} = useLoaderData<LoaderData>();
  const policy = POLICIES[handle];

  if (!policy) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-walnut">{policy.title}</span>
      </nav>

      <h1 className="font-display text-[clamp(28px,3.5vw,42px)] mb-2">
        {policy.title}
      </h1>
      <p className="text-xs text-stone mb-10">
        Last updated: April 2026
      </p>

      <div className="flex flex-col gap-8">
        {policy.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-lg mb-2">{section.heading}</h2>
            <p className="text-sm text-walnut leading-[1.7]">{section.body}</p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="border-t border-sand mt-12 pt-8 text-center">
        <p className="text-sm text-walnut">
          Questions about this policy?
        </p>
        <a
          href="mailto:hello@maisonmasque.com"
          className="text-xs text-gold uppercase tracking-[3px] hover:text-ink transition-colors mt-2 inline-block"
        >
          Contact the maison &rarr;
        </a>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-3xl mb-4">Policy not found</h1>
      <p className="text-walnut text-sm mb-8">This page doesn&apos;t exist.</p>
      <Link to="/" className="text-xs uppercase tracking-[3px] text-gold hover:text-ink transition-colors">
        Return to the Maison
      </Link>
    </div>
  );
}
