import { SaveData, AIGameSave } from '@/lib/types';

const STORAGE_KEY = 'ai-dungeon-saves';
const AUTOSAVE_KEY = 'ai-dungeon-autosave';
const AI_SAVE_KEY = 'ai-dungeon-ai-save';
const MAX_SLOTS = 3;

// ===== 手動セーブスロット（物語モード） =====
export function getSaveData(): SaveData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SaveData[];
  } catch {
    return [];
  }
}

export function getSaveSlot(slot: number): SaveData | undefined {
  return getSaveData().find((s) => s.slot === slot);
}

export function saveGame(data: Omit<SaveData, 'savedAt'>): void {
  if (typeof window === 'undefined') return;
  const saves = getSaveData().filter((s) => s.slot !== data.slot);
  const newSave: SaveData = { ...data, savedAt: new Date().toISOString() };
  saves.push(newSave);
  saves.sort((a, b) => a.slot - b.slot);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export function deleteSave(slot: number): void {
  if (typeof window === 'undefined') return;
  const saves = getSaveData().filter((s) => s.slot !== slot);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export function getSlotNumbers(): number[] {
  return Array.from({ length: MAX_SLOTS }, (_, i) => i + 1);
}

// ===== オートセーブ（物語モード・閉じても続きから） =====
export function getAutosave(): SaveData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    return raw ? (JSON.parse(raw) as SaveData) : null;
  } catch {
    return null;
  }
}

export function setAutosave(data: Omit<SaveData, 'savedAt' | 'slot'>): void {
  if (typeof window === 'undefined') return;
  const save: SaveData = { slot: 0, ...data, savedAt: new Date().toISOString() };
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(save));
}

export function clearAutosave(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTOSAVE_KEY);
}

// ===== AIモードのオートセーブ =====
export function getAISave(): AIGameSave | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AI_SAVE_KEY);
    return raw ? (JSON.parse(raw) as AIGameSave) : null;
  } catch {
    return null;
  }
}

export function setAISave(save: Omit<AIGameSave, 'savedAt'>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AI_SAVE_KEY, JSON.stringify({ ...save, savedAt: new Date().toISOString() }));
}

export function clearAISave(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AI_SAVE_KEY);
}
