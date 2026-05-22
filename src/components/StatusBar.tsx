import { PlayerStatus } from '@/lib/types';

interface Props {
  status: PlayerStatus;
  floor?: number;
  onItemsClick: () => void;
  onSaveClick?: () => void;
}

export default function StatusBar({ status, floor, onItemsClick, onSaveClick }: Props) {
  const hpPercent = Math.max(0, Math.min(100, (status.hp / status.maxHp) * 100));
  const hpColor =
    hpPercent > 60
      ? 'var(--hp-good)'
      : hpPercent > 30
        ? 'var(--hp-warn)'
        : 'var(--hp-low)';

  return (
    <div className="bg-[var(--bg-elev)]/95 backdrop-blur border-b border-[var(--border)] px-4 py-2">
      <div className="max-w-2xl mx-auto flex items-center gap-2.5">
        {floor !== undefined && (
          <span className="shrink-0 text-xs font-bold text-[var(--accent)] bg-[var(--accent)]/12 border border-[var(--accent)]/35 rounded-lg px-2 py-1">
            B{floor}F
          </span>
        )}

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-bold shrink-0" style={{ color: hpColor }}>
            ♥ {Math.max(0, status.hp)}
          </span>
          <div className="flex-1 bg-[var(--bg-sunken)] rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${hpPercent}%`, background: hpColor }}
            />
          </div>
        </div>

        <button
          onClick={onItemsClick}
          className="shrink-0 text-xs text-[var(--accent)] border border-[var(--accent)]/45 rounded-lg px-2 py-1 hover:bg-[var(--accent)]/15 transition-colors"
        >
          🎒 {status.items.length}
        </button>
        {onSaveClick && (
          <button
            onClick={onSaveClick}
            className="shrink-0 text-xs text-[var(--text-dim)] border border-[var(--border)] rounded-lg px-2 py-1 hover:border-[var(--accent)]/45 hover:text-[var(--accent)] transition-colors"
          >
            💾
          </button>
        )}
      </div>
    </div>
  );
}
