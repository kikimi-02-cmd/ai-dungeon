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

## What
選択肢を選ぶとストーリーが分岐するテキストアドベンチャーRPG

## Why
手軽にテキストRPGを楽しみたいユーザー向け

## How
シナリオ選択 → キャラ名入力 → ストーリー分岐 → マルチエンディング

## Current Phase
Phase Build
