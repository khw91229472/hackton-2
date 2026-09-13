'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useEquipment } from '@/context/EquipmentContext';
import { Camera, BarChart3, Database, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { totalRegistered, totalVerified, overallProgress, totalMismatched } = useEquipment();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      {/* Top Header */}
      <Header />

      {/* Main container */}
      <main className="mx-auto w-full max-w-xl px-4 py-6 flex-1 space-y-6">
        {/* Welcome & Subtitle Banner */}
        <div className="rounded-3xl bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg relative overflow-hidden">
          {/* Subtle background decorative shapes */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-blue-400/20 blur-lg pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <span>실습실 현장 실사 지원</span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              기자재ON
            </h1>
            <p className="mt-1 text-sm font-medium text-blue-100">
              찍으면 찾고, 확인하면 끝
            </p>

            {/* Quick mini-progress strip */}
            <div className="mt-5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/15">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-blue-100 font-medium">전체 조사 진행률</span>
                <span className="font-extrabold text-white text-sm">{overallProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-blue-100">
                <span>등록 {totalRegistered}대 중 <strong>{totalVerified}대</strong> 확인 완료</span>
                {totalMismatched > 0 && (
                  <span className="text-amber-200 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    수량 불일치 {totalMismatched}건
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Big Menu Cards */}
        <div className="space-y-3.5">
          {/* 1. 기자재 찾기 (Highlight - Most prominent card) */}
          <Link
            href="/scan"
            className="touch-target group relative block overflow-hidden rounded-3xl border-2 border-blue-600 bg-white p-5 shadow-md hover:shadow-xl transition-all active:scale-[0.99]"
          >
            {/* Featured Badge */}
            <div className="absolute top-0 right-0 rounded-bl-xl bg-blue-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-xs">
              추천 / 메인 기능
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md group-hover:scale-105 transition-transform">
                <Camera className="h-8 w-8 stroke-[2.2]" />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    기자재 찾기
                  </h2>
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-600 leading-relaxed">
                  사진으로 등록된 기자재를 찾아보세요.
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>지금 사진 찍고 찾기</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>
          </Link>

          {/* 2. 기자재 현황 */}
          <Link
            href="/status"
            className="touch-target group block rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                <BarChart3 className="h-7 w-7 stroke-[2.2]" />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <h2 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  기자재 현황
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  학과별 기자재 조사 현황을 확인하세요.
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <span>학과별 진행률 보기</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>

          {/* 3. 데이터 관리 */}
          <Link
            href="/data"
            className="touch-target group block rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                <Database className="h-7 w-7 stroke-[2.2]" />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <h2 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  데이터 관리
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  K-에듀파인 기자재 목록을 관리하세요.
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                  <span>K-에듀파인 목록 보기</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Notice Card for Teachers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            선생님을 위한 간단 안내
          </h3>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-500">
            <li className="flex items-start gap-1.5">
              <span className="text-blue-600 font-bold">•</span>
              <span>본 웹앱은 <strong>K-에듀파인을 대체하지 않으며</strong>, 현장 실사를 빠르게 돕는 보조 도구입니다.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-blue-600 font-bold">•</span>
              <span>스마트폰 카메라로 기자재 라벨을 찍으면 K-에듀파인 장부와 즉시 대조됩니다.</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
