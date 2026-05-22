interface Props {
  choices: string[];
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export default function ChoiceButtons({ choices, onSelect, disabled = false }: Props) {
  return (
    <div className="space-y-2.5">
      {choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          disabled={disabled}
          className="w-full text-left bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/70 hover:bg-[var(--accent)]/10 active:scale-[0.99] text-[var(--text)] rounded-xl px-4 py-3 text-sm font-medium transition-all flex items-start gap-2.5 disabled:opacity-40 disabled:pointer-events-none anim-rise"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="text-[var(--accent)] shrink-0 mt-0.5 text-xs">◆</span>
          <span className="leading-snug">{choice}</span>
        </button>
      ))}
    </div>
  );
}
