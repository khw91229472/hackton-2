'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { useEquipment } from '@/context/EquipmentContext';
import {
  ShieldCheck,
  Users,
  Building2,
  Database,
  ArrowRight,
} from 'lucide-react';

export default function AdminPage() {
  const { profile } = useAuth();
  const { totalRegistered, totalVerified, totalMismatched, departments } = useEquipment();

  // Mock users list in eunpyeong school
  const schoolUsers = [
    { name: '홍길동', email: 'teacher@example.com', department: '뷰티메이크업과', role: 'teacher', status: '활동 중' },
    { name: '이게임', email: 'game.teacher@example.com', department: '게임콘텐츠과', role: 'teacher', status: '활동 중' },
    { name: '박조리', email: 'cook.teacher@example.com', department: '호텔조리과', role: 'teacher', status: '활동 중' },
    { name: '김관리', email: 'admin@example.com', department: '행정총괄부', role: 'admin', status: '관리자' },
  ];

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
        {/* Header */}
        <Header
          showBack
          backHref="/"
          title="관리자 전용 대시보드"
        />

        <main className="mx-auto w-full max-w-xl px-4 py-5 flex-1 space-y-5">
          {/* Admin Banner */}
          <div className="rounded-3xl bg-linear-to-br from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/30 text-indigo-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-indigo-200">
                {profile?.schoolName || '은평문화예술정보학교'} 행정관리실
              </span>
            </div>

            <h1 className="mt-2.5 text-xl font-black tracking-tight">
              기자재 조사 총괄 관리
            </h1>
            <p className="mt-1 text-xs text-indigo-200">
              관리자 권한으로 전체 학과 조사 데이터 및 담당 교사를 조회합니다.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-indigo-700/60 pt-3 text-center">
              <div>
                <span className="text-[11px] text-indigo-300">총 기자재</span>
                <div className="text-base font-extrabold text-white">{totalRegistered}대</div>
              </div>
              <div>
                <span className="text-[11px] text-indigo-300">실사 완료</span>
                <div className="text-base font-extrabold text-emerald-300">{totalVerified}대</div>
              </div>
              <div>
                <span className="text-[11px] text-indigo-300">수량 불일치</span>
                <div className="text-base font-extrabold text-amber-300">{totalMismatched}건</div>
              </div>
            </div>
          </div>

          {/* Teacher / User Management Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  학교 소속 교사 및 관리자 목록
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                {schoolUsers.length}명
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {schoolUsers.map((u) => (
                <div key={u.email} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{u.name}</span>
                      {u.role === 'admin' ? (
                        <span className="rounded bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 font-extrabold">
                          관리자
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 font-medium">
                          교사
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{u.email}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-slate-700">{u.department}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">{u.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Progress Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  학과별 실사 진행 개요
                </h2>
              </div>
              <Link href="/status" className="text-xs font-bold text-blue-600 hover:underline">
                상세보기 →
              </Link>
            </div>

            <div className="space-y-2.5">
              {departments.map((d) => (
                <div key={d.department} className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800">{d.department}</span>
                    <span className={d.progressRate >= 100 ? 'text-emerald-700' : 'text-blue-700'}>
                      {d.progressRate}% ({d.verifiedCount}/{d.registeredCount}대)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${d.progressRate >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                      style={{ width: `${d.progressRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Link
              href="/data"
              className="touch-target flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <Database className="h-3.5 w-3.5 text-indigo-600" />
              <span>K-에듀파인 데이터</span>
            </Link>

            <Link
              href="/"
              className="touch-target flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 p-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <span>메인 화면으로</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </main>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}
