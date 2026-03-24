import { Choice } from '@/lib/types';

interface Props {
  choices: Choice[];
  onChoice: (choice: Choice) => void;
  visible: boolean;
}

export default function ChoiceButtons({ choices, onChoice, visible }: Props) {
  if (!visible) return null;

  return (
    <div className={`space-y-3 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => onChoice(choice)}
          className="w-full text-left bg-[#7C3AED] hover:bg-[#6D28D9] text-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-medium transition-colors flex items-start gap-2"
        >
          <span className="text-[#A78BFA] shrink-0 mt-0.5">▶</span>
          <span>{choice.text}</span>
        </button>
      ))}
    </div>
  );
}
