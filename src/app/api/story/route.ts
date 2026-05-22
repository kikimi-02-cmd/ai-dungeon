import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getWorldBible } from '@/lib/worldBibles';
import { AINodeResponse, AITurn, EndingType } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MODEL = 'claude-haiku-4-5';

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    text: { type: 'string', description: '次の場面の物語本文（280〜420文字程度）' },
    choices: {
      type: 'array',
      items: { type: 'string' },
      description: 'プレイヤーに提示する選択肢（2〜4個）。結末のときは空配列',
    },
    hpChange: { type: 'integer', description: 'この場面でのHP増減（-40〜+30程度、なければ0）' },
    itemGained: { type: 'string', description: '入手アイテム名。なければ空文字' },
    itemLost: { type: 'string', description: '失ったアイテム名。なければ空文字' },
    isEnding: { type: 'boolean', description: '物語の結末ならtrue' },
    endingType: { type: 'string', enum: ['good', 'normal', 'bad', 'none'] },
    endingName: { type: 'string', description: '結末の称号。結末でなければ空文字' },
  },
  required: [
    'text',
    'choices',
    'hpChange',
    'itemGained',
    'itemLost',
    'isEnding',
    'endingType',
    'endingName',
  ],
};

function buildSystem(bible: string, playerName: string): string {
  return `あなたは「AIダンジョン」というテキストアドベンチャーRPGのゲームマスターです。プレイヤーの選択に応じて、物語を一場面ずつ生成します。

【世界設定】
${bible}

【執筆ルール】
- 日本語で執筆する。ノベルゲームのように情景描写と心理描写を豊かに、一場面あたり280〜420文字程度。
- 五感（音・光・におい・温度・手触り）を使って臨場感を出す。登場人物の台詞は「」で書く。
- 毎ターン、プレイヤーに2〜4個の選択肢を用意する。選択肢は具体的で、結果が読めすぎないようにする。
- 物語は floor（階層）が進むごとに緊張感・危険・報酬を高めていく。
- hpChange はその場面の出来事によるHP増減。戦闘・罠・転落などで減り、休息・回復で増える。何もなければ0。
- itemGained / itemLost は入手・喪失したアイテム名。なければ空文字にする。
- isEnding を true にするのは「HPが尽きたとき（endingType=bad）」または「floor 8 以降で物語的な決着がついたとき（good または normal）」のみ。それ以外は false。
- isEnding が true のとき、choices は空配列、endingType と endingName（短く印象的な称号）を設定する。endingType が none になるのは isEnding が false のときだけ。
- 冒険者の名前「${playerName}」を物語に自然に登場させる。
- 同じ展開の繰り返しを避け、毎回新鮮な出来事を起こす。
必ず指定された JSON スキーマに厳密に従って出力すること。`;
}

function buildUserMessage(
  playerName: string,
  hp: number,
  maxHp: number,
  items: string[],
  floor: number,
  history: AITurn[],
  modifierHint: string
): string {
  const recent = history.slice(-6);
  const historyText =
    recent.length === 0
      ? '（まだ物語は始まっていない）'
      : recent
          .map((t, i) => {
            const f = floor - recent.length + i;
            const scene = t.scene.length > 140 ? t.scene.slice(0, 140) + '…' : t.scene;
            return `[floor ${f}] ${scene}\n  → プレイヤーの選択: ${t.action}`;
          })
          .join('\n');

  const instruction =
    history.length === 0
      ? `冒険の幕開けとなる最初の場面（floor 1）を描写してください。世界に主人公を引き込む導入にすること。`
      : `プレイヤーは直前の場面で「${history[history.length - 1].action}」を選びました。その結果として次の場面（floor ${floor}）を描写してください。`;

  return `【現在の状況】
冒険者: ${playerName}
HP: ${hp} / ${maxHp}
所持品: ${items.length ? items.join('、') : 'なし'}
現在の階層: floor ${floor}
${modifierHint ? `特殊ルール: ${modifierHint}\n` : ''}
【これまでの物語】
${historyText}

【指示】
${instruction}`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AIモードは現在準備中です（APIキー未設定）。' },
      { status: 503 }
    );
  }

  let body: {
    worldId?: string;
    playerName?: string;
    hp?: number;
    maxHp?: number;
    items?: string[];
    floor?: number;
    history?: AITurn[];
    modifierHint?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'リクエストが不正です。' }, { status: 400 });
  }

  const world = getWorldBible(body.worldId ?? '');
  if (!world) {
    return NextResponse.json({ error: '世界が見つかりません。' }, { status: 400 });
  }

  const playerName = (body.playerName ?? '冒険者').slice(0, 24);
  const hp = Number.isFinite(body.hp) ? Number(body.hp) : 100;
  const maxHp = Number.isFinite(body.maxHp) ? Number(body.maxHp) : 100;
  const items = Array.isArray(body.items) ? body.items.slice(0, 8) : [];
  const floor = Number.isFinite(body.floor) ? Number(body.floor) : 1;
  const history = Array.isArray(body.history) ? body.history.slice(-20) : [];
  const modifierHint = typeof body.modifierHint === 'string' ? body.modifierHint.slice(0, 200) : '';

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1600,
      system: [
        {
          type: 'text',
          text: buildSystem(world.bible, playerName),
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: buildUserMessage(playerName, hp, maxHp, items, floor, history, modifierHint),
        },
      ],
      output_config: {
        format: { type: 'json_schema', schema: RESPONSE_SCHEMA },
      },
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: '物語の生成に失敗しました。' }, { status: 502 });
    }

    const raw = JSON.parse(textBlock.text) as {
      text: string;
      choices: string[];
      hpChange: number;
      itemGained: string;
      itemLost: string;
      isEnding: boolean;
      endingType: string;
      endingName: string;
    };

    const isEnding = raw.isEnding === true;
    const endingType: EndingType | null =
      isEnding && (raw.endingType === 'good' || raw.endingType === 'normal' || raw.endingType === 'bad')
        ? raw.endingType
        : isEnding
          ? 'normal'
          : null;

    const result: AINodeResponse = {
      text: String(raw.text ?? '').trim(),
      choices: isEnding
        ? []
        : (Array.isArray(raw.choices) ? raw.choices : [])
            .map((c) => String(c).trim())
            .filter(Boolean)
            .slice(0, 4),
      hpChange: Number.isFinite(raw.hpChange) ? Math.round(raw.hpChange) : 0,
      itemGained: raw.itemGained && raw.itemGained.trim() ? raw.itemGained.trim() : null,
      itemLost: raw.itemLost && raw.itemLost.trim() ? raw.itemLost.trim() : null,
      isEnding,
      endingType,
      endingName: isEnding ? (raw.endingName?.trim() || '旅の終わり') : null,
    };

    // 結末でないのに選択肢が無い場合のフォールバック
    if (!result.isEnding && result.choices.length === 0) {
      result.choices = ['先へ進む', '慎重に周囲を調べる'];
    }

    return NextResponse.json(result);
  } catch (e) {
    const status = e instanceof Anthropic.APIError ? e.status ?? 502 : 502;
    return NextResponse.json(
      { error: 'AIが物語の生成に失敗しました。少し待って再試行してください。' },
      { status }
    );
  }
}
