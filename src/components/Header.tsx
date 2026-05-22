import Link from 'next/link';

interface Props {
  scenarioName?: string;
}

export default function Header({ scenarioName }: Props) {
  return (
    <header className="bg-[var(--bg-elev)]/90 backdrop-blur border-b border-[var(--border)] py-3 px-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl group-hover:scale-110 transition-transform">🗡</span>
          <span className="font-serif-jp font-bold text-lg text-[var(--accent)] tracking-wide">
            AIダンジョン
          </span>
        </Link>
        {scenarioName && (
          <span className="font-serif-jp text-sm text-[var(--text-dim)] truncate">
            {scenarioName}
          </span>
        )}
      </div>
    </header>
  );
}
