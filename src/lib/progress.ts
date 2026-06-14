import { ProgressData, EndingType, UnlockedEnding } from '@/lib/types';
import { getAllScenarios } from '@/lib/game';
import { trackEvent } from '@/lib/gtag';

const PROGRESS_KEY = 'ai-dungeon-progress';

const DEFAULT_PROGRESS: ProgressData = {
  streakCount: 0,
  streakBest: 0,
  lastPlayDate: null,
  totalRuns: 0,
  totalClears: 0,
  bestAIFloor: 0,
  endings: [],
  achievements: [],
  dailyClears: [],
};

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-clear', name: '冒険のはじまり', desc: '初めてエンディングに到達した', icon: '🌅' },
  { id: 'streak-3', name: '習慣の芽生え', desc: '3日連続でプレイした', icon: '🔥' },
  { id: 'streak-7', name: '一週間の旅人', desc: '7日連続でプレイした', icon: '⚡' },
  { id: 'master-one', name: '物語の探求者', desc: '1つのシナリオで全3エンディングを制覇', icon: '📖' },
  { id: 'collector-10', name: '結末の蒐集家', desc: 'エンディングを10種類解放した', icon: '🗂' },
  { id: 'collector-all', name: '全ての結末', desc: '物語モードの全エンディングを解放した', icon: '👑' },
  { id: 'survivor', name: '深層の生還者', desc: 'AI無限ダンジョンで5階に到達した', icon: '🪜' },
  { id: 'deep-diver', name: '奈落の探検家', desc: 'AI無限ダンジョンで10階に到達した', icon: '🕳' },
  { id: 'daily-first', name: '今日の挑戦者', desc: 'デイリーダンジョンを初クリアした', icon: '📅' },
];

// 物語モードの全エンディング一覧（図鑑用）
export interface EndingSlot {
  key: string;
  scenarioId: string;
  scenarioName: string;
  endingType: EndingType;
  endingName: string;
}

export function getAllEndingSlots(): EndingSlot[] {
  const slots: EndingSlot[] = [];
  for (const s of getAllScenarios()) {
    for (const n of s.nodes) {
      if (n.isEnding && n.endingType && n.endingName) {
        slots.push({
          key: `${s.id}:${n.endingType}`,
          scenarioId: s.id,
          scenarioName: s.name,
          endingType: n.endingType,
          endingName: n.endingName,
        });
      }
    }
  }
  return slots;
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getProgress(): ProgressData {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...(JSON.parse(raw) as Partial<ProgressData>) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function save(p: ProgressData): ProgressData {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  }
  return p;
}

function recomputeAchievements(p: ProgressData): string[] {
  const unlocked = new Set(p.achievements);
  if (p.totalClears >= 1) unlocked.add('first-clear');
  if (p.streakBest >= 3) unlocked.add('streak-3');
  if (p.streakBest >= 7) unlocked.add('streak-7');
  if (p.endings.length >= 10) unlocked.add('collector-10');
  if (p.bestAIFloor >= 5) unlocked.add('survivor');
  if (p.bestAIFloor >= 10) unlocked.add('deep-diver');
  if (p.dailyClears.length >= 1) unlocked.add('daily-first');

  // 1シナリオ全3エンディング制覇
  const byScenario: Record<string, Set<string>> = {};
  for (const e of p.endings) {
    (byScenario[e.scenarioId] ??= new Set()).add(e.endingType);
  }
  if (Object.values(byScenario).some((set) => set.size >= 3)) unlocked.add('master-one');

  // 物語モード全エンディング解放
  const totalSlots = getAllEndingSlots().length;
  const unlockedStatic = p.endings.filter((e) => e.scenarioId !== 'ai').length;
  if (totalSlots > 0 && unlockedStatic >= totalSlots) unlocked.add('collector-all');

  return [...unlocked];
}

// ゲーム開始時に呼ぶ：ストリーク更新 + 総プレイ数加算
export function recordRunStart(): ProgressData {
  const p = getProgress();
  const today = todayStr();
  if (p.lastPlayDate !== today) {
    if (p.lastPlayDate === yesterdayStr()) {
      p.streakCount += 1;
    } else {
      p.streakCount = 1;
    }
    p.lastPlayDate = today;
    p.streakBest = Math.max(p.streakBest, p.streakCount);
  }
  p.totalRuns += 1;
  p.achievements = recomputeAchievements(p);
  return save(p);
}

// エンディング到達時に呼ぶ
export function recordEnding(
  scenarioId: string,
  scenarioName: string,
  endingType: EndingType,
  endingName: string
): { progress: ProgressData; isNewEnding: boolean; newAchievements: Achievement[] } {
  const p = getProgress();
  const before = new Set(p.achievements);
  p.totalClears += 1;

  const key = `${scenarioId}:${endingType}`;
  const isNewEnding = !p.endings.some((e) => e.key === key);
  if (isNewEnding) {
    const entry: UnlockedEnding = {
      key,
      scenarioId,
      endingType,
      endingName,
      unlockedAt: new Date().toISOString(),
    };
    p.endings.push(entry);
  }
  p.achievements = recomputeAchievements(p);
  save(p);

  trackEvent('clear', {
    scenario_id: scenarioId,
    scenario_name: scenarioName,
    ending_type: endingType,
    is_new_ending: isNewEnding,
  });

  const newAchievements = ACHIEVEMENTS.filter(
    (a) => p.achievements.includes(a.id) && !before.has(a.id)
  );
  return { progress: p, isNewEnding, newAchievements };
}

// AIモードの到達階を記録
export function recordAIFloor(floor: number): void {
  const p = getProgress();
  if (floor > p.bestAIFloor) {
    p.bestAIFloor = floor;
    p.achievements = recomputeAchievements(p);
    save(p);
  }
}

// デイリーダンジョンのクリアを記録
export function recordDailyClear(date: string): void {
  const p = getProgress();
  if (!p.dailyClears.includes(date)) {
    p.dailyClears.push(date);
    p.achievements = recomputeAchievements(p);
    save(p);
  }
}

export function hasEnding(p: ProgressData, key: string): boolean {
  return p.endings.some((e) => e.key === key);
}
