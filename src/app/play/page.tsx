'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StaticPlay from '@/components/play/StaticPlay';
import AIPlay from '@/components/play/AIPlay';

function PlayRouter() {
  const mode = useSearchParams().get('mode');
  return mode === 'ai' ? <AIPlay /> : <StaticPlay />;
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[var(--accent)] font-serif-jp animate-pulse">読み込み中…</p>
        </div>
      }
    >
      <PlayRouter />
    </Suspense>
  );
}
