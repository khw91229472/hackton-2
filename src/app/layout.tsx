import type { Metadata, Viewport } from 'next';
import './globals.css';
import { EquipmentProvider } from '@/context/EquipmentContext';

export const metadata: Metadata = {
  title: '기자재ON - 서울시교육청 위탁형 직업교육학교 교사용 기자재 관리',
  description: '찍으면 찾고, 확인하면 끝. K-에듀파인 연계 실습실 기자재 현장 실사 보조 도구',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <EquipmentProvider>
          {children}
        </EquipmentProvider>
      </body>
    </html>
  );
}
