'use client';

import { useEffect, useState } from 'react';
import { SaveData } from '@/lib/types';
import { getSaveData, saveGame, deleteSave, getSlotNumbers } from '@/lib/storage';

interface Props {
  mode: 'save' | 'load';
  currentSaveData?: Omit<SaveData, 'savedAt' | 'slot'>;
  onLoad: (save: SaveData) => void;
  onClose: () => void;
}

export default function SaveLoadModal({ mode, currentSaveData, onLoad, onClose }: Props) {
  const [saves, setSaves] = useState<SaveData[]>([]);

  useEffect(() => {
    setSaves(getSaveData());
  }, []);

  const handleSave = (slot: number) => {
    if (!currentSaveData) return;
    saveGame({ slot, ...currentSaveData });
    setSaves(getSaveData());
    alert(`スロット${slot}にセーブしました`);
    onClose();
  };

  const handleDelete = (slot: number) => {
    deleteSave(slot);
    setSaves(getSaveData());
  };

  const getSave = (slot: number) => saves.find((s) => s.slot === slot);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}分${s}秒`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1E1533] border border-[#4C1D95] rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#A78BFA] font-bold text-lg">
            {mode === 'save' ? '💾 セーブ' : '📂 ロード'}
          </h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#E5E7EB] text-xl">✕</button>
        </div>
        <div className="space-y-3">
          {getSlotNumbers().map((slot) => {
            const save = getSave(slot);
            return (
              <div key={slot} className="bg-[#0F0A1A] border border-[#4C1D95] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#A78BFA] font-bold text-sm">スロット {slot}</span>
                  {save && (
                    <button
                      onClick={() => handleDelete(slot)}
                      className="text-xs text-[#EF4444] hover:underline"
                    >
                      削除
                    </button>
                  )}
                </div>
                {save ? (
                  <div className="text-xs text-[#9CA3AF]">
                    <p>{save.scenarioId} — {save.playerStatus.name}</p>
                    <p>HP: {save.playerStatus.hp} / プレイ時間: {formatTime(save.playTime)}</p>
                    <p>{formatDate(save.savedAt)}</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#6B7280]">空きスロット</p>
                )}
                <div className="mt-2 flex gap-2">
                  {mode === 'save' && (
                    <button
                      onClick={() => handleSave(slot)}
                      className="flex-1 text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg py-1.5 transition-colors"
                    >
                      ここにセーブ
                    </button>
                  )}
                  {mode === 'load' && save && (
                    <button
                      onClick={() => onLoad(save)}
                      className="flex-1 text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg py-1.5 transition-colors"
                    >
                      ロード
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
