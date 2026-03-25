import {useState} from 'react';
import {QuizStep} from './QuizStep';
import {QuizResult} from './QuizResult';

const STEPS = [
  {
    question: 'What is your skin type?',
    options: ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'],
  },
  {
    question: 'What is your primary concern?',
    options: [
      'Hydration',
      'Redness & irritation',
      'Dullness',
      'Anti-aging',
      'Pore care',
    ],
  },
  {
    question: 'How often do you mask?',
    options: [
      'Daily',
      '2-3 times a week',
      'Weekly',
      'Occasionally',
      "Never — I'm new",
    ],
  },
  {
    question: 'Which texture do you prefer?',
    options: [
      'Hydrogel',
      'Cotton/cellulose',
      'Gummy/microfibre',
      'Bio-cellulose',
      'No preference',
    ],
  },
  {
    question: 'What matters most to you?',
    options: [
      'Visible results',
      'Soothing comfort',
      'Deep hydration',
      'Gentle formula',
      'Brightening glow',
    ],
  },
];

function getRecommendation(answers: Record<number, string>): string {
  const allAnswers = Object.values(answers);

  if (
    allAnswers.includes('Anti-aging') ||
    allAnswers.includes('Hydrogel')
  ) {
    return 'biodance-collagen';
  }

  if (
    allAnswers.includes('Deep hydration') ||
    allAnswers.includes('Dry')
  ) {
    return 'torriden-dive-in';
  }

  if (
    allAnswers.includes('Redness & irritation') ||
    allAnswers.includes('Sensitive')
  ) {
    return 'abib-heartleaf';
  }

  if (
    allAnswers.includes('Hydration') ||
    allAnswers.includes('No preference')
  ) {
    return 'mediheal-nmf';
  }

  if (
    allAnswers.includes('Brightening glow') ||
    allAnswers.includes('Dullness')
  ) {
    return 'numbuzin-no3';
  }

  return 'torriden-dive-in';
}

export function SkinQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSelect = (option: string) => {
    const updatedAnswers = {...answers, [currentStep]: option};
    setAnswers(updatedAnswers);

    // Auto-advance after a brief delay for visual feedback
    setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(5);
      }
    }, 300);
  };

  const recommendedHandle =
    currentStep === 5 ? getRecommendation(answers) : '';

  return (
    <div className="max-w-2xl mx-auto py-16 px-6 text-center">
      {/* Progress bar */}
      <div className="h-0.5 bg-sand w-full">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{width: `${(currentStep / 5) * 100}%`}}
        />
      </div>

      <h1 className="font-display text-[clamp(28px,3.5vw,42px)] mt-10">
        Find Your Ritual
      </h1>
      <p className="text-sm text-stone mt-2">
        Answer five questions. Discover your perfect mask.
      </p>

      {currentStep < 5 ? (
        <QuizStep
          question={STEPS[currentStep].question}
          options={STEPS[currentStep].options}
          onSelect={handleSelect}
          selectedOption={answers[currentStep] ?? null}
        />
      ) : (
        <QuizResult handle={recommendedHandle} />
      )}
    </div>
  );
}
