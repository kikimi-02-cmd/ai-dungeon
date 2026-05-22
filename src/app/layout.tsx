import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

const SITE_URL = "https://ai-dungeon-coral.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AIダンジョン | AIが紡ぐテキストアドベンチャーRPG",
  description:
    "AIが物語を生成するテキストアドベンチャーRPG。5つの物語シナリオと、何度でも違う冒険になるAI無限ダンジョン。デイリーダンジョン・エンディング図鑑・実績つき。完全無料・登録不要。",
  manifest: "/manifest.json",
  applicationName: "AIダンジョン",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, title: "AIダンジョン", statusBarStyle: "black-translucent" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "AIダンジョン",
    title: "AIダンジョン | AIが紡ぐテキストアドベンチャーRPG",
    description:
      "AIが物語を生成するテキストアドベンチャーRPG。毎日プレイしたくなる無限ダンジョンとデイリーチャレンジ。完全無料・登録不要。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIダンジョン | AIが紡ぐテキストアドベンチャーRPG",
    description:
      "AIが物語を生成するテキストアドベンチャーRPG。毎日違う冒険が待つ無限ダンジョン。完全無料・登録不要。",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0912",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
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
      <body className="min-h-screen flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
