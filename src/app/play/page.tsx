'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getScenario, getStartNode, initPlayerStatus, getAvailableChoices, applyChoice, isGameOver } from '@/lib/game';
import { getSaveSlot } from '@/lib/storage';
import { Scenario, StoryNode, PlayerStatus, Choice, SaveData, LogEntry } from '@/lib/types';
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';
import StoryDisplay from '@/components/StoryDisplay';
import ChoiceButtons from '@/components/ChoiceButtons';
import ItemModal from '@/components/ItemModal';
import SaveLoadModal from '@/components/SaveLoadModal';
import EndingScreen from '@/components/EndingScreen';

// ゲームオーバーノード（疑似ノード）
const GAME_OVER_NODE: StoryNode = {
  id: '__gameover__',
  text: 'HPが0になってしまった。意識が薄れ、暗闇に沈んでいく……。この冒険はここで終わりだ。',
  choices: [],
  isEnding: true,
  endingType: 'bad',
  endingName: '力尽きた冒険者',
};

function PlayContent() {
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

  // 初期化
  useEffect(() => {
    const saveSlot = searchParams.get('saveSlot');
    const scenarioId = searchParams.get('scenarioId');
    const playerName = searchParams.get('playerName');

    if (saveSlot) {
      const save = getSaveSlot(Number(saveSlot));
      if (save) {
        const sc = getScenario(save.scenarioId);
        if (!sc) { router.push('/'); return; }
        const node = sc.nodes.find((n) => n.id === save.currentNodeId);
        if (!node) { router.push('/'); return; }
        setScenario(sc);
        setCurrentNode(node);
        setPlayerStatus(save.playerStatus);
        playTimeRef.current = save.playTime;
        return;
      }
    }

    if (scenarioId && playerName) {
      const sc = getScenario(scenarioId);
      if (!sc) { router.push('/'); return; }
      setScenario(sc);
      setCurrentNode(getStartNode(sc));
      setPlayerStatus(initPlayerStatus(playerName));
    } else {
      router.push('/');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 新ノードまたは選択肢表示時に自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentNode, textDone]);

  const handleChoice = useCallback((choice: Choice) => {
    if (!scenario || !currentNode || !playerStatus) return;

    // 現在のノードと選択をログに積む
    setChatLog((prev) => [
      ...prev,
      { type: 'ai', text: currentNode.text },
      { type: 'choice', text: choice.text },
    ]);

    const { nextNode, nextStatus } = applyChoice(scenario, choice, playerStatus);
    setNodeCount((c) => c + 1);
    setTextDone(false);

    if (isGameOver(nextStatus)) {
      setPlayerStatus(nextStatus);
      setCurrentNode(GAME_OVER_NODE);
    } else {
      setPlayerStatus(nextStatus);
      setCurrentNode(nextNode);
    }
  }, [scenario, currentNode, playerStatus]);

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

  const getPlayTime = () => {
    return playTimeRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  if (!scenario || !currentNode || !playerStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#A78BFA]">読み込み中...</p>
      </div>
    );
  }

  const isEnding = currentNode.isEnding === true;
  const availableChoices = isEnding ? [] : getAvailableChoices(currentNode, playerStatus);

  return (
    <div className="h-dvh flex flex-col bg-[#0F0A1A]">
      <Header scenarioName={scenario.name} />
      <StatusBar
        status={playerStatus}
        onItemsClick={() => setShowItems(true)}
        onSaveClick={() => setShowSave(true)}
      />

      {/* スクロール可能な冒険ログエリア */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full px-4 pt-4 pb-4 space-y-4">

          {/* 過去のログ（AIバブル + 選択バブル） */}
          {chatLog.map((entry, i) =>
            entry.type === 'ai' ? (
              <div key={i} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[#4C1D95] flex items-center justify-center text-sm shrink-0 mt-1">
                  🧙
                </div>
                <div className="bg-[#1E1533] border border-[#4C1D95]/40 rounded-2xl rounded-tl-none px-4 py-3 flex-1">
                  <p className="text-[#9CA3AF] text-sm leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start justify-end gap-2">
                <div className="bg-[#7C3AED]/70 rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[80%]">
                  <p className="text-[#E5E7EB] text-sm">▶ {entry.text}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-sm shrink-0 mt-1">
                  ⚔️
                </div>
              </div>
            )
          )}

          {/* 現在のノード（エンディングまたはタイプライター） */}
          {isEnding ? (
            <EndingScreen
              node={currentNode}
              status={playerStatus}
              nodeCount={nodeCount}
              scenarioName={scenario.name}
              onReplay={() => {
                const name = playerStatus.name;
                const params = new URLSearchParams({ scenarioId: scenario.id, playerName: name });
                router.push(`/play?${params.toString()}`);
              }}
              onChangeScenario={() => router.push('/')}
            />
          ) : (
            <StoryDisplay
              key={currentNode.id}
              text={currentNode.text}
              onComplete={() => setTextDone(true)}
            />
          )}

          {/* スクロールアンカー */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 選択肢（テキスト完了後に下部に固定表示） */}
      {!isEnding && textDone && availableChoices.length > 0 && (
        <div className="shrink-0 border-t border-[#4C1D95]/40 bg-[#0A0714] px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <ChoiceButtons
              choices={availableChoices}
              onChoice={handleChoice}
              visible={true}
            />
          </div>
        </div>
      )}

      {showItems && playerStatus && (
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

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#A78BFA]">読み込み中...</p>
      </div>
    }>
      <PlayContent />
    </Suspense>
  );
}
