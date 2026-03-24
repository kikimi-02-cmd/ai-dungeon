'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getScenario, getStartNode, initPlayerStatus, getAvailableChoices, applyChoice, isGameOver } from '@/lib/game';
import { getSaveSlot } from '@/lib/storage';
import { Scenario, StoryNode, PlayerStatus, Choice, SaveData } from '@/lib/types';
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

  const startTimeRef = useRef(Date.now());
  const playTimeRef = useRef(0);

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

  const handleChoice = useCallback((choice: Choice) => {
    if (!scenario || !currentNode || !playerStatus) return;
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
    <div className="min-h-screen flex flex-col">
      <Header scenarioName={scenario.name} />
      <StatusBar
        status={playerStatus}
        onItemsClick={() => setShowItems(true)}
        onSaveClick={() => setShowSave(true)}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        {isEnding ? (
          <EndingScreen
            node={currentNode}
            status={playerStatus}
            nodeCount={nodeCount}
            onReplay={() => {
              const name = playerStatus.name;
              const params = new URLSearchParams({ scenarioId: scenario.id, playerName: name });
              router.push(`/play?${params.toString()}`);
            }}
            onChangeScenario={() => router.push('/')}
          />
        ) : (
          <>
            <StoryDisplay
              key={currentNode.id}
              text={currentNode.text}
              onComplete={() => setTextDone(true)}
            />
            <ChoiceButtons
              choices={availableChoices}
              onChoice={handleChoice}
              visible={textDone}
            />
          </>
        )}
      </main>

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
