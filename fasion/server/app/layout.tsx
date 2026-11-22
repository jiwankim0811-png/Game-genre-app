import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';

export const metadata: Metadata = {
  title: '장르나침반 (GenreCompass) | 게임 장르 탐색 & 큐레이션',
  description: '피지컬 vs 뇌지컬, 단판 vs 장기! 2축 4분면 좌표 맵으로 한눈에 파악하는 직관적인 게임 장르 개념 번역기',
  keywords: ['게임장르', '장르나침반', '로그라이트', '소울라이크', '메트로배니아', '4X', 'CRPG', '게임추천'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-[#0f131c] text-[#dfe2ee] flex flex-col font-sans antialiased selection:bg-primary selection:text-black">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
