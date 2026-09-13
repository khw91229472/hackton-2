'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, School, Sparkles } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  backHref,
  onBack,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Top Organization Badge */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-1 text-center">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-1.5 text-xs text-slate-500">
          <School className="h-3.5 w-3.5 text-blue-600" />
          <span>서울특별시교육청 위탁형 직업교육학교 실습실 기자재 보조시스템</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          {showBack ? (
            <button
              onClick={handleBack}
              aria-label="이전 화면으로 이동"
              className="touch-target -ml-2 inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="text-sm font-medium text-slate-700">이전</span>
            </button>
          ) : null}

          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-base shadow-sm">
                ON
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  기자재ON
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {subtitle || '찍으면 찾고, 확인하면 끝'}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Action / Status Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span>K-에듀파인 보조</span>
          </div>
        </div>
      </div>

      {/* Page Title if specified */}
      {title && (
        <div className="mx-auto max-w-xl border-t border-slate-100 px-4 py-2 bg-slate-50/50">
          <h1 className="text-base font-bold text-slate-800">{title}</h1>
        </div>
      )}
    </header>
  );
};
