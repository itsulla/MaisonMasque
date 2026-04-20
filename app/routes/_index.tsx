import {type MetaFunction} from '@remix-run/react';
import {Hero} from '~/components/home/Hero';
import {Divider} from '~/components/shared/Divider';
import {FiveRituals} from '~/components/home/FiveRituals';
import {Philosophy} from '~/components/home/Philosophy';
import {RitualGuide} from '~/components/home/RitualGuide';
import {Subscription} from '~/components/home/Subscription';
import {TrustBar} from '~/components/shared/TrustBar';
// ChooseYourRitual → relocated to QuizResult
// MorningVeilPromo + ElixirsPromo → relocated to products.$handle (PDP)
// Component files remain in app/components/home/ for reuse.

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Maison Masque | Korean Sheet Masks | The House of Masks',
    },
    {
      name: 'description',
      // TODO: update brand list once product catalog is final
      content:
        'Curated Korean sheet masks from Medicube, Anua, and SKIN1004. Shipped worldwide to Australia, UK, Europe and South Africa.',
    },
  ];
};

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Maison Masque',
  url: 'https://maisonmasque.com',
  // TODO: update brand list once product catalog is final
  description:
    'Curated Korean sheet masks from Medicube, Anua, and SKIN1004. Sourced in Hong Kong, shipped worldwide.',
};

export default function Homepage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(ORGANIZATION_JSON_LD)}}
      />
      <Hero />
      <TrustBar />
      <Divider />
      <FiveRituals />
      <Divider />
      <Philosophy />
      <Divider />
      <RitualGuide />
      <Divider />
      <Subscription />
    </>
  );
}

export function ErrorBoundary() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-3xl mb-4">Something went wrong</h1>
      <p className="text-walnut text-sm mb-8">
        We couldn&apos;t load this page. Please try again.
      </p>
      <a
        href="/"
        className="text-xs uppercase tracking-[3px] text-gold hover:text-ink transition-colors"
      >
        Return to the Maison
      </a>
    </div>
  );
}
