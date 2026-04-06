import {useState, useCallback} from 'react';
import {QuizStep} from './QuizStep';
import {QuizResult} from './QuizResult';

const STEPS = [
  {
    question: 'What is your primary skin type?',
    options: ['Dry', 'Oily', 'Combination', 'Sensitive'],
  },
  {
    question: 'What concerns you most?',
    options: [
      'Dehydration',
      'Redness & irritation',
      'Pores & texture',
      'Dullness & uneven tone',
      'Fine lines',
    ],
  },
  {
    question: 'How often do you mask?',
    options: ['Never tried', 'Once a week', '2\u20133 times a week', 'Daily'],
  },
  {
    question: 'What texture do you prefer?',
    options: [
      'Sheet mask',
      'Hydrogel (jelly)',
      'Wrapping (peel-off)',
      'Sleeping cream',
    ],
  },
  {
    question: 'What matters most in your ritual?',
    options: [
      'Deep hydration',
      'Calming & soothing',
      'Brightening & glow',
      'Firming & elasticity',
    ],
  },
];

function getRecommendation(answers: Record<number, string>): string {
  const skinType = answers[0] ?? '';
  const concern = answers[1] ?? '';
  const goal = answers[4] ?? '';

  // Fine lines + Firming → Ritual II (Medicube Wrapping Mask)
  if (concern === 'Fine lines' || goal === 'Firming & elasticity') {
    return 'medicube-wrapping-mask';
  }

  // Sensitive + Redness + Calming → Ritual III (Anua Heartleaf)
  if (
    skinType === 'Sensitive' ||
    concern === 'Redness & irritation' ||
    goal === 'Calming & soothing'
  ) {
    return 'anua-heartleaf-mask';
  }

  // Oily + Pores + Sheet mask → Ritual IV (Medicube Vita Coating)
  if (skinType === 'Oily' || concern === 'Pores & texture') {
    return 'medicube-vita-coating-mask';
  }

  // Combination + Dullness + Brightening → Ritual V (Laneige Cica)
  if (
    skinType === 'Combination' ||
    concern === 'Dullness & uneven tone' ||
    goal === 'Brightening & glow'
  ) {
    return 'laneige-cica-sleeping-mask';
  }

  // Dry + Dehydration + Deep hydration → Ritual I (Medicube PDRN Gel Mask)
  return 'medicube-pdrn-gel-mask';
}

export function SkinQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [transitioning, setTransitioning] = useState(false);

  const totalSteps = STEPS.length;
  const isResult = currentStep >= totalSteps;

  const handleSelect = useCallback(
    (option: string) => {
      if (transitioning) return;
      const updatedAnswers = {...answers, [currentStep]: option};
      setAnswers(updatedAnswers);

      // Auto-advance after 0.5s
      setTransitioning(true);
      setTimeout(() => {
        setDirection('forward');
        if (currentStep < totalSteps - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setCurrentStep(totalSteps);
        }
        setTransitioning(false);
      }, 500);
    },
    [answers, currentStep, totalSteps, transitioning],
  );

  const handleBack = useCallback(() => {
    if (transitioning || currentStep <= 0) return;
    setDirection('back');
    setCurrentStep(currentStep - 1);
  }, [currentStep, transitioning]);

  const handleRestart = useCallback(() => {
    setDirection('back');
    setCurrentStep(0);
    setAnswers({});
  }, []);

  const recommendedHandle = isResult ? getRecommendation(answers) : '';
  const progressPct = isResult ? 100 : (currentStep / totalSteps) * 100;

  return (
    <div className="quiz-container max-w-2xl mx-auto py-16 px-6 text-center min-h-[70vh] flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 bg-sand w-full">
        <div
          className="h-full bg-gold transition-all duration-500 ease-out"
          style={{width: `${progressPct}%`}}
        />
      </div>

      {/* Back button */}
      {currentStep > 0 && !isResult && (
        <button
          type="button"
          onClick={handleBack}
          className="self-start mt-6 flex items-center gap-2 text-xs uppercase tracking-[3px] text-stone hover:text-ink transition-colors"
          aria-label="Go back to previous question"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}

      <h1 className="font-display text-[clamp(28px,3.5vw,42px)] mt-8">
        Find Your Ritual
      </h1>
      <p className="text-sm text-walnut mt-2 mb-2">
        Answer five questions. Discover your perfect mask.
      </p>

      {/* Steps / Result */}
      <div className="flex-1 flex flex-col justify-center">
        {!isResult ? (
          <div
            key={currentStep}
            className={`quiz-step-animate ${direction === 'forward' ? 'quiz-enter-right' : 'quiz-enter-left'}`}
          >
            <QuizStep
              question={STEPS[currentStep].question}
              options={STEPS[currentStep].options}
              onSelect={handleSelect}
              selectedOption={answers[currentStep] ?? null}
              stepNumber={currentStep + 1}
            />
          </div>
        ) : (
          <div className="quiz-step-animate quiz-enter-right">
            <QuizResult handle={recommendedHandle} onRestart={handleRestart} />
          </div>
        )}
      </div>
    </div>
  );
}
