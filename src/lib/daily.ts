import { todayStr } from '@/lib/progress';

// 日付文字列から決定的な整数ハッシュを得る（全員が同じ「今日のダンジョン」になる）
function hashDate(date: string): number {
  let h = 2166136261;
  for (let i = 0; i < date.length; i++) {
    h ^= date.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export const DAILY_WORLDS = [
  'lost-crown',
  'space-drift',
  'ghost-mansion',
  'dragon-boy',
  'tokyo-mystery',
];

export interface DailyModifier {
  id: string;
  name: string;
  desc: string;
  startHp: number;
  maxHp: number;
  promptHint: string;
}

const MODIFIERS: DailyModifier[] = [
  {
    id: 'normal',
    name: '通常',
    desc: '特別なルールなし。実力が試される。',
    startHp: 100,
    maxHp: 100,
    promptHint: '',
  },
  {
    id: 'hard',
    name: '満身創痍',
    desc: 'HP50からのスタート。慎重な判断が求められる。',
    startHp: 50,
    maxHp: 100,
    promptHint: '主人公は既に深手を負っている。危険な選択肢のダメージはやや大きめに設定すること。',
  },
  {
    id: 'fragile',
    name: '硝子の肉体',
    desc: '最大HPが60しかない。一撃が命取り。',
    startHp: 60,
    maxHp: 60,
    promptHint: '主人公は非常に脆い。緊張感のある描写を心がけること。',
  },
  {
    id: 'lucky',
    name: '幸運の星',
    desc: '良いアイテムや回復のチャンスがやや多い。',
    startHp: 100,
    maxHp: 100,
    promptHint: '幸運に恵まれた日。アイテム入手や回復の機会をやや多めに用意してよい。',
  },
  {
    id: 'rush',
    name: '時の試練',
    desc: '展開が速い。短い冒険で深層を目指せ。',
    startHp: 100,
    maxHp: 100,
    promptHint: '展開を速め、1ターンごとに状況を大きく動かすこと。早めにクライマックスへ向かわせてよい。',
  },
];

export function getDailyDate(): string {
  return todayStr();
}

export function getDailyWorld(date: string): string {
  return DAILY_WORLDS[hashDate(date) % DAILY_WORLDS.length];
}

export function getDailyModifier(date: string): DailyModifier {
  // 日付の別ビットを使い、世界とモディファイアが独立して変わるようにする
  return MODIFIERS[Math.floor(hashDate(date) / 7) % MODIFIERS.length];
}
