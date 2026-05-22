'use client';

import { useState, useEffect, useRef } from 'react';
import { EndingType } from '@/lib/types';
import { recordEnding, recordDailyClear, Achievement } from '@/lib/progress';
import CrossPromo from '@/components/CrossPromo';
import AdUnit from '@/components/AdUnit';

interface Stat {
  label: string;
  value: string;
}

interface Props {
  endingType: EndingType;
  endingName: string;
  text: string;
  scenarioId: string;
  scenarioName: string;
  stats: Stat[];
  dailyDate?: string | null;
  replayLabel?: string;
  onReplay: () => void;
  onHome: () => void;
}

const endingStyle: Record<EndingType, { label: string; color: string }> = {
  good: { label: 'GOOD END', color: 'var(--hp-good)' },
  normal: { label: 'NORMAL END', color: '#5b9bd5' },
  bad: { label: 'BAD END', color: 'var(--hp-low)' },
};

const SITE_URL = 'https://ai-dungeon-coral.vercel.app/';

export default function EndingScreen({
  endingType,
  endingName,
  text,
  scenarioId,
  scenarioName,
  stats,
  dailyDate,
  replayLabel = 'もう一度挑戦する',
  onReplay,
  onHome,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    const result = recordEnding(scenarioId, scenarioName, endingType, endingName);
    setIsNew(result.isNewEnding);
    setNewAchievements(result.newAchievements);
    if (dailyDate) recordDailyClear(dailyDate);
  }, [scenarioId, scenarioName, endingType, endingName, dailyDate]);

  const style = endingStyle[endingType];
  const shareText = [
    'AIダンジョン ⚔',
    `「${scenarioName}」${style.label} ─ ${endingName}`,
    dailyDate ? `📅 ${dailyDate} のデイリーダンジョン` : '',
    '#AIダンジョン #ブラウザゲーム',
    SITE_URL,
  ]
    .filter(Boolean)
    .join('\n');

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const handleXShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      className="rounded-2xl p-6 space-y-5 anim-rise bg-[var(--bg-card)]"
      style={{ border: `2px solid ${style.color}` }}
    >
      <div className="text-center">
        <span
          className="inline-block px-4 py-1 rounded-full text-white text-xs font-bold tracking-widest"
          style={{ background: style.color }}
        >
          {style.label}
        </span>
        <h2
          className="mt-3 font-serif-jp text-2xl font-bold"
          style={{ color: style.color }}
        >
          {endingName}
        </h2>
        {isNew && (
          <p className="mt-1.5 text-xs text-[var(--accent)]">✨ 図鑑に新しい結末を記録しました</p>
        )}
      </div>

      <p className="font-serif-jp text-[var(--text)] text-[15px] leading-[1.95] whitespace-pre-wrap">
        {text}
      </p>

      <div className="bg-[var(--bg-sunken)] rounded-xl p-4 space-y-1.5 text-sm">
        <p className="text-[var(--accent)] font-bold mb-1">📊 冒険の記録</p>
        {stats.map((s) => (
          <p key={s.label} className="text-[var(--text-dim)] flex justify-between">
            <span>{s.label}</span>
            <span className="text-[var(--text)]">{s.value}</span>
          </p>
        ))}
      </div>

      {newAchievements.length > 0 && (
        <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/35 rounded-xl p-4 space-y-2">
          <p className="text-[var(--accent)] font-bold text-sm">🏆 実績を解除！</p>
          {newAchievements.map((a) => (
            <div key={a.id} className="flex items-center gap-2.5">
              <span className="text-xl">{a.icon}</span>
              <div>
                <p className="text-[var(--text)] text-sm font-bold">{a.name}</p>
                <p className="text-[var(--text-dim)] text-xs">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 py-2.5 rounded-xl bg-[var(--bg-elev)] border border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text)] font-bold text-sm transition-colors"
        >
          {copied ? 'コピーしました！' : '結果をコピー'}
        </button>
        <button
          onClick={handleXShare}
          className="flex-1 py-2.5 rounded-xl bg-black border border-[var(--border)] hover:border-[var(--text-dim)] text-white font-bold text-sm transition-colors"
        >
          𝕏 でシェア
        </button>
      </div>

      <div className="space-y-2.5">
        <button
          onClick={onReplay}
          className="w-full font-bold py-3 rounded-xl transition-all active:scale-[0.99]"
          style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
        >
          {replayLabel}
        </button>
        <button
          onClick={onHome}
          className="w-full border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)]/45 font-bold py-3 rounded-xl transition-colors"
        >
          トップへ戻る
        </button>
      </div>

      <AdUnit />
      <CrossPromo />
    </div>
  );
}
