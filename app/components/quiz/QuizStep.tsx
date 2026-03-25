interface QuizStepProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
  selectedOption: string | null;
}

export function QuizStep({
  question,
  options,
  onSelect,
  selectedOption,
}: QuizStepProps) {
  return (
    <div>
      <h2 className="font-display text-2xl mt-8">{question}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isLastOdd =
            options.length % 2 !== 0 && index === options.length - 1;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`border p-4 text-sm font-body cursor-pointer transition-colors text-left ${
                isSelected
                  ? 'border-gold text-gold bg-gold-pale'
                  : 'border-sand hover:border-gold'
              } ${isLastOdd ? 'sm:col-span-2' : ''}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
