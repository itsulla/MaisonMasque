import {type MetaFunction} from '@remix-run/react';
import {SectionLabel} from '~/components/shared/SectionLabel';

export const meta: MetaFunction = () => [
  {title: 'FAQ | Maison Masque'},
  {name: 'description', content: 'Frequently asked questions about Maison Masque — shipping, returns, ingredients, subscriptions, and the ritual.'},
];

const FAQ_SECTIONS = [
  {
    heading: 'Ordering & Shipping',
    items: [
      {
        q: 'Where do you ship from?',
        a: 'All orders ship from Hong Kong. Our products are sourced directly from Korean and Japanese brand partners and authenticated before dispatch.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Australia: 5\u20138 business days. United Kingdom: 7\u201312 days. European Union: 8\u201314 days. South Africa: 10\u201316 days. Rest of world: 10\u201321 days. Express options are available at checkout.',
      },
      {
        q: 'Is shipping really complimentary?',
        a: 'Standard shipping is complimentary on orders over A$70 AUD / \u00A336 GBP / \u20AC42 EUR / R820 ZAR / $45 USD. Orders below these thresholds carry a flat-rate shipping fee of $6.99.',
      },
      {
        q: 'Do you provide tracking?',
        a: 'Yes \u2014 every order receives a tracking number via email once it leaves Hong Kong. You can track your order at any time via the link in your confirmation email.',
      },
    ],
  },
  {
    heading: 'Products & Ingredients',
    items: [
      {
        q: 'Are your products authentic?',
        a: 'Every product in the maison is sourced directly from authorised distributors and verified for authenticity before it reaches you. We never source from grey-market channels.',
      },
      {
        q: 'Are the products cruelty-free or vegan?',
        a: 'Each product\u2019s certification status is listed individually on its product page. We only cite certifications that the brand itself publishes on their official site \u2014 we do not add claims the brand has not made.',
      },
      {
        q: 'What is PDRN?',
        a: 'Polydeoxyribonucleotide (PDRN) is a bioactive compound derived from salmon DNA. It\u2019s widely used in Korean dermatology clinics for skin regeneration, and several of our elixirs use it as a hero ingredient. Each product page details the specific PDRN concentration and form.',
      },
      {
        q: 'How do I choose the right mask for my skin?',
        a: 'Take our Skin Ritual Quiz \u2014 it matches your skin type, concerns, and preferences to the right ritual mask in under a minute.',
      },
    ],
  },
  {
    heading: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 30 days of delivery for unopened, sealed products in their original packaging. Contact hello@maisonmasque.com to initiate a return.',
      },
      {
        q: 'What if I receive a damaged product?',
        a: 'Contact us within 7 days with a photo of the damage. We\u2019ll send a replacement at no cost \u2014 no return required.',
      },
      {
        q: 'Can I exchange a product?',
        a: 'Yes. If a product doesn\u2019t suit your skin, contact the maison within 30 days and we\u2019ll arrange an exchange for a different product of equal value.',
      },
    ],
  },
  {
    heading: 'Subscriptions',
    items: [
      {
        q: 'How do subscriptions work?',
        a: 'La C\u00E9r\u00E9monie is our subscription programme. Choose a tier, and a curated selection of masks is delivered on a recurring schedule at a discount. You can pause, skip, or cancel at any time.',
      },
      {
        q: 'Can I change or pause my subscription?',
        a: 'Yes \u2014 log in to your account or email us. Changes take effect before your next billing date.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="py-24 lg:py-32 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-px h-[60px] bg-sand mx-auto mb-8" aria-hidden="true" />
        <SectionLabel>Care</SectionLabel>
        <h1 className="font-display text-[clamp(32px,5vw,52px)] mt-4">
          Frequently Asked Questions
        </h1>
        <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
      </div>

      <div className="space-y-14">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-[clamp(20px,2.5vw,26px)] mb-6 pb-3 border-b border-sand">
              {section.heading}
            </h2>
            <div className="divide-y divide-sand">
              {section.items.map((item, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex items-baseline justify-between cursor-pointer list-none select-none">
                    <span className="font-display text-[16px] text-ink pr-6">{item.q}</span>
                    <span
                      className="text-gold font-display text-xl flex-shrink-0 transition-transform duration-300 group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-[14px] text-walnut leading-relaxed mt-4 pr-8">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16 border-t border-sand pt-10">
        <p className="text-[14px] text-walnut">
          Can&apos;t find what you&apos;re looking for?
        </p>
        <a
          href="mailto:hello@maisonmasque.com"
          className="inline-block mt-4 text-[11px] uppercase tracking-[3px] font-semibold font-body text-gold hover:text-ink transition-colors"
        >
          Contact the Maison
        </a>
      </div>
    </div>
  );
}
