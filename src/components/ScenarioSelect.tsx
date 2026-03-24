import { Scenario } from '@/lib/types';

interface Props {
  scenarios: Scenario[];
  onSelect: (scenario: Scenario) => void;
}

export default function ScenarioSelect({ scenarios, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {scenarios.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          className="w-full text-left bg-[#1E1533] border border-[#4C1D95] rounded-xl p-4 hover:border-[#A78BFA] hover:bg-[#2D1B4E] transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{s.emoji}</span>
            <div>
              <p className="font-bold text-[#E5E7EB] group-hover:text-[#A78BFA] transition-colors">
                {s.name}
              </p>
              <p className="text-sm text-[#9CA3AF] mt-0.5">{s.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
