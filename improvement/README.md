# improvement/ — UAIF (Universal Auto-Improvement Framework)

このディレクトリは、このプロダクトの**自己改善ループ**の状態を保持する。
仕様の唯一の真実ソースは canon `protocols/auto-improvement-v1.md`。

## ファイル

- `config.json` — このリポの設定 (North Star / guardrail / verify コマンド / 自律度 / kill switch)。
- `backlog.md` — Diverge エンジンが生んだ改善候補 (1 週間ルールで寝かせてから実装)。
- `log.md` — Reflect 診断と Ship 履歴 (Reflexion ループの記憶。指標が動いたかをここで答え合わせ)。

## ループ (週次 cron / `.github/workflows/auto-improve.yml`)

```
Reflect (自己診断) → Diverge (BP 調査"以上"の着想) → Improve (確認ゲート付き PR)
```

## 安全

- `config.json` の `enabled:false` で完全停止 (runtime kill switch)。
- `mode:"shadow"` の間は DRAFT PR のみ。検証ゲート通過後に `live` 昇格 (Tetsuya 承認)。
- T2 (価格・スキーマ・削除・auth 等の不可逆変更) は自動実装せず AI Council へ。

## 手動実行

`/improve` slash、または GitHub Actions の `auto-improve` workflow を `workflow_dispatch` で起動。
