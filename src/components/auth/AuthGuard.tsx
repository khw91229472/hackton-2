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

  useEffect(() => {
    // If auth state is verified and user is not authenticated
    if (!loading && !isAuthenticated) {
      // Don't redirect if already on login page
      if (pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [loading, isAuthenticated, pathname, router]);

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
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-sm w-full">
          <div className="text-3xl mb-2">🔒</div>
          <h2 className="text-base font-bold text-slate-800">접근 권한이 없습니다</h2>
          <p className="mt-1 text-xs text-slate-500">
            관리자만 접근할 수 있는 페이지입니다.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
