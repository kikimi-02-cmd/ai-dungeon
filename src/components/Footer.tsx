import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#1E1533] py-6 mt-8 text-center space-y-2">
      <div className="flex justify-center gap-4 text-xs text-[#6B7280]">
        <Link href="/how-to-play" className="hover:text-[#A78BFA] transition-colors">
          遊び方
        </Link>
        <Link href="/privacy" className="hover:text-[#A78BFA] transition-colors">
          プライバシーポリシー
        </Link>
      </div>
      <p className="text-xs text-[#4B5563]">© 2026 ai-dungeon</p>
    </footer>
  );
}
