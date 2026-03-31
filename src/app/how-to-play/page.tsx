import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI ダンジョンの遊び方 | AIが生成するブラウザRPG',
  description:
    'AIダンジョンの遊び方を解説。ブラウザだけで遊べる無料テキストRPG。シナリオを選び、選択肢を選んでストーリーを進めよう。完全無料・登録不要。',
};

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1E1533] border-b border-[#4C1D95] px-4 py-3 flex items-center gap-3">
        <span className="text-xl">🗡</span>
        <Link href="/" className="text-[#A78BFA] font-bold text-lg hover:text-white transition-colors">
          AIダンジョン
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-10">
        <h1 className="text-3xl font-bold text-[#A78BFA] text-center">
          AI ダンジョンの遊び方
        </h1>

        {/* AIダンジョンとは */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#E5E7EB] border-l-4 border-[#7C3AED] pl-3">
            AI ダンジョンとは
          </h2>
          <p className="text-[#9CA3AF] leading-relaxed">
            AIが生成するランダムダンジョンを探索するブラウザRPGです。
            モンスターを倒してアイテムを集め、深い階層を目指しましょう。
            プレイするたびに異なるストーリーが展開するテキストアドベンチャーで、
            5つのシナリオとマルチエンディングを楽しめます。
          </p>
        </section>

        {/* 遊び方 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#E5E7EB] border-l-4 border-[#7C3AED] pl-3">
            遊び方
          </h2>
          <ol className="space-y-3">
            {[
              'トップ画面でシナリオ（世界観）を選ぶ',
              '冒険者の名前を入力してゲーム開始',
              '表示されるストーリーを読む',
              '選択肢を選んでストーリーを進める',
              'HPを0にしないように注意しながら探索する',
              'アイテムを集めて有利な選択肢を解放する',
              'エンディングに到達してクリア！',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7C3AED] text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-[#9CA3AF] pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 特徴 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#E5E7EB] border-l-4 border-[#7C3AED] pl-3">
            特徴
          </h2>
          <ul className="space-y-3">
            {[
              { icon: '🆓', text: '完全無料・課金要素なし' },
              { icon: '🔑', text: '登録不要・すぐに遊べる' },
              { icon: '📱', text: 'スマホ対応・ブラウザで動作' },
              { icon: '🤖', text: 'AIが生成するオリジナルダンジョン' },
              { icon: '💾', text: 'セーブ機能付きで途中から再開可能' },
              { icon: '🏆', text: 'Good / Normal / Bad の3種エンディング' },
            ].map(({ icon, text }, i) => (
              <li key={i} className="flex gap-3 items-center bg-[#1E1533] rounded-xl px-4 py-3">
                <span className="text-xl">{icon}</span>
                <span className="text-[#E5E7EB] text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 広告枠 */}
        <div className="overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-9336081041068058"
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* トップへ戻る */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-block bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
