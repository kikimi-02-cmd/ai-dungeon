import { StoryNode, PlayerStatus } from '@/lib/types';
import CrossPromo from '@/components/CrossPromo';

interface Props {
  node: StoryNode;
  status: PlayerStatus;
  nodeCount: number;
  onReplay: () => void;
  onChangeScenario: () => void;
}

const endingColors = {
  good: { bg: 'border-[#10B981]', badge: 'bg-[#10B981]', title: 'text-[#10B981]' },
  normal: { bg: 'border-[#3B82F6]', badge: 'bg-[#3B82F6]', title: 'text-[#3B82F6]' },
  bad: { bg: 'border-[#EF4444]', badge: 'bg-[#EF4444]', title: 'text-[#EF4444]' },
};

const endingLabels = { good: 'GOOD END', normal: 'NORMAL END', bad: 'BAD END' };

export default function EndingScreen({ node, status, nodeCount, onReplay, onChangeScenario }: Props) {
  const type = node.endingType ?? 'normal';
  const colors = endingColors[type];

  return (
    <div className={`bg-[#1E1533] border-2 ${colors.bg} rounded-2xl p-6 space-y-5`}>
      {/* エンディングタイプ */}
      <div className="text-center">
        <span className={`inline-block px-4 py-1 rounded-full text-white text-sm font-bold ${colors.badge}`}>
          {endingLabels[type]}
        </span>
        <h2 className={`mt-3 text-2xl font-bold ${colors.title}`}>{node.endingName}</h2>
      </div>

      {/* ストーリーテキスト */}
      <p className="text-[#E5E7EB] text-sm leading-relaxed whitespace-pre-wrap">{node.text}</p>

      {/* プレイ統計 */}
      <div className="bg-[#0F0A1A] rounded-xl p-4 space-y-1 text-sm">
        <p className="text-[#A78BFA] font-bold mb-2">📊 プレイ統計</p>
        <p className="text-[#9CA3AF]">冒険者名: <span className="text-[#E5E7EB]">{status.name}</span></p>
        <p className="text-[#9CA3AF]">残りHP: <span className="text-[#EF4444]">{status.hp}</span></p>
        <p className="text-[#9CA3AF]">選択数: <span className="text-[#E5E7EB]">{nodeCount}</span></p>
        <p className="text-[#9CA3AF]">所持アイテム: <span className="text-[#F59E0B]">{status.items.join('、') || 'なし'}</span></p>
      </div>

      {/* ボタン */}
      <div className="space-y-3">
        <button
          onClick={onReplay}
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl transition-colors"
        >
          もう一度プレイ
        </button>
        <button
          onClick={onChangeScenario}
          className="w-full border border-[#4C1D95] text-[#A78BFA] hover:bg-[#4C1D95] font-bold py-3 rounded-xl transition-colors"
        >
          別のシナリオへ
        </button>
      </div>

      {/* 広告枠 */}
      <div className="text-center text-xs text-[#4C1D95] border border-dashed border-[#4C1D95] rounded p-2">
        広告
      </div>

      <CrossPromo />
    </div>
  );
}
