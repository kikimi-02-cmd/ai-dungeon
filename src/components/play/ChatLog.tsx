import { LogEntry } from '@/lib/types';

interface Props {
  log: LogEntry[];
}

// 過去の場面と選択を会話ログ風に表示する（スクロールバックがそのまま既読履歴になる）
export default function ChatLog({ log }: Props) {
  return (
    <>
      {log.map((entry, i) =>
        entry.type === 'ai' ? (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 flex items-center justify-center text-base shrink-0 mt-0.5">
              🧙
            </div>
            <div className="bg-[var(--bg-card)]/70 border border-[var(--border-soft)] rounded-2xl rounded-tl-md px-4 py-3 flex-1">
              <p className="font-serif-jp text-[var(--text-dim)] text-[14px] leading-[1.9] whitespace-pre-wrap">
                {entry.text}
              </p>
            </div>
          </div>
        ) : (
          <div key={i} className="flex items-start justify-end gap-2.5">
            <div className="bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
              <p className="text-[var(--text)] text-sm">◆ {entry.text}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/35 flex items-center justify-center text-base shrink-0 mt-0.5">
              ⚔️
            </div>
          </div>
        )
      )}
    </>
  );
}
