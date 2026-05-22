'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AINodeResponse, AITurn, PlayerStatus, LogEntry, EndingType } from '@/lib/types';
import { generateNode } from '@/lib/api';
import { getWorldBible } from '@/lib/worldBibles';
import { getDailyDate, getDailyWorld, getDailyModifier } from '@/lib/daily';
import { getAISave, setAISave, clearAISave } from '@/lib/storage';
import { recordRunStart, recordAIFloor } from '@/lib/progress';
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';
import StoryDisplay from '@/components/StoryDisplay';
import ChoiceButtons from '@/components/ChoiceButtons';
import ItemModal from '@/components/ItemModal';
import EndingScreen from '@/components/EndingScreen';
import ChatLog from '@/components/play/ChatLog';

interface Cfg {
  worldId: string;
  playerName: string;
  daily: string | null;
  modifierHint: string;
  modifierName: string;
}

interface TurnArgs {
  fromNode: AINodeResponse | null;
  choiceText: string | null;
  baseStatus: PlayerStatus;
  baseFloor: number;
  baseHistory: AITurn[];
}

export default function AIPlay() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<PlayerStatus | null>(null);
  const [floor, setFloor] = useState(0);
  const [history, setHistory] = useState<AITurn[]>([]);
  const [current, setCurrent] = useState<AINodeResponse | null>(null);
  const [chatLog, setChatLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textDone, setTextDone] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const cfgRef = useRef<Cfg | null>(null);
  const retryRef = useRef<TurnArgs | null>(null);
  const initRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [current, textDone, loading]);

  async function runTurn(args: TurnArgs) {
    const cfg = cfgRef.current;
    if (!cfg) return;
    setLoading(true);
    setError(null);
    setTextDone(false);

    const newFloor = args.baseFloor + 1;
    const newHistory =
      args.fromNode && args.choiceText !== null
        ? [...args.baseHistory, { scene: args.fromNode.text, action: args.choiceText }]
        : args.baseHistory;

    try {
      const node = await generateNode({
        worldId: cfg.worldId,
        status: args.baseStatus,
        floor: newFloor,
        history: newHistory,
        modifierHint: cfg.modifierHint,
      });

      // 効果を適用
      const s: PlayerStatus = {
        ...args.baseStatus,
        items: [...args.baseStatus.items],
      };
      s.hp = Math.max(0, Math.min(s.maxHp, s.hp + (node.hpChange || 0)));
      if (node.itemGained && !s.items.includes(node.itemGained) && s.items.length < 8) {
        s.items.push(node.itemGained);
      }
      if (node.itemLost) {
        s.items = s.items.filter((i) => i !== node.itemLost);
      }

      // HPが尽きたのに結末でない場合はバッドエンドを強制
      let finalNode = node;
      if (s.hp <= 0 && !node.isEnding) {
        finalNode = {
          ...node,
          isEnding: true,
          endingType: 'bad' as EndingType,
          endingName: node.endingName || '力尽きた冒険者',
          choices: [],
        };
      }
      if (finalNode.isEnding && !finalNode.endingType) {
        finalNode = { ...finalNode, endingType: 'normal' as EndingType };
      }

      if (args.fromNode && args.choiceText !== null) {
        setChatLog((prev) => [
          ...prev,
          { type: 'ai', text: args.fromNode!.text },
          { type: 'choice', text: args.choiceText! },
        ]);
      }
      setStatus(s);
      setFloor(newFloor);
      setHistory(newHistory);
      setCurrent(finalNode);
      retryRef.current = null;
      recordAIFloor(newFloor);

      if (finalNode.isEnding) {
        clearAISave();
      } else {
        setAISave({
          worldId: cfg.worldId,
          playerName: cfg.playerName,
          status: s,
          floor: newFloor,
          history: newHistory,
          current: finalNode,
          daily: cfg.daily,
        });
      }
    } catch (e) {
      retryRef.current = args;
      setError(e instanceof Error ? e.message : 'AIとの通信に失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  // 初期化
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const resume = searchParams.get('resume');
    const daily = searchParams.get('daily');

    if (resume) {
      const save = getAISave();
      if (!save) {
        router.push('/');
        return;
      }
      const mod = save.daily ? getDailyModifier(save.daily) : null;
      cfgRef.current = {
        worldId: save.worldId,
        playerName: save.playerName,
        daily: save.daily,
        modifierHint: mod?.promptHint ?? '',
        modifierName: mod?.name ?? '',
      };
      setStatus(save.status);
      setFloor(save.floor);
      setHistory(save.history);
      setCurrent(save.current);
      setTextDone(false);
      setReady(true);
      return;
    }

    if (daily) {
      const date = getDailyDate();
      const worldId = getDailyWorld(date);
      const mod = getDailyModifier(date);
      const playerName = searchParams.get('playerName') || '冒険者';
      cfgRef.current = {
        worldId,
        playerName,
        daily: date,
        modifierHint: mod.promptHint,
        modifierName: mod.name,
      };
      const initStatus: PlayerStatus = {
        name: playerName,
        hp: mod.startHp,
        maxHp: mod.maxHp,
        items: [],
        flags: [],
      };
      setStatus(initStatus);
      setReady(true);
      runTurn({ fromNode: null, choiceText: null, baseStatus: initStatus, baseFloor: 0, baseHistory: [] });
      return;
    }

    const worldId = searchParams.get('world');
    const playerName = searchParams.get('playerName');
    if (!worldId || !getWorldBible(worldId) || !playerName) {
      router.push('/');
      return;
    }
    cfgRef.current = { worldId, playerName, daily: null, modifierHint: '', modifierName: '' };
    const initStatus: PlayerStatus = {
      name: playerName,
      hp: 100,
      maxHp: 100,
      items: [],
      flags: [],
    };
    setStatus(initStatus);
    setReady(true);
    runTurn({ fromNode: null, choiceText: null, baseStatus: initStatus, baseFloor: 0, baseHistory: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cfg = cfgRef.current;
  const world = cfg ? getWorldBible(cfg.worldId) : undefined;

  if (!ready || !status || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--accent)] font-serif-jp animate-pulse">読み込み中…</p>
      </div>
    );
  }

  const isEnding = current?.isEnding === true;

  const handleChoice = (i: number) => {
    if (loading || !current) return;
    runTurn({
      fromNode: current,
      choiceText: current.choices[i],
      baseStatus: status,
      baseFloor: floor,
      baseHistory: history,
    });
  };

  return (
    <div data-world={world.id} className="h-dvh flex flex-col">
      <Header scenarioName={`${world.emoji} ${world.name}`} />
      <StatusBar status={status} floor={floor} onItemsClick={() => setShowItems(true)} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full px-4 pt-4 pb-4 space-y-4">
          {/* デイリー表示 */}
          {cfg?.daily && (
            <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl px-3 py-2 text-center">
              <p className="text-xs text-[var(--accent)]">
                📅 今日のダンジョン｜{cfg.modifierName ? `【${cfg.modifierName}】` : ''}
              </p>
            </div>
          )}

          <ChatLog log={chatLog} />

          {/* 現在の場面 */}
          {current && isEnding && (
            <EndingScreen
              endingType={current.endingType ?? 'normal'}
              endingName={current.endingName ?? '旅の終わり'}
              text={current.text}
              scenarioId="ai"
              scenarioName={cfg?.daily ? `${world.name}（今日のダンジョン）` : world.name}
              dailyDate={cfg?.daily ?? null}
              stats={[
                { label: '冒険者', value: status.name },
                { label: '到達した深さ', value: `B${floor}F` },
                { label: '残りHP', value: String(Math.max(0, status.hp)) },
                { label: '所持アイテム', value: status.items.join('、') || 'なし' },
              ]}
              replayLabel="新たな冒険へ"
              onReplay={() => {
                recordRunStart();
                const p = encodeURIComponent(status.name);
                if (cfg?.daily) {
                  router.push(`/play?mode=ai&daily=1&playerName=${p}`);
                } else {
                  router.push(`/play?mode=ai&world=${world.id}&playerName=${p}`);
                }
              }}
              onHome={() => router.push('/')}
            />
          )}

          {current && !isEnding && (
            <StoryDisplay
              key={`${floor}-${current.text.slice(0, 8)}`}
              text={current.text}
              onComplete={() => setTextDone(true)}
            />
          )}

          {/* 生成中 */}
          {loading && (
            <div className="flex items-center gap-3 text-[var(--accent)] py-3 px-1 anim-fade">
              <span className="inline-block w-4 h-4 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
              <span className="font-serif-jp text-sm">AIが物語を紡いでいます…</span>
            </div>
          )}

          {/* エラー */}
          {error && !loading && (
            <div className="bg-[var(--bg-card)] border border-[var(--hp-low)]/50 rounded-xl p-4 anim-fade">
              <p className="text-sm text-[var(--text)] mb-3">⚠ {error}</p>
              <div className="flex gap-2">
                {retryRef.current && (
                  <button
                    onClick={() => retryRef.current && runTurn(retryRef.current)}
                    className="flex-1 py-2 rounded-lg text-sm font-bold"
                    style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                  >
                    もう一度試す
                  </button>
                )}
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-dim)]"
                >
                  トップへ戻る
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* 選択肢 */}
      {current && !isEnding && !loading && !error && textDone && current.choices.length > 0 && (
        <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-sunken)]/95 backdrop-blur px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <ChoiceButtons choices={current.choices} onSelect={handleChoice} />
          </div>
        </div>
      )}

      {showItems && <ItemModal items={status.items} onClose={() => setShowItems(false)} />}
    </div>
  );
}
