'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  onComplete: () => void;
}

const CHAR_DELAY = 18;

export default function StoryDisplay({ text, onComplete }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        // 2文字ずつ進めてテンポを出す
        indexRef.current = Math.min(text.length, indexRef.current + 2);
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDone(true);
        completeRef.current();
      }
    }, CHAR_DELAY);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const skipToEnd = () => {
    if (done) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed(text);
    setDone(true);
    completeRef.current();
  };

  return (
    <div className="flex items-start gap-2.5 anim-rise">
      <div className="w-9 h-9 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center text-base shrink-0 mt-0.5">
        🧙
      </div>
      <div
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl rounded-tl-md px-4 py-3.5 flex-1 cursor-pointer shadow-lg shadow-black/30"
        onClick={skipToEnd}
      >
        <p className="font-serif-jp text-[var(--text)] leading-[1.95] text-[15px] whitespace-pre-wrap">
          {displayed}
          {!done && <span className="animate-pulse text-[var(--accent)]">▌</span>}
        </p>
        {!done && (
          <p className="text-[10px] text-[var(--text-faint)] mt-2 text-right">タップで全文表示</p>
        )}
      </div>
    </div>
  );
}
