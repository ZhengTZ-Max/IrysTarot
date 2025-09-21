import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "神秘塔罗占卜 - IRYS",
  description: "探索神秘的塔罗世界，每日一卡洞察命运奥秘。在IRYS测试网上铸造独特的塔罗牌NFT。",
  keywords: ["塔罗牌", "占卜", "NFT", "IRYS", "区块链", "神秘学"],
  authors: [{ name: "神秘塔罗 dApp" }],
  openGraph: {
    title: "神秘塔罗占卜- IRYS",
    description: "探索神秘的塔罗世界，每日一卡洞察命运奥秘",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}