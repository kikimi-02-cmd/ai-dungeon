// 世界観ごとのテーマ。play 画面のルートに data-world を付け、
// globals.css 側で --accent などの CSS 変数を切り替える。

export interface WorldTheme {
  id: string;
  accent: string;
  glow: string;
}

const THEMES: Record<string, WorldTheme> = {
  'lost-crown': { id: 'lost-crown', accent: '#d8b04a', glow: 'rgba(216,176,74,0.28)' },
  'space-drift': { id: 'space-drift', accent: '#4fb8d8', glow: 'rgba(79,184,216,0.28)' },
  'ghost-mansion': { id: 'ghost-mansion', accent: '#c44a63', glow: 'rgba(196,74,99,0.28)' },
  'dragon-boy': { id: 'dragon-boy', accent: '#43b189', glow: 'rgba(67,177,137,0.28)' },
  'tokyo-mystery': { id: 'tokyo-mystery', accent: '#dd9140', glow: 'rgba(221,145,64,0.28)' },
  default: { id: 'default', accent: '#c9a24b', glow: 'rgba(201,162,75,0.28)' },
};

export function getTheme(id: string | undefined): WorldTheme {
  return (id && THEMES[id]) || THEMES.default;
}
