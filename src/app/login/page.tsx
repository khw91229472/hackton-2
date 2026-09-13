'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { School, Loader2, AlertCircle, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to home
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(email, password);
      // Both teacher and admin redirect to /
      router.replace('/');
    } catch (err: unknown) {
      console.error('Login error:', err);
      const error = err as { code?: string; message?: string };
      if (error.code === 'auth/wrong-password') {
        setErrorMessage('비밀번호가 올바르지 않습니다.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('올바른 이메일 형식이 아닙니다.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setErrorMessage(error.message || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (type: 'teacher' | 'admin') => {
    if (type === 'teacher') {
      setEmail('teacher@example.com');
      setPassword('teacher1234!');
    } else {
      setEmail('admin@example.com');
      setPassword('admin1234!');
    }
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8">
      {/* Minimalist Centered Container (Google / ChatGPT style) */}
      <div className="w-full max-w-[390px] rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <span className="font-extrabold text-lg">ON</span>
          </div>

          <h1 className="mt-3.5 text-2xl font-black tracking-tight text-slate-900">
            기자재ON
          </h1>

          <div className="mt-2 space-y-0.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-700">
              <School className="h-3.5 w-3.5" />
              <span>은평문화예술정보학교</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              교사용 기자재 현장 확인 서비스
            </p>
          </div>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="touch-target w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-extrabold text-white shadow-xs hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>로그인 확인 중...</span>
                </>
              ) : (
                <span>로그인</span>
              )}
            </button>
          </div>
        </form>

        {/* Quick Test Demo Account Fillers */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-2">
            <span>테스트 계정 빠른 선택</span>
            <span className="text-blue-600 font-bold">원클릭 입력</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('teacher')}
              className="touch-target flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-center hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <span className="text-xs font-bold text-slate-800">일반 교사</span>
              <span className="text-[10px] text-slate-500">뷰티메이크업과</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="touch-target flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
            >
              <span className="text-xs font-bold text-slate-800">시스템 관리자</span>
              <span className="text-[10px] text-slate-500">관리자 계정</span>
            </button>
          </div>
        </div>

        {/* Bottom subtle note */}
        <div className="mt-6 text-center text-[11px] text-slate-400">
          서울시교육청 위탁형 직업교육학교 통합 인증
        </div>
      </div>
    </div>
  );
}
