'use client';

import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useEquipment } from '@/context/EquipmentContext';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function StatusPage() {
  const { departments, equipments, totalRegistered, totalVerified, totalMismatched, overallProgress } = useEquipment();
  const [expandedDept, setExpandedDept] = useState<string | null>('게임콘텐츠과');

  const toggleExpand = (dept: string) => {
    setExpandedDept((prev) => (prev === dept ? null : dept));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      {/* Header with back button */}
      <Header
        showBack
        backHref="/"
        title="2026학년도 기자재 조사 현황"
      />

      <main className="mx-auto w-full max-w-xl px-4 py-5 flex-1 space-y-5">
        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">전체 등록</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">{totalRegistered}</span>
              <span className="text-xs text-slate-500">대</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-800">확인 완료</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-700">{totalVerified}</span>
              <span className="text-xs text-emerald-600">대</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-800">수량 불일치</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-black text-amber-700">{totalMismatched}</span>
              <span className="text-xs text-amber-600">종</span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5 shadow-xs">
            <span className="text-[11px] font-semibold text-blue-800">전체 진행률</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-black text-blue-700">{overallProgress}%</span>
            </div>
          </div>
        </div>

        {/* Section: 학과별 기자재 조사 현황 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              학과별 조사 진행 현황
            </h2>
            <span className="text-xs text-slate-500">3개 학과 운영</span>
          </div>

          {/* Department Cards */}
          <div className="space-y-3">
            {departments.map((dept) => {
              const isFull = dept.progressRate >= 100;
              const isExpanded = expandedDept === dept.department;

              return (
                <div
                  key={dept.department}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all"
                >
                  <div
                    onClick={() => toggleExpand(dept.department)}
                    className="cursor-pointer p-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold text-xs">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900">
                            {dept.department}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                            isFull
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          진행률 {dept.progressRate}%
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3.5">
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFull ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${dept.progressRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Detailed Stats Row */}
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400">등록 </span>
                        <strong className="text-slate-800">{dept.registeredCount}대</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">확인 </span>
                        <strong className="text-emerald-700">{dept.verifiedCount}대</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">수량 불일치 </span>
                        <strong className={dept.mismatchCount > 0 ? 'text-amber-600 font-extrabold' : 'text-slate-700'}>
                          {dept.mismatchCount}종
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Expandable items preview */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-3 text-xs space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 mb-1">
                        {dept.department} 주요 기자재 현황
                      </div>
                      {equipments
                        .filter((eq) => eq.department === dept.department)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-2xs"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="truncate font-bold text-slate-800">
                                {item.name} ({item.modelName})
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {item.location}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] text-slate-500">
                                {item.actualQuantity !== undefined
                                  ? `${item.actualQuantity}/${item.registeredQuantity}대`
                                  : `미확인 (${item.registeredQuantity}대)`}
                              </span>
                              {item.status === 'matched' && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  일치
                                </span>
                              )}
                              {item.status === 'mismatched' && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                                  <AlertTriangle className="h-2.5 w-2.5" />
                                  불일치
                                </span>
                              )}
                              {item.status === 'unverified' && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                                  <Clock className="h-2.5 w-2.5" />
                                  대기
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Guide */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
          <h4 className="font-bold text-slate-800 mb-1">💡 현장 조사 팁</h4>
          <p className="leading-relaxed text-slate-500">
            수량 불일치로 기록된 기자재는 K-에듀파인 정기 재물조사 시 사유서(수리, 이관, 폐기 등) 작성의 증빙 자료로 활용할 수 있습니다.
          </p>
        </div>
      </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
  );
}
