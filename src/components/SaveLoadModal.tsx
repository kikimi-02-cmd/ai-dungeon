'use client';

import { useEffect, useState } from 'react';
import { SaveData } from '@/lib/types';
import { getSaveData, saveGame, deleteSave, getSlotNumbers } from '@/lib/storage';
import { getScenario } from '@/lib/game';

interface Props {
  mode: 'save' | 'load';
  currentSaveData?: Omit<SaveData, 'savedAt' | 'slot'>;
  onLoad: (save: SaveData) => void;
  onClose: () => void;
}

export default function SaveLoadModal({ mode, currentSaveData, onLoad, onClose }: Props) {
  const [saves, setSaves] = useState<SaveData[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setSaves(getSaveData());
  }, []);

  const handleSave = (slot: number) => {
    if (!currentSaveData) return;
    saveGame({ slot, ...currentSaveData });
    setSaves(getSaveData());
    setNotice(`スロット${slot}にセーブしました`);
    setTimeout(onClose, 700);
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

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}分${sec % 60}秒`;

  const scenarioName = (id: string) => getScenario(id)?.name ?? id;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 anim-fade"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif-jp text-[var(--accent)] font-bold text-lg">
            {mode === 'save' ? '💾 セーブ' : '📂 ロード'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-faint)] hover:text-[var(--text)] text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {notice && (
          <p className="text-xs text-[var(--accent)] text-center mb-3">{notice}</p>
        )}

        <div className="space-y-2.5">
          {getSlotNumbers().map((slot) => {
            const save = getSave(slot);
            return (
              <div
                key={slot}
                className="bg-[var(--bg-sunken)] border border-[var(--border-soft)] rounded-xl p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[var(--accent)] font-bold text-sm">スロット {slot}</span>
                  {save && (
                    <button
                      onClick={() => handleDelete(slot)}
                      className="text-xs text-[var(--hp-low)] hover:underline"
                    >
                      削除
                    </button>
                  )}
                </div>
                {save ? (
                  <div className="text-xs text-[var(--text-dim)] space-y-0.5">
                    <p className="text-[var(--text)]">
                      {scenarioName(save.scenarioId)} — {save.playerStatus.name}
                    </p>
                    <p>
                      HP {save.playerStatus.hp} ／ プレイ時間 {formatTime(save.playTime)}
                    </p>
                    <p className="text-[var(--text-faint)]">{formatDate(save.savedAt)}</p>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-faint)]">空きスロット</p>
                )}
                <div className="mt-2.5">
                  {mode === 'save' && (
                    <button
                      onClick={() => handleSave(slot)}
                      className="w-full text-xs font-bold rounded-lg py-2 transition-all active:scale-[0.98]"
                      style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                    >
                      ここにセーブ
                    </button>
                  )}
                  {mode === 'load' && save && (
                    <button
                      onClick={() => onLoad(save)}
                      className="w-full text-xs font-bold rounded-lg py-2 transition-all active:scale-[0.98]"
                      style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                    >
                      この記録から再開
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
