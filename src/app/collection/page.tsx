'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgressData, EndingType } from '@/lib/types';
import {
  getProgress,
  getAllEndingSlots,
  hasEnding,
  ACHIEVEMENTS,
  EndingSlot,
} from '@/lib/progress';
import { getTheme } from '@/lib/theme';

const typeBadge: Record<EndingType, { label: string; color: string }> = {
  good: { label: 'GOOD', color: 'var(--hp-good)' },
  normal: { label: 'NORMAL', color: '#5b9bd5' },
  bad: { label: 'BAD', color: 'var(--hp-low)' },
};

export default function CollectionPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const slots = getAllEndingSlots();
  const byScenario: Record<string, EndingSlot[]> = {};
  for (const s of slots) {
    (byScenario[s.scenarioId] ??= []).push(s);
  }
  const unlockedCount = progress
    ? slots.filter((s) => hasEnding(progress, s.key)).length
    : 0;
  const unlockedAch = new Set(progress?.achievements ?? []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--bg-elev)]/90 backdrop-blur border-b border-[var(--border)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Link href="/" className="text-xl">🗡</Link>
          <Link
            href="/"
            className="font-serif-jp text-[var(--accent)] font-bold text-lg"
          >
            AIダンジョン
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-7 space-y-8">
        <div className="text-center">
          <h1 className="font-serif-jp text-2xl font-bold title-foil">冒険の記録</h1>
          <p className="text-[var(--text-dim)] text-xs mt-1">
            集めた結末と、刻んだ実績
          </p>
        </div>

        {/* サマリー */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '連続プレイ', value: `🔥 ${progress?.streakCount ?? 0}日` },
            { label: '最長連続記録', value: `⚡ ${progress?.streakBest ?? 0}日` },
            { label: '総プレイ回数', value: `🎲 ${progress?.totalRuns ?? 0}回` },
            { label: 'AI最高到達', value: `🕳 B${progress?.bestAIFloor ?? 0}F` },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-center"
            >
              <p className="text-lg font-bold text-[var(--text)]">{s.value}</p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* エンディング図鑑 */}
        <section className="space-y-4">
          <h2 className="font-serif-jp text-lg font-bold text-[var(--text)] flex items-center justify-between">
            <span>📖 エンディング図鑑</span>
            <span className="text-sm text-[var(--accent)]">
              {unlockedCount} / {slots.length}
            </span>
          </h2>
          {Object.entries(byScenario).map(([scenarioId, list]) => {
            const theme = getTheme(scenarioId);
            return (
              <div key={scenarioId} data-world={scenarioId}>
                <p className="text-sm font-bold text-[var(--text-dim)] mb-2">
                  {list[0].scenarioName}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {list.map((slot) => {
                    const unlocked = progress ? hasEnding(progress, slot.key) : false;
                    const badge = typeBadge[slot.endingType];
                    return (
                      <div
                        key={slot.key}
                        className="rounded-xl p-3 border text-center"
                        style={{
                          background: 'var(--bg-card)',
                          borderColor: unlocked
                            ? `${theme.accent}66`
                            : 'var(--border-soft)',
                        }}
                      >
                        <span
                          className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: unlocked ? badge.color : 'var(--border)',
                            color: unlocked ? '#fff' : 'var(--text-faint)',
                          }}
                        >
                          {badge.label}
                        </span>
                        <p
                          className="font-serif-jp text-xs mt-1.5 leading-tight"
                          style={{
                            color: unlocked ? 'var(--text)' : 'var(--text-faint)',
                          }}
                        >
                          {unlocked ? slot.endingName : '？？？'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* 実績 */}
        <section className="space-y-3">
          <h2 className="font-serif-jp text-lg font-bold text-[var(--text)] flex items-center justify-between">
            <span>🏆 実績</span>
            <span className="text-sm text-[var(--accent)]">
              {unlockedAch.size} / {ACHIEVEMENTS.length}
            </span>
          </h2>
          <div className="space-y-2">
            {ACHIEVEMENTS.map((a) => {
              const got = unlockedAch.has(a.id);
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: got ? 'var(--accent)' : 'var(--border-soft)',
                    opacity: got ? 1 : 0.55,
                  }}
                >
                  <span className="text-2xl" style={{ filter: got ? 'none' : 'grayscale(1)' }}>
                    {got ? a.icon : '🔒'}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--text)]">{a.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-block font-bold py-3 px-8 rounded-xl transition-all active:scale-[0.98]"
            style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
          >
            冒険に戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
