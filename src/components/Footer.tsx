import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-soft)] py-6 mt-8 text-center space-y-2">
      <div className="flex justify-center flex-wrap gap-4 text-xs text-[var(--text-faint)]">
        <Link href="/how-to-play" className="hover:text-[var(--accent)] transition-colors">
          遊び方
        </Link>
        <Link href="/collection" className="hover:text-[var(--accent)] transition-colors">
          エンディング図鑑
        </Link>
        <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">
          プライバシーポリシー
        </Link>
      </div>
      <p className="text-xs text-[var(--text-faint)]/70">© 2026 AIダンジョン</p>
    </footer>
  );
}
