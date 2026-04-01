export interface PlayerStatus {
  name: string;
  hp: number;
  maxHp: number;
  items: string[];
  flags: string[];
}

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
  endingType?: 'good' | 'normal' | 'bad';
  endingName?: string;
}

export interface Scenario {
  id: string;
  name: string;
  emoji: string;
  description: string;
  startNodeId: string;
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
