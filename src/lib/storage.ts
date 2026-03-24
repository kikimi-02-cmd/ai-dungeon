import { SaveData } from '@/lib/types';

const STORAGE_KEY = 'ai-dungeon-saves';
const MAX_SLOTS = 3;

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
