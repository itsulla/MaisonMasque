import {useLoaderData, type MetaFunction} from '@remix-run/react';

const POLICY_QUERY = `#graphql
  query PolicyQuery($privacyPolicy: Boolean!, $termsOfService: Boolean!, $refundPolicy: Boolean!, $shippingPolicy: Boolean!) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        title
        body
        handle
      }
      termsOfService @include(if: $termsOfService) {
        title
        body
        handle
      }
      refundPolicy @include(if: $refundPolicy) {
        title
        body
        handle
      }
      shippingPolicy @include(if: $shippingPolicy) {
        title
        body
        handle
      }
    }
  }
` as const;

const POLICY_MAP: Record<string, string> = {
  'privacy-policy': 'privacyPolicy',
  'terms-of-service': 'termsOfService',
  'refund-policy': 'refundPolicy',
  'shipping-policy': 'shippingPolicy',
};

const MOCK_POLICIES: Record<string, {title: string; body: string}> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    body: '<p>At Maison Masque, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our store.</p><p>We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us. This may include your name, email address, postal address, phone number, and payment information.</p><p>For questions about this policy, please contact the maison.</p>',
  },
  'terms-of-service': {
    title: 'Terms of Service',
    body: '<p>Welcome to Maison Masque. By accessing or using our website and services, you agree to be bound by these terms of service. Please read them carefully.</p><p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice.</p><p>For the complete terms, please contact the maison.</p>',
  },
  'refund-policy': {
    title: 'Refund Policy',
    body: '<p>At Maison Masque, we want you to be completely satisfied with your ritual. If for any reason you are not happy with your purchase, we offer a 30-day return policy for unopened products in their original packaging.</p><p>To initiate a return, please contact the maison with your order number and reason for return.</p>',
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    body: '<p>All orders are shipped with care and reverence. We offer complimentary shipping on orders over the following thresholds: Australia $60 AUD, United Kingdom \u00A345, European Union \u20AC50, South Africa R750.</p><p>Estimated delivery times: Australia 5\u20138 days, UK 7\u201312 days, EU 8\u201314 days, South Africa 10\u201316 days, Rest of World 10\u201321 days.</p>',
  },
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: data?.policy?.title
        ? `${data.policy.title} | Maison Masque`
        : 'Policy | Maison Masque',
    },
  ];
};

export async function loader({params, context}: any) {
  const {handle} = params;
  const policyKey = POLICY_MAP[handle];

  if (!policyKey) {
    throw new Response('Policy not found', {status: 404});
  }

  try {
    const variables = {
      privacyPolicy: policyKey === 'privacyPolicy',
      termsOfService: policyKey === 'termsOfService',
      refundPolicy: policyKey === 'refundPolicy',
      shippingPolicy: policyKey === 'shippingPolicy',
    };

    const {shop} = await context.storefront.query(POLICY_QUERY, {
      variables,
    });

    const policy = shop[policyKey];

    if (!policy) {
      const mock = MOCK_POLICIES[handle];
      if (!mock) throw new Response('Policy not found', {status: 404});
      return {policy: mock};
    }

    return {policy};
  } catch (error) {
    if (error instanceof Response) throw error;

    console.error('Failed to fetch policy:', error);
    const mock = MOCK_POLICIES[handle];
    if (!mock) throw new Response('Policy not found', {status: 404});
    return {policy: mock};
  }
}

export default function PolicyRoute() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-[clamp(28px,3.5vw,42px)] text-center mb-12">
        {policy.title}
      </h1>
      <div
        className="prose prose-sm max-w-none text-stone leading-relaxed
          prose-headings:font-display prose-headings:text-ink
          prose-a:text-gold prose-a:no-underline hover:prose-a:underline
          prose-p:mb-4"
        dangerouslySetInnerHTML={{__html: policy.body}}
      />
    </div>
  );
}
