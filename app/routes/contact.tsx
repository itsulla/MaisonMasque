import {type MetaFunction} from '@remix-run/react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {canonicalLink} from '~/lib/seo';

export const meta: MetaFunction = ({location}) => [
  {title: 'Contact the Maison | Maison Masque'},
  {name: 'description', content: 'Get in touch with Maison Masque — The House of Masks. We respond to every message personally.'},
  canonicalLink(location.pathname),
];

export default function ContactPage() {
  return (
    <div className="py-24 lg:py-32 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-px h-[60px] bg-sand mx-auto mb-8" aria-hidden="true" />
        <SectionLabel>Care</SectionLabel>
        <h1 className="font-display text-[clamp(32px,5vw,52px)] mt-4">
          Contact the Maison
        </h1>
        <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
        <p className="text-[15px] text-walnut mt-8 leading-[1.8] max-w-xl mx-auto">
          Every message is read and responded to personally. We are a small house,
          and we take that seriously.
        </p>
      </div>

      <div className="border border-sand divide-y divide-sand">
        {/* Email */}
        <div className="p-8 text-center">
          <p className="text-[11px] uppercase tracking-[4px] text-stone font-semibold font-body mb-2">
            Email
          </p>
          <a
            href="mailto:hello@maisonmasque.com"
            className="font-display text-[clamp(18px,2.5vw,24px)] text-ink hover:text-gold transition-colors"
          >
            hello@maisonmasque.com
          </a>
          <p className="text-[13px] text-walnut mt-2">
            We respond within 24 hours, typically sooner.
          </p>
        </div>

        {/* Response window */}
        <div className="p-8 text-center">
          <p className="text-[11px] uppercase tracking-[4px] text-stone font-semibold font-body mb-2">
            Response window
          </p>
          <p className="font-display text-[18px] text-ink">
            Monday &ndash; Friday, 9am &ndash; 6pm HKT
          </p>
          <p className="text-[13px] text-walnut mt-2">
            Weekend messages are answered by Monday morning.
          </p>
        </div>

        {/* Common topics */}
        <div className="p-8">
          <p className="text-[11px] uppercase tracking-[4px] text-stone font-semibold font-body mb-4 text-center">
            We can help with
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {[
              'Order tracking & shipping updates',
              'Product recommendations for your skin',
              'Returns & exchanges within 30 days',
              'Wholesale & press enquiries',
              'Subscription changes or pauses',
              'General questions about the ritual',
            ].map((topic) => (
              <p key={topic} className="text-[13px] text-walnut flex items-start gap-2">
                <span className="text-gold mt-0.5 flex-shrink-0">&middot;</span>
                {topic}
              </p>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[12px] text-stone mt-8">
        Curated in Hong Kong &middot; Shipped with reverence
      </p>
    </div>
  );
}
