'use client';

import { useState } from 'react';
import { StoryNode, PlayerStatus } from '@/lib/types';
import CrossPromo from '@/components/CrossPromo';

interface Props {
  node: StoryNode;
  status: PlayerStatus;
  nodeCount: number;
  scenarioName: string;
  onReplay: () => void;
  onChangeScenario: () => void;
}

const endingColors = {
  good: { bg: 'border-[#10B981]', badge: 'bg-[#10B981]', title: 'text-[#10B981]' },
  normal: { bg: 'border-[#3B82F6]', badge: 'bg-[#3B82F6]', title: 'text-[#3B82F6]' },
  bad: { bg: 'border-[#EF4444]', badge: 'bg-[#EF4444]', title: 'text-[#EF4444]' },
};

const endingLabels = { good: 'GOOD END', normal: 'NORMAL END', bad: 'BAD END' };
const endingShortLabels = { good: 'Good', normal: 'Normal', bad: 'Bad' };

export default function EndingScreen({ node, status, nodeCount, scenarioName, onReplay, onChangeScenario }: Props) {
  const [copied, setCopied] = useState(false);
  const type = node.endingType ?? 'normal';
  const colors = endingColors[type];

  const shareText = [
    'AIダンジョン 🗡',
    '',
    `「${scenarioName}」${endingShortLabels[type]} End`,
    '',
    `エンディング: ${node.endingName ?? '？'}`,
    '',
    `HP: ${status.hp} / アイテム: ${status.items.length}個`,
    '',
    'https://ai-dungeon-coral.vercel.app/',
  ].join('\n');

  function handleShare() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {/* ignore */});
  }

  function handleXShare() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

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

      {/* シェアボタン */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors"
        >
          {copied ? 'コピーしました！' : '結果をシェア'}
        </button>
        <button
          onClick={handleXShare}
          className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-600 text-white font-bold text-sm transition-colors"
        >
          𝕏 でシェア
        </button>
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

      {/* 広告 */}
      <div className="overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9336081041068058"
          data-ad-slot="auto"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      <CrossPromo />
    </div>
  );
}
