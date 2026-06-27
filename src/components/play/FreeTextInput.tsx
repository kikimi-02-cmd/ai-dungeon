'use client';

import { useRef, useState, type KeyboardEvent } from 'react';

interface Props {
  onSubmit: (text: string) => void;
  /** 行動のヒント。タップすると入力欄に流し込まれる（そのまま送信ではなく、編集できる） */
  suggestions?: string[];
  disabled?: boolean;
  placeholder?: string;
}

export default function FreeTextInput({
  onSubmit,
  suggestions = [],
  disabled = false,
  placeholder = 'どうする？ 行動を自由に入力…',
}: Props) {
  const [value, setValue] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);

  const autoGrow = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`;
  };

  const fill = (text: string) => {
    setValue(text);
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(text.length, text.length);
      autoGrow();
    });
  };

  const send = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSubmit(t);
    setValue('');
    requestAnimationFrame(autoGrow);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // PC: Cmd/Ctrl+Enter で送信（通常の Enter は改行のまま）
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="space-y-2">
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button
              key={`${s}-${i}`}
              type="button"
              onClick={() => fill(s)}
              disabled={disabled}
              className="text-xs text-[var(--accent)] border border-[var(--accent)]/40 rounded-full px-3 py-1 hover:bg-[var(--accent)]/12 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none anim-rise"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={taRef}
          value={value}
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            autoGrow();
          }}
          onKeyDown={onKeyDown}
          className="flex-1 resize-none bg-[var(--bg-card)] border border-[var(--border)] focus:border-[var(--accent)]/70 rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-faint)] disabled:opacity-50"
        />
        <button
          type="button"
          onClick={send}
          disabled={disabled || !value.trim()}
          className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
        >
          送る
        </button>
      </div>
    </div>
  );
}
