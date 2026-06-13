---
description: UAIF auto-improvement loop. Reflect → Diverge → Improve の3エンジンを回し、確認ゲート付きで改善 PR を開く。canon protocols/auto-improvement-v1.md の実装複製。
disable-model-invocation: true
---

# /improve — Universal Auto-Improvement Loop

SoT: canon `protocols/auto-improvement-v1.md`。本 skill はその product 層実装。
設定は `improvement/config.json` を読む。**必ず冒頭で読み込み、`enabled:false` なら即終了**。

> このリポが Next.js の場合: コードを書く前に `node_modules/next/dist/docs/` の該当ガイドを読むこと
> (canon 規約)。訓練データの Next.js 知識は古い前提で扱う。

## 前提チェック (必ず最初)

1. `improvement/config.json` を読む。`enabled !== true` → 何もせず終了。
2. `mode` を確認 (`shadow` = DRAFT PR のみ / `live` = `autonomy` ティアに従う)。
3. `improvement/log.md` 末尾を読み、**前サイクルで ship した改善が指標を動かしたか**を確認 (Reflexion 複利化)。

## Engine A — Reflect (自己診断)

`config.telemetry` の各ソースと、リポ自身を読んで North Star / guardrail に対する劣化点を診断:
- 直近 commit / open issue / `npm run lint` / `npm test` の結果
- 利用可能なら analytics・Vercel ログ・Supabase 指標 (なければコード/UX の静的診断で代替)
- 前サイクルの仮説の答え合わせ (指標が動いた/動かなかった → log に追記)

出力: 劣化点 Top 3〜5 を根拠付きで列挙 → `improvement/log.md` に `## <date> Reflect` として追記。

## Engine B — Diverge (BP 調査"以上"の着想)

**3 フェーズを順守。発散フェーズを飛ばすと既存解に丸め込まれる。**

1. **収束 — BP 走査**: この種のプロダクトで best-in-class は何をしているか調査 (WebSearch 可)。
2. **発散 — 制約解放**: *North Star も guardrail も既存規約も一旦忘れて*アイデアを自由生成 (最低 8 個)。
   うち **最低 1 個は現行規約に意図的に違反する wildcard** とする。
3. **収束 — 採点**: 各候補を `新規性 / 実現性 / 指標寄与` 各 1-5 で採点 (Evaluator 役として批判的に)。
   - 横断転移: canon `state/auto_improve.json` の他リポ `shipped` で効いた改善を自リポ向けに 1 個以上検討。

出力: 採点表 → 上位候補を `improvement/backlog.md` に追記 (1 週間ルール: 既存 backlog で 1 サイクル
寝かせた候補を今サイクルの実装対象にする。当サイクル新規はまず backlog 化のみ)。

## Engine C — Improve (自動改善 / 確認ゲート)

backlog 上位 1 件 (`max_open_prs` 上限) を実装:

1. **ティア判定** (`protocols/auto-improvement-v1.md`):
   - `config.irreversible_keywords` に触れる → **T2**: 実装せず、Council 必要として log + backlog に明記し終了。
   - 新機能/UX/プロンプト/データ表示変更 → **T1**。
   - コピー/a11y/dead code/依存更新/テスト追加/lint → **T0**。
   - 迷ったら上のティアに倒す (fail-safe)。
2. **実装**: `improvement/` の branch (`uaif/<short-slug>`) で最小差分。
3. **検証**: `config.verify` の install/build/lint/test/typecheck を実行。緑でなければ PR を開かず log に失敗記録。
4. **PR 本文に必須**: 仮説 / 対象 North Star 指標 / 期待変化 / ロールバック手順 / ティア (T0/T1/T2) / 根拠。
5. **ゲート適用**:
   - `mode==="shadow"` → 全て **DRAFT PR** (auto-merge しない)。
   - `mode==="live"` & **T0** → CI 緑で auto-merge 可。
   - `live` & **T1** → 通常 PR (Tetsuya レビュー待ち)。
   - **T2** → PR を開かず Council ルーティングのみ。
6. **log 永続化**: `improvement/log.md` に `## <date> Ship` として PR URL / ティア / 仮説 / 検証する指標を記録。

## コスト/暴走ガード

- `token_budget_usd` を超えそうなら現フェーズで打ち切り、途中結果を log に残して終了。
- open PR が `max_open_prs` 以上あれば新規実装せず Reflect/Diverge のみ実行。

## 出力サマリ (run 末尾)

```
UAIF run — <repo> <date> (<mode>)
Reflect: <劣化点 N 件>
Diverge: <候補 N 件 / backlog 追加 N 件>
Improve: <PR URL or "no PR (reason)"> [T0/T1/T2]
前サイクル指標: <動いた/動かない/N/A>
```
