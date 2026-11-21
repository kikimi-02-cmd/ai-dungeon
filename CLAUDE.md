# ai-dungeon（AIダンジョン・テキストRPG）

AIがゲームマスター。選択肢を選ぶとストーリーが分岐するテキストアドベンチャーRPG。セーブ可能。

## Tech Stack

- Next.js 16 (App Router)。破壊的変更あり — 書く前に `node_modules/next/dist/docs/` の該当ガイドを読む
- TypeScript (strict)
- Tailwind CSS
- Vercel でホスティング
- ストーリーデータは JSON ファイルで管理（MVP）
- セーブデータはlocalStorage
- Claude API（v1.1で追加）
  - 回数の歯止め（`src/lib/aiGuard.ts`、`/api/story` が通る）: `AI_DISABLED=1` で AI を呼ばない / `AI_IP_HOURLY_LIMIT`（既定 20・接続元ごと 1 時間）/ `AI_DAILY_CAP`（既定 200・全体で 1 日 UTC）。超えたら 429 と日本語の案内。数えはメモリ上（インスタンスごと・入れ替わると 0 に戻る）

## What
選択肢を選ぶとストーリーが分岐するテキストアドベンチャーRPG

## Why
手軽にテキストRPGを楽しみたいユーザー向け

## How
シナリオ選択 → キャラ名入力 → ストーリー分岐 → マルチエンディング

## Current Phase
Phase Build
