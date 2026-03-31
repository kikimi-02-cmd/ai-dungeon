'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllScenarios } from '@/lib/game';
import { getSaveData } from '@/lib/storage';
import { Scenario, SaveData } from '@/lib/types';
import ScenarioSelect from '@/components/ScenarioSelect';
import Header from '@/components/Header';
import SaveLoadModal from '@/components/SaveLoadModal';

export default function HomePage() {
  const router = useRouter();
  const [saves, setSaves] = useState<SaveData[]>([]);
  const [showLoad, setShowLoad] = useState(false);
  const scenarios = getAllScenarios();

  useEffect(() => {
    setSaves(getSaveData());
  }, []);

  const handleSelect = (scenario: Scenario) => {
    const name = prompt('冒険者の名前を入力してください', '勇者');
    if (!name) return;
    const params = new URLSearchParams({ scenarioId: scenario.id, playerName: name });
    router.push(`/play?${params.toString()}`);
  };

  const handleLoad = (save: SaveData) => {
    const params = new URLSearchParams({ saveSlot: String(save.slot) });
    router.push(`/play?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* タイトル */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🗡</div>
          <h1 className="text-3xl font-bold text-[#A78BFA] mb-2">AIダンジョン</h1>
          <p className="text-[#9CA3AF] text-sm mb-3">〜テキストアドベンチャーRPG〜</p>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-3">
            AIが生成するダンジョンを探索しよう！モンスターを倒してアイテムを集め、どこまで深く潜れるか挑戦。
          </p>
          <Link
            href="/how-to-play"
            className="inline-block text-xs text-[#A78BFA] border border-[#4C1D95] hover:bg-[#1E1533] px-3 py-1.5 rounded-lg transition-colors"
          >
            遊び方を見る
          </Link>
        </div>

        {/* シナリオ選択 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#A78BFA] mb-3">シナリオを選んでください</h2>
          <ScenarioSelect scenarios={scenarios} onSelect={handleSelect} />
        </div>

        {/* セーブデータ */}
        {saves.length > 0 && (
          <button
            onClick={() => setShowLoad(true)}
            className="w-full border border-[#4C1D95] text-[#A78BFA] hover:bg-[#1E1533] rounded-xl py-3 text-sm font-semibold transition-colors"
          >
            📂 セーブデータから再開
          </button>
        )}

      </main>

      {showLoad && (
        <SaveLoadModal
          mode="load"
          onLoad={handleLoad}
          onClose={() => setShowLoad(false)}
        />
      )}
    </div>
  );
}
