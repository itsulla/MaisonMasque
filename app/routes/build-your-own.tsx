import {type MetaFunction} from '@remix-run/react';
import {BundleBuilder} from '~/components/home/BundleBuilder';
import {canonicalLink} from '~/lib/seo';

export const meta: MetaFunction = ({location}) => {
  return [
    {title: 'Build Your Own Ritual | Maison Masque'},
    {
      name: 'description',
      content:
        'Compose your own ritual from our curated masks, elixirs and Morning Veil. Four or more items unlocks 15% off.',
    },
    canonicalLink(location.pathname),
  ];
};

export default function BuildYourOwnRoute() {
  return (
    <div className="silk-hero-bg">
      <BundleBuilder />
    </div>
  );
}
