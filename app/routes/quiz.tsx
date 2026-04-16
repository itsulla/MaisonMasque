import {type MetaFunction} from '@remix-run/react';
import {SkinQuiz} from '~/components/quiz/SkinQuiz';
import {canonicalLink} from '~/lib/seo';

export const meta: MetaFunction = ({location}) => {
  return [
    {title: 'Find Your Ritual | Maison Masque'},
    {
      name: 'description',
      content:
        'Take the Maison Masque skin ritual quiz to discover which Korean sheet mask is perfect for your skin type and concerns.',
    },
    canonicalLink(location.pathname),
  ];
};

export default function QuizRoute() {
  return <SkinQuiz />;
}
