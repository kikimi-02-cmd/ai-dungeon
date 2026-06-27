'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  getScenario,
  getStartNode,
  initPlayerStatus,
  getAvailableChoices,
  applyChoice,
  isGameOver,
  getGameOverNode,
} from '@/lib/game';
import { getSaveSlot, getAutosave, setAutosave, clearAutosave } from '@/lib/storage';
import { recordRunStart } from '@/lib/progress';
import { Scenario, StoryNode, PlayerStatus, Choice, SaveData, LogEntry } from '@/lib/types';
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';
import StoryDisplay from '@/components/StoryDisplay';
import ChoiceButtons from '@/components/ChoiceButtons';
import ItemModal from '@/components/ItemModal';
import SaveLoadModal from '@/components/SaveLoadModal';
import EndingScreen from '@/components/EndingScreen';
import ChatLog from '@/components/play/ChatLog';

export default function StaticPlay() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus | null>(null);
  const [textDone, setTextDone] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [nodeCount, setNodeCount] = useState(0);
  const [chatLog, setChatLog] = useState<LogEntry[]>([]);

  const startTimeRef = useRef(Date.now());
  const playTimeRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const getPlayTime = useCallback(
    () => playTimeRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000),
    []
  );

  // 初期化
  useEffect(() => {
    const resume = searchParams.get('resume');
    const saveSlot = searchParams.get('saveSlot');
    const scenarioId = searchParams.get('scenarioId');
    const playerName = searchParams.get('playerName');

    const loadFrom = (save: SaveData | null | undefined) => {
      if (!save) return false;
      const sc = getScenario(save.scenarioId);
      if (!sc) return false;
      const node = sc.nodes.find((n) => n.id === save.currentNodeId);
      if (!node) return false;
      setScenario(sc);
      setCurrentNode(node);
      setPlayerStatus(save.playerStatus);
      playTimeRef.current = save.playTime;
      return true;
    };

    if (resume) {
      if (loadFrom(getAutosave())) return;
      router.push('/');
      return;
    }
    if (saveSlot) {
      if (loadFrom(getSaveSlot(Number(saveSlot)))) return;
      router.push('/');
      return;
    }
    if (scenarioId && playerName) {
      const sc = getScenario(scenarioId);
      if (!sc) {
        router.push('/');
        return;
      }
      setScenario(sc);
      setCurrentNode(getStartNode(sc));
      setPlayerStatus(initPlayerStatus(playerName));
      return;
    }
    router.push('/');
  }, [searchParams, router]);

  // オートスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentNode, textDone]);

  // オートセーブ（エンディング以外）
  useEffect(() => {
    if (!scenario || !currentNode || !playerStatus) return;
    if (currentNode.isEnding) {
      clearAutosave();
    } else {
      setAutosave({
        scenarioId: scenario.id,
        currentNodeId: currentNode.id,
        playerStatus,
        playTime: getPlayTime(),
      });
    }
  }, [scenario, currentNode, playerStatus, getPlayTime]);

  const handleChoice = useCallback(
    (choice: Choice) => {
      if (!scenario || !currentNode || !playerStatus) return;

      setChatLog((prev) => [
        ...prev,
        { type: 'ai', text: currentNode.text },
        { type: 'choice', text: choice.text },
      ]);

      const { nextNode, nextStatus } = applyChoice(scenario, choice, playerStatus);
      setNodeCount((c) => c + 1);
      setTextDone(false);
      setPlayerStatus(nextStatus);
      setCurrentNode(isGameOver(nextStatus) ? getGameOverNode(scenario) : nextNode);
    },
    [scenario, currentNode, playerStatus]
  );

  const handleLoad = useCallback((save: SaveData) => {
    const sc = getScenario(save.scenarioId);
    if (!sc) return;
    const node = sc.nodes.find((n) => n.id === save.currentNodeId);
    if (!node) return;
    setScenario(sc);
    setCurrentNode(node);
    setPlayerStatus(save.playerStatus);
    playTimeRef.current = save.playTime;
    setShowSave(false);
    setTextDone(false);
    setChatLog([]);
  }, []);

  if (!scenario || !currentNode || !playerStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--accent)] font-serif-jp animate-pulse">読み込み中…</p>
      </div>
    );
  }

  const isEnding = currentNode.isEnding === true;
  const availableChoices: Choice[] = isEnding
    ? []
    : getAvailableChoices(currentNode, playerStatus);

  return (
    <div data-world={scenario.id} className="min-h-dvh flex flex-col">
      {/* 上部固定：ヘッダー＋HPバー（スクロールしても追従する） */}
      <div className="sticky top-0 z-30">
        <Header scenarioName={scenario.name} />
        <StatusBar
          status={playerStatus}
          onItemsClick={() => setShowItems(true)}
          onSaveClick={() => setShowSave(true)}
        />
      </div>

      <main className="flex-1">
        <div className="max-w-2xl mx-auto w-full px-4 pt-4 pb-4 space-y-4">
          <ChatLog log={chatLog} />

          {isEnding ? (
            <EndingScreen
              endingType={currentNode.endingType ?? 'normal'}
              endingName={currentNode.endingName ?? '旅の終わり'}
              text={currentNode.text}
              scenarioId={scenario.id}
              scenarioName={scenario.name}
              stats={[
                { label: '冒険者', value: playerStatus.name },
                { label: '残りHP', value: String(Math.max(0, playerStatus.hp)) },
                { label: '選んだ選択肢', value: `${nodeCount}回` },
                {
                  label: '所持アイテム',
                  value: playerStatus.items.join('、') || 'なし',
                },
              ]}
              onReplay={() => {
                clearAutosave();
                recordRunStart();
                const params = new URLSearchParams({
                  scenarioId: scenario.id,
                  playerName: playerStatus.name,
                });
                router.push(`/play?${params.toString()}`);
              }}
              onHome={() => {
                clearAutosave();
                router.push('/');
              }}
            />
          ) : (
            <StoryDisplay
              key={currentNode.id}
              text={currentNode.text}
              onComplete={() => setTextDone(true)}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {!isEnding && textDone && availableChoices.length > 0 && (
        <div className="sticky bottom-0 z-20 border-t border-[var(--border)] bg-[var(--bg-sunken)]/95 backdrop-blur px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <ChoiceButtons
              choices={availableChoices.map((c) => c.text)}
              onSelect={(i) => handleChoice(availableChoices[i])}
            />
          </div>
        </div>
      )}

      {showItems && (
        <ItemModal items={playerStatus.items} onClose={() => setShowItems(false)} />
      )}

      {showSave && (
        <SaveLoadModal
          mode="save"
          currentSaveData={{
            scenarioId: scenario.id,
            currentNodeId: currentNode.id,
            playerStatus,
            playTime: getPlayTime(),
          }}
          onLoad={handleLoad}
          onClose={() => setShowSave(false)}
        />
      )}
    </div>
  );
}
