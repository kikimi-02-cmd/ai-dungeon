'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllScenarios, getScenario } from '@/lib/game';
import { getAutosave, getAISave } from '@/lib/storage';
import { recordRunStart, getProgress, getAllEndingSlots } from '@/lib/progress';
import { getDailyDate, getDailyWorld, getDailyModifier, DailyModifier } from '@/lib/daily';
import { getWorldBible, WorldBible } from '@/lib/worldBibles';
import { Scenario, SaveData, AIGameSave, ProgressData } from '@/lib/types';
import { getTheme } from '@/lib/theme';
import { trackEvent } from '@/lib/gtag';
import Header from '@/components/Header';
import NameInputModal from '@/components/NameInputModal';

type PendingMode = { mode: 'static' | 'ai' | 'daily'; scenario?: Scenario };

const NAME_KEY = 'ai-dungeon-lastname';

export default function HomePage() {
  const router = useRouter();
  const scenarios = getAllScenarios();

  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [autosave, setAutosave] = useState<SaveData | null>(null);
  const [aiSave, setAiSave] = useState<AIGameSave | null>(null);
  const [picker, setPicker] = useState<Scenario | null>(null);
  const [pending, setPending] = useState<PendingMode | null>(null);
  const [lastName, setLastName] = useState('勇者');
  const [daily, setDaily] = useState<{
    date: string;
    world: WorldBible | undefined;
    mod: DailyModifier;
  } | null>(null);

  useEffect(() => {
    setProgress(getProgress());
    setAutosave(getAutosave());
    setAiSave(getAISave());
    setLastName(localStorage.getItem(NAME_KEY) || '勇者');
    const date = getDailyDate();
    setDaily({ date, world: getWorldBible(getDailyWorld(date)), mod: getDailyModifier(date) });
  }, []);

  const clearedCounts: Record<string, number> = {};
  for (const e of progress?.endings ?? []) {
    if (e.scenarioId !== 'ai') clearedCounts[e.scenarioId] = (clearedCounts[e.scenarioId] ?? 0) + 1;
  }
  const totalEndings = getAllEndingSlots().length;
  const unlockedEndings = (progress?.endings ?? []).filter((e) => e.scenarioId !== 'ai').length;

  const dailyDone = daily && progress ? progress.dailyClears.includes(daily.date) : false;

  const startGame = (name: string) => {
    if (!pending) return;
    localStorage.setItem(NAME_KEY, name);
    recordRunStart();
    trackEvent('game_start', {
      mode: pending.mode,
      scenario_id: pending.scenario?.id ?? (pending.mode === 'daily' ? daily?.date : undefined),
    });
    const p = encodeURIComponent(name);
    if (pending.mode === 'static' && pending.scenario) {
      router.push(`/play?scenarioId=${pending.scenario.id}&playerName=${p}`);
    } else if (pending.mode === 'ai' && pending.scenario) {
      router.push(`/play?mode=ai&world=${pending.scenario.id}&playerName=${p}`);
    } else if (pending.mode === 'daily') {
      router.push(`/play?mode=ai&daily=1&playerName=${p}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-7">
        {/* ヒーロー */}
        <div className="text-center mb-7">
          <div className="text-5xl mb-2 anim-glow inline-block">🗡</div>
          <h1 className="font-serif-jp text-4xl font-bold title-foil mb-1.5">AIダンジョン</h1>
          <p className="text-[var(--text-dim)] text-sm font-serif-jp">
            AIが紡ぐ、終わらないテキストRPG
          </p>
        </div>

        {/* ストリーク & 図鑑 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">
              🔥 {progress?.streakCount ?? 0}
            </p>
            <p className="text-[10px] text-[var(--text-dim)] mt-0.5">連続プレイ日数</p>
          </div>
          <Link
            href="/collection"
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-center hover:border-[var(--accent)]/55 transition-colors"
          >
            <p className="text-2xl font-bold text-[var(--accent)]">
              📖 {unlockedEndings}
              <span className="text-sm text-[var(--text-dim)]">/{totalEndings}</span>
            </p>
            <p className="text-[10px] text-[var(--text-dim)] mt-0.5">エンディング図鑑</p>
          </Link>
        </div>

        {/* つづきから */}
        {(autosave || aiSave) && (
          <div className="mb-6 space-y-2.5">
            {autosave && (
              <button
                onClick={() => router.push('/play?resume=1')}
                className="w-full bg-[var(--bg-card)] border border-[var(--accent)]/45 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-[var(--accent)]/10 transition-colors text-left"
              >
                <span className="text-xl">⏳</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--accent)]">物語のつづきから</p>
                  <p className="text-xs text-[var(--text-dim)] truncate">
                    {getScenario(autosave.scenarioId)?.name} ／ {autosave.playerStatus.name}
                  </p>
                </div>
                <span className="text-[var(--text-faint)]">›</span>
              </button>
            )}
            {aiSave && (
              <button
                onClick={() => router.push('/play?mode=ai&resume=1')}
                className="w-full bg-[var(--bg-card)] border border-[var(--accent)]/45 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-[var(--accent)]/10 transition-colors text-left"
              >
                <span className="text-xl">🌀</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--accent)]">AIダンジョンのつづきから</p>
                  <p className="text-xs text-[var(--text-dim)] truncate">
                    {getWorldBible(aiSave.worldId)?.name} ／ B{aiSave.floor}F ／ {aiSave.playerName}
                  </p>
                </div>
                <span className="text-[var(--text-faint)]">›</span>
              </button>
            )}
          </div>
        )}

        {/* 今日のダンジョン */}
        {daily?.world && (
          <button
            onClick={() => setPending({ mode: 'daily' })}
            data-world={daily.world.id}
            className="w-full text-left mb-6 rounded-2xl p-4 border transition-all active:scale-[0.99]"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, var(--bg-card)), var(--bg-card) 65%)',
              borderColor: 'color-mix(in srgb, var(--accent) 55%, transparent)',
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[var(--accent)] tracking-wide">
                📅 今日のダンジョン
              </span>
              <span className="text-[10px] text-[var(--text-dim)]">{daily.date}</span>
            </div>
            <p className="font-serif-jp text-lg font-bold text-[var(--text)]">
              {daily.world.emoji} {daily.world.name}
            </p>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              <span className="text-[var(--accent)]">【{daily.mod.name}】</span> {daily.mod.desc}
            </p>
            <p
              className="text-xs mt-2 font-bold"
              style={{ color: dailyDone ? 'var(--hp-good)' : 'var(--accent)' }}
            >
              {dailyDone ? '✓ 本日クリア済み（もう一度挑戦できます）' : '▶ 挑戦する'}
            </p>
          </button>
        )}

        {/* 世界を選ぶ */}
        <h2 className="font-serif-jp text-sm font-bold text-[var(--text-dim)] mb-3 flex items-center gap-2">
          <span className="h-px flex-1 bg-[var(--border)]" />
          世界を選ぶ
          <span className="h-px flex-1 bg-[var(--border)]" />
        </h2>
        <div className="space-y-3">
          {scenarios.map((s) => {
            const theme = getTheme(s.id);
            const cleared = clearedCounts[s.id] ?? 0;
            return (
              <button
                key={s.id}
                onClick={() => setPicker(s)}
                data-world={s.id}
                className="w-full text-left bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--accent)]/60 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${theme.accent}1f`, border: `1px solid ${theme.accent}55` }}
                  >
                    {s.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-serif-jp font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {s.name}
                      </p>
                      {cleared > 0 && (
                        <span className="text-[10px] text-[var(--accent)] border border-[var(--accent)]/40 rounded px-1.5 py-0.5 shrink-0">
                          {cleared}/3
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-dim)] mt-1 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <span className="text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-colors shrink-0">
                    ›
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/how-to-play"
            className="inline-block text-xs text-[var(--text-dim)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] px-4 py-2 rounded-lg transition-colors"
          >
            遊び方を見る
          </Link>
        </div>
      </main>

      {/* モード選択モーダル */}
      {picker && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 anim-fade"
          data-world={picker.id}
          onClick={() => setPicker(null)}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif-jp text-lg font-bold text-center text-[var(--text)]">
              {picker.emoji} {picker.name}
            </h2>
            <p className="text-xs text-[var(--text-dim)] text-center mt-1 mb-5">
              遊び方を選んでください
            </p>
            <button
              onClick={() => {
                const s = picker;
                setPicker(null);
                setPending({ mode: 'static', scenario: s });
              }}
              className="w-full text-left bg-[var(--bg-sunken)] border border-[var(--border)] hover:border-[var(--accent)]/60 rounded-xl p-3.5 mb-2.5 transition-colors"
            >
              <p className="text-sm font-bold text-[var(--text)]">📖 物語モード</p>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                作り込まれた分岐ストーリー。マルチエンディングを集めよう
              </p>
            </button>
            <button
              onClick={() => {
                const s = picker;
                setPicker(null);
                setPending({ mode: 'ai', scenario: s });
              }}
              className="w-full text-left bg-[var(--bg-sunken)] border border-[var(--border)] hover:border-[var(--accent)]/60 rounded-xl p-3.5 transition-colors"
            >
              <p className="text-sm font-bold text-[var(--text)]">🤖 AI無限ダンジョン</p>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                AIが毎回違う物語を生成。どこまで深く潜れるか挑戦
              </p>
            </button>
            <button
              onClick={() => setPicker(null)}
              className="w-full mt-4 text-xs text-[var(--text-faint)] hover:text-[var(--text-dim)] transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* 名前入力モーダル */}
      {pending && (
        <NameInputModal
          title={
            pending.mode === 'daily'
              ? '今日のダンジョンへ'
              : pending.mode === 'ai'
                ? 'AI無限ダンジョンへ'
                : `${pending.scenario?.name} へ`
          }
          subtitle="冒険者の名前を入力してください"
          defaultName={lastName}
          onConfirm={startGame}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
}
