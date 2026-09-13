'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('teacher' | 'admin')[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isUnauthorized = Boolean(allowedRoles && role && !allowedRoles.includes(role));

  useEffect(() => {
    // If auth state is verified and user is not authenticated
    if (!loading && !isAuthenticated) {
      // Don't redirect if already on login page
      if (pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [loading, isAuthenticated, pathname, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && isUnauthorized) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, isUnauthorized, router]);

  // If loading, show simple clean loading spinner instead of blank screen
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md font-bold text-lg">
            ON
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span>사용자 인증 확인 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, render nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check role restriction if specified
  if (isUnauthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm max-w-sm w-full animate-in fade-in duration-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3.5">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900">
            관리자 권한이 필요한 페이지입니다.
          </h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            일반 교사 계정으로는 접근할 수 없습니다.<br />
            잠시 후 홈 화면으로 이동합니다.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-600 font-semibold">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>홈으로 이동 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
