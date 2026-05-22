import type { Metadata } from 'next';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';

export const metadata: Metadata = {
  title: 'AIダンジョンの遊び方 | AIが紡ぐブラウザRPG',
  description:
    'AIダンジョンの遊び方を解説。物語モードとAI無限ダンジョン、デイリーダンジョン、エンディング図鑑の楽しみ方。ブラウザだけで遊べる無料テキストRPG。登録不要。',
};

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--bg-elev)]/90 backdrop-blur border-b border-[var(--border)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Link href="/" className="text-xl">🗡</Link>
          <Link href="/" className="font-serif-jp text-[var(--accent)] font-bold text-lg">
            AIダンジョン
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-9">
        <h1 className="font-serif-jp text-2xl font-bold text-[var(--accent)] text-center">
          AIダンジョンの遊び方
        </h1>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)] border-l-4 border-[var(--accent)] pl-3">
            AIダンジョンとは
          </h2>
          <p className="text-[var(--text-dim)] text-sm leading-relaxed">
            選択肢を選んでストーリーを進める、ブラウザで遊べるテキストアドベンチャーRPGです。
            じっくり作り込まれた「物語モード」と、AIが毎回ちがう物語を生成する「AI無限ダンジョン」、
            そして毎日変わる「今日のダンジョン」を楽しめます。完全無料・登録不要。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)] border-l-4 border-[var(--accent)] pl-3">
            2つの遊び方
          </h2>
          {[
            {
              icon: '📖',
              name: '物語モード',
              desc: '作り込まれた分岐ストーリー。選択によって結末が変わるマルチエンディング。すべての結末を集めよう。',
            },
            {
              icon: '🤖',
              name: 'AI無限ダンジョン',
              desc: 'AIがあなたの選択に応じて物語を生成。プレイするたびに展開が変わり、どこまで深く潜れるか挑戦するモード。',
            },
          ].map((m) => (
            <div
              key={m.name}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4"
            >
              <p className="font-bold text-[var(--text)]">
                {m.icon} {m.name}
              </p>
              <p className="text-[var(--text-dim)] text-sm mt-1 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text)] border-l-4 border-[var(--accent)] pl-3">
            進め方
          </h2>
          <ol className="space-y-3">
            {[
              '世界を選び、遊び方（物語モード／AI無限ダンジョン）を決める',
              '冒険者の名前を入力して冒険スタート',
              '表示されるストーリーを読み、選択肢を選んで物語を進める',
              'HPを0にしないように注意。アイテムを集めると有利になる',
              'エンディングに到達すると図鑑に記録される',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center"
                  style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                >
                  {i + 1}
                </span>
                <span className="text-[var(--text-dim)] text-sm pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text)] border-l-4 border-[var(--accent)] pl-3">
            毎日の楽しみ方
          </h2>
          <ul className="space-y-3">
            {[
              { icon: '📅', text: '今日のダンジョン：日替わりの世界と特殊ルールに挑戦' },
              { icon: '🔥', text: '連続プレイ日数：毎日プレイしてストリークを伸ばそう' },
              { icon: '📖', text: 'エンディング図鑑：集めた結末をコレクション' },
              { icon: '🏆', text: '実績：プレイの積み重ねでバッジを解除' },
            ].map(({ icon, text }, i) => (
              <li
                key={i}
                className="flex gap-3 items-center bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-[var(--text)] text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <AdUnit />

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-block font-bold py-3 px-8 rounded-xl transition-all active:scale-[0.98]"
            style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
          >
            さっそく遊ぶ
          </Link>
        </div>
      </main>
    </div>
  );
}
