interface QuizStepProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
  selectedOption: string | null;
  stepNumber: number;
}

export function QuizStep({
  question,
  options,
  onSelect,
  selectedOption,
  stepNumber,
}: QuizStepProps) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[4px] text-gold font-semibold mt-6">
        Step {stepNumber} of 5
      </p>
      <h2 className="font-display text-2xl mt-3">{question}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-lg mx-auto">
        {options.map((option) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`quiz-option border font-display text-[15px] cursor-pointer transition-all duration-200 text-center ${
                isSelected
                  ? 'border-gold bg-gold-pale text-ink'
                  : 'border-sand hover:border-gold text-ink'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
