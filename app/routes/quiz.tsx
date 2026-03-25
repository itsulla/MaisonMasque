import {type MetaFunction} from '@remix-run/react';
import {SkinQuiz} from '~/components/quiz/SkinQuiz';

export const meta: MetaFunction = () => {
  return [
    {title: 'Find Your Ritual | Maison Masque'},
    {
      name: 'description',
      content:
        'Take the Maison Masque skin ritual quiz to discover which Korean sheet mask is perfect for your skin type and concerns.',
    },
  ];
};

export default function QuizRoute() {
  return <SkinQuiz />;
}
