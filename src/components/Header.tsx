import Link from 'next/link';

interface Props {
  scenarioName?: string;
}

export default function Header({ scenarioName }: Props) {
  return (
    <header className="bg-[#1E1533] border-b border-[#4C1D95] py-3 px-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[#A78BFA] font-bold text-lg">
          <span>🗡</span>
          <span>AIダンジョン</span>
        </Link>
        {scenarioName && (
          <span className="text-[#E5E7EB] text-sm opacity-70">{scenarioName}</span>
        )}
      </div>
    </header>
  );
}
