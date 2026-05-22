'use client';

import { useState } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  defaultName?: string;
  confirmLabel?: string;
  onConfirm: (name: string) => void;
  onClose: () => void;
}

export default function NameInputModal({
  title,
  subtitle,
  defaultName = '',
  confirmLabel = '冒険を始める',
  onConfirm,
  onClose,
}: Props) {
  const [name, setName] = useState(defaultName);
  const trimmed = name.trim();

  const submit = () => {
    if (trimmed) onConfirm(trimmed.slice(0, 16));
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 anim-fade"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif-jp text-[var(--accent)] font-bold text-lg text-center">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[var(--text-dim)] text-xs text-center mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}

        <input
          autoFocus
          type="text"
          value={name}
          maxLength={16}
          placeholder="冒険者の名前"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="w-full mt-5 bg-[var(--bg-sunken)] border border-[var(--border)] focus:border-[var(--accent)] outline-none rounded-xl px-4 py-3 text-[var(--text)] text-center font-serif-jp text-base transition-colors"
        />

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-dim)] text-sm hover:bg-[var(--bg-sunken)] transition-colors"
          >
            やめる
          </button>
          <button
            onClick={submit}
            disabled={!trimmed}
            className="flex-[1.6] py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
            style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
