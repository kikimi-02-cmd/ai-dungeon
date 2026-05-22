// ===== 共通 =====
export type EndingType = 'good' | 'normal' | 'bad';

export interface PlayerStatus {
  name: string;
  hp: number;
  maxHp: number;
  items: string[];
  flags: string[];
}

// ===== 静的シナリオ（物語モード） =====
export interface StatusEffect {
  hpChange?: number;
  addItem?: string;
  removeItem?: string;
  addFlag?: string;
}

export interface Choice {
  text: string;
  nextNodeId: string;
  requiredItem?: string;
  requiredFlag?: string;
  statusEffect?: StatusEffect;
}

export interface StoryNode {
  id: string;
  text: string;
  choices: Choice[];
  statusEffect?: StatusEffect;
  isEnding?: boolean;
  endingType?: EndingType;
  endingName?: string;
}

export interface Scenario {
  id: string;
  name: string;
  emoji: string;
  description: string;
  startNodeId: string;
  badEndingNodeId?: string;
  nodes: StoryNode[];
}

export interface SaveData {
  slot: number;
  scenarioId: string;
  currentNodeId: string;
  playerStatus: PlayerStatus;
  playTime: number;
  savedAt: string;
}

export interface GameState {
  scenario: Scenario;
  currentNode: StoryNode;
  playerStatus: PlayerStatus;
  playTime: number;
}

export interface LogEntry {
  type: 'ai' | 'choice';
  text: string;
}

// ===== AI無限ダンジョン（AIモード） =====
// API が 1 ターンごとに返す構造化レスポンス
export interface AINodeResponse {
  text: string;
  choices: string[];
  hpChange: number;
  itemGained: string | null;
  itemLost: string | null;
  isEnding: boolean;
  endingType: EndingType | null;
  endingName: string | null;
}

// 完了した 1 ターン（履歴用）
export interface AITurn {
  scene: string;
  action: string;
}

// AIモードのセーブ／進行状態
export interface AIGameSave {
  worldId: string;
  playerName: string;
  status: PlayerStatus;
  floor: number;
  history: AITurn[];
  current: AINodeResponse;
  daily: string | null; // デイリーダンジョンの日付（YYYY-MM-DD）。通常プレイは null
  savedAt: string;
}

// ===== 進行データ（ストリーク・図鑑・実績） =====
export interface UnlockedEnding {
  key: string; // 例: "lost-crown:good"
  scenarioId: string;
  endingType: EndingType;
  endingName: string;
  unlockedAt: string;
}

export interface ProgressData {
  streakCount: number;
  streakBest: number;
  lastPlayDate: string | null; // YYYY-MM-DD
  totalRuns: number;
  totalClears: number;
  bestAIFloor: number;
  endings: UnlockedEnding[];
  achievements: string[]; // 解除済み実績 ID
  dailyClears: string[]; // クリア済みデイリーの日付
}
