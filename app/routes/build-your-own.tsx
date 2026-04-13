import {type MetaFunction} from '@remix-run/react';
import {BundleBuilder} from '~/components/home/BundleBuilder';

export const meta: MetaFunction = () => {
  return [
    {title: 'Build Your Own Ritual | Maison Masque'},
    {
      name: 'description',
      content:
        'Compose your own ritual from our curated masks, elixirs and Morning Veil. Four or more items unlocks 15% off.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://maisonmasque.com/build-your-own',
    },
  ];
};

export default function BuildYourOwnRoute() {
  return (
    <div className="silk-hero-bg">
      <BundleBuilder />
    </div>
  );
}
