interface Props {
  items: string[];
  onClose: () => void;
}

export default function ItemModal({ items, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4 anim-fade"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif-jp text-[var(--accent)] font-bold text-lg">🎒 所持アイテム</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-faint)] hover:text-[var(--text)] text-xl leading-none"
          >
            ✕
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-[var(--text-faint)] text-sm text-center py-6">
            まだ何も持っていない
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 text-[var(--text)] text-sm bg-[var(--bg-sunken)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5"
              >
                <span className="text-[var(--accent)]">◆</span>
                {item}
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-[var(--text-faint)] mt-4 text-center">
          {items.length} / 5 スロット使用中
        </p>
      </div>
    </div>
  );
}
