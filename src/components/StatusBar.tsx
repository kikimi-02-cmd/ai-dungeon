import { PlayerStatus } from '@/lib/types';

interface Props {
  status: PlayerStatus;
  onItemsClick: () => void;
  onSaveClick: () => void;
}

export default function StatusBar({ status, onItemsClick, onSaveClick }: Props) {
  const hpPercent = (status.hp / status.maxHp) * 100;
  const hpColor = hpPercent > 60 ? 'bg-[#10B981]' : hpPercent > 30 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]';

  return (
    <div className="bg-[#1E1533] border-b border-[#4C1D95] px-4 py-2">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        {/* HP */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[#EF4444] text-sm font-bold shrink-0">❤️ {status.hp}</span>
          <div className="flex-1 bg-[#0F0A1A] rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${hpColor}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
        {/* ボタン */}
        <button
          onClick={onItemsClick}
          className="text-xs text-[#F59E0B] border border-[#F59E0B] rounded-lg px-2 py-1 hover:bg-[#F59E0B] hover:text-black transition-colors"
        >
          💼 {status.items.length}
        </button>
        <button
          onClick={onSaveClick}
          className="text-xs text-[#A78BFA] border border-[#A78BFA] rounded-lg px-2 py-1 hover:bg-[#A78BFA] hover:text-black transition-colors"
        >
          💾 セーブ
        </button>
      </div>
    </div>
  );
}
