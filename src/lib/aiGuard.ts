// AI（Claude API）を呼ぶ API ルートの共通ガード。
// 公開 URL から誰でも叩けるため、呼び出し回数に上限を設けて API 費用の暴走を防ぐ。
//
// - AI_DISABLED=1          … AI を一切呼ばない（緊急停止スイッチ）
// - 接続元（IP）ごとの上限 … 既定 20 回 / 1 時間（AI_IP_HOURLY_LIMIT で変更可）
// - 全体の 1 日上限        … 既定 200 回 / UTC 暦日（AI_DAILY_CAP で変更可）
//
// 物語モード（AI無限ダンジョン・デイリー）は 1 場面ごとに 1 回 AI を呼ぶ。
//
// 注意: カウンタはメモリ上にあるため、サーバーレスのインスタンスごとに別々で、
// インスタンスが入れ替わると 0 に戻る。厳密な上限ではなく「暴走の歯止め」。

const HOUR_MS = 60 * 60 * 1000;
const DEFAULT_IP_HOURLY_LIMIT = 20;
const DEFAULT_DAILY_CAP = 200;
const MAX_TRACKED_IPS = 5000;

export type AiGuardResult =
  | { ok: true }
  | { ok: false; status: number; code: string; message: string; retryAfterSec?: number };

const ipWindows = new Map<string, { start: number; count: number }>();
let daily = { day: '', count: 0 };

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export function isAiDisabled(): boolean {
  return process.env.AI_DISABLED === '1';
}

function utcDay(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

function secondsUntilNextUtcDay(now: number): number {
  const d = new Date(now);
  const next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
  return Math.max(1, Math.ceil((next - now) / 1000));
}

// Vercel では x-forwarded-for の先頭がクライアントの IP（Vercel 側で上書きされる）。
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

function pruneIpWindows(now: number) {
  if (ipWindows.size < MAX_TRACKED_IPS) return;
  for (const [ip, w] of ipWindows) {
    if (now - w.start >= HOUR_MS) ipWindows.delete(ip);
  }
  // それでも多すぎる場合は古いものから捨てる（Map は挿入順）
  while (ipWindows.size >= MAX_TRACKED_IPS) {
    const oldest = ipWindows.keys().next().value;
    if (oldest === undefined) break;
    ipWindows.delete(oldest);
  }
}

// AI を 1 回呼ぶ直前に呼ぶ。ok なら回数を 1 消費する。
export function checkAiGuard(req: Request, now: number = Date.now()): AiGuardResult {
  if (isAiDisabled()) {
    return {
      ok: false,
      status: 503,
      code: 'ai_disabled',
      message: 'AIモードは、いまお休みしています。物語シナリオはそのまま遊べます。',
    };
  }

  const ipLimit = envInt('AI_IP_HOURLY_LIMIT', DEFAULT_IP_HOURLY_LIMIT);
  const dailyCap = envInt('AI_DAILY_CAP', DEFAULT_DAILY_CAP);

  const day = utcDay(now);
  if (daily.day !== day) daily = { day, count: 0 };
  if (daily.count >= dailyCap) {
    return {
      ok: false,
      status: 429,
      code: 'daily_cap',
      message: '今日のAIモードは上限に達しました。明日またお試しください。物語シナリオはそのまま遊べます。',
      retryAfterSec: secondsUntilNextUtcDay(now),
    };
  }

  const ip = clientIp(req);
  let w = ipWindows.get(ip);
  if (!w || now - w.start >= HOUR_MS) {
    pruneIpWindows(now);
    w = { start: now, count: 0 };
    ipWindows.set(ip, w);
  }
  if (w.count >= ipLimit) {
    return {
      ok: false,
      status: 429,
      code: 'rate_limited',
      message: 'AIの利用回数が上限に達しました。1時間ほどあけてから、もう一度お試しください。物語シナリオはそのまま遊べます。',
      retryAfterSec: Math.max(1, Math.ceil((w.start + HOUR_MS - now) / 1000)),
    };
  }

  w.count += 1;
  daily.count += 1;
  return { ok: true };
}

// ガードで止めたときのレスポンス。画面は error をそのまま表示する（src/lib/api.ts）。
export function aiGuardResponse(result: Exclude<AiGuardResult, { ok: true }>): Response {
  const headers: Record<string, string> = {};
  if (result.retryAfterSec) headers['Retry-After'] = String(result.retryAfterSec);
  return Response.json(
    { error: result.message, code: result.code },
    { status: result.status, headers },
  );
}
