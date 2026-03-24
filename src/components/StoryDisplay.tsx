'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  onComplete: () => void;
}

const CHAR_DELAY = 30;

export default function StoryDisplay({ text, onComplete }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // テキストが変わったらリセット
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(intervalRef.current!);
        setDone(true);
        onComplete();
      }
    }, CHAR_DELAY);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  const skipToEnd = () => {
    if (done) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed(text);
    setDone(true);
    onComplete();
  };

  return (
    <div
      className="bg-[#1E1533] border border-[#4C1D95] rounded-xl p-5 min-h-[200px] cursor-pointer select-none"
      onClick={skipToEnd}
    >
      <p className="text-[#E5E7EB] leading-relaxed text-sm whitespace-pre-wrap">
        {displayed}
        {!done && <span className="animate-pulse text-[#A78BFA]">▌</span>}
      </p>
      {!done && (
        <p className="text-xs text-[#6B7280] mt-3 text-right">タップでスキップ</p>
      )}
    </div>
  );
}
