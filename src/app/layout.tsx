import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AIダンジョン | テキストアドベンチャーRPG",
  description:
    "選択肢を選んでストーリーを進めるテキストアドベンチャー。5つのシナリオ、マルチエンディング。セーブ機能付き。",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9336081041068058"
          crossOrigin="anonymous"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M8Y6KYVDFS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M8Y6KYVDFS');
            `,
          }}
        />
      </head>
      <body className="bg-[#0F0A1A] text-[#E5E7EB] min-h-screen flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
