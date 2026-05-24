## Canon (tetsuya-os-canon) 必須ロード

このセッションには `tetsuya-os-canon` が attach されている前提。session 開始時に以下を必ず Read してルールに従う:

- `tetsuya-os-canon/AGENTS.md` (#1-#56 絶対ルール、特に **#56 Council orchestration 強制**)
- `tetsuya-os-canon/protocols/council-orchestration-v1.md` (Claude orchestrator 契約)
- `tetsuya-os-canon/protocols/operator-runbook-daily-v1.md` §0 (operator discipline 鉄則)

**運用ルール**:
- skill 起動は slash 直打ちのみ (`/morning` 等)。「おはよう」「朝」等のキーワードでは auto-invoke しない (`disable-model-invocation: true` 仕様)
- AI Council trigger (価格改定 / 不可逆 PR / ¥30K超支出 / 撤退判断 / 新 CXO 建立 / 新規 SaaS 契約) を Claude が能動的に検知して投入 6 段階を driver

起源: 2026-05-24 fresh session 失敗 audit (spoke-cwd 時に canon ルールが invisible 問題)。

---
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
