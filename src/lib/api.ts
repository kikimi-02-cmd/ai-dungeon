import { AINodeResponse, AITurn, PlayerStatus } from '@/lib/types';

export interface GenerateParams {
  worldId: string;
  status: PlayerStatus;
  floor: number;
  history: AITurn[];
  modifierHint?: string;
}

// AI無限ダンジョンの次の場面を生成する。
export async function generateNode(params: GenerateParams): Promise<AINodeResponse> {
  const res = await fetch('/api/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      worldId: params.worldId,
      playerName: params.status.name,
      hp: params.status.hp,
      maxHp: params.status.maxHp,
      items: params.status.items,
      floor: params.floor,
      history: params.history,
      modifierHint: params.modifierHint ?? '',
    }),
  });

  if (!res.ok) {
    let msg = 'AIとの通信に失敗しました。';
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  return (await res.json()) as AINodeResponse;
}
