import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | AIダンジョン',
  description:
    'AIダンジョンのプライバシーポリシー。広告（Google AdSense）、アクセス解析、Cookie、データの取り扱いについて説明します。',
};

export default function PrivacyPage() {
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

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-8">
        <h1 className="font-serif-jp text-2xl font-bold text-[var(--accent)] text-center">
          プライバシーポリシー
        </h1>

        {[
          {
            h: '個人情報の取り扱い',
            p: 'AIダンジョン（以下「当サイト」）は、ユーザー登録を必要とせず、氏名・住所・メールアドレスなどの個人情報を取得・保存することはありません。冒険者の名前やセーブデータは、お使いのブラウザ内（localStorage）にのみ保存され、当サイトのサーバーへ送信されることはありません。',
          },
          {
            h: 'AIによる物語生成について',
            p: '「AI無限ダンジョン」モードでは、選択内容やゲームの進行状況（HP・所持アイテム・これまでの物語）を物語生成のためにAI APIへ送信します。冒険者の名前以外に個人を特定できる情報は送信されず、送信された内容はゲーム体験の提供のみに利用されます。',
          },
          {
            h: '広告について',
            p: '当サイトは第三者配信の広告サービス「Google AdSense」を利用しています。Googleなどの第三者配信事業者は、Cookieを使用して、ユーザーの過去のアクセス情報に基づいた広告を表示する場合があります。Cookieを無効にする設定およびGoogle広告に関する詳細は、Googleの「広告 - ポリシーと規約」ページをご確認ください。',
          },
          {
            h: 'アクセス解析ツールについて',
            p: '当サイトは、サイトの利用状況を把握するためにGoogleアナリティクスを利用しています。Googleアナリティクスはトラフィックデータの収集のためにCookieを使用します。このデータは匿名で収集されており、個人を特定するものではありません。ブラウザの設定でCookieを無効にすることで、収集を拒否することができます。',
          },
          {
            h: 'Cookieについて',
            p: 'Cookieとは、ウェブサイトがブラウザに保存する小さなデータです。当サイトでは広告配信およびアクセス解析のためにCookieが使用されることがあります。ユーザーはブラウザの設定からCookieを無効化できます。',
          },
          {
            h: '免責事項',
            p: '当サイトのコンテンツは無料でお楽しみいただけますが、その内容の正確性や完全性を保証するものではありません。当サイトの利用により生じたいかなる損害についても、運営者は責任を負いかねます。',
          },
          {
            h: 'ポリシーの変更',
            p: '本プライバシーポリシーは、必要に応じて変更されることがあります。変更後の内容は当ページに掲載した時点で有効となります。',
          },
        ].map((s) => (
          <section key={s.h} className="space-y-2">
            <h2 className="text-lg font-bold text-[var(--text)] border-l-4 border-[var(--accent)] pl-3">
              {s.h}
            </h2>
            <p className="text-[var(--text-dim)] text-sm leading-relaxed">{s.p}</p>
          </section>
        ))}

        <p className="text-xs text-[var(--text-faint)] text-center">
          制定日：2026年5月
        </p>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-block font-bold py-3 px-8 rounded-xl transition-all active:scale-[0.98]"
            style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
          >
            トップに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
