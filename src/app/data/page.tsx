'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useEquipment } from '@/context/EquipmentContext';
import { useAuth } from '@/context/AuthContext';
import {
  FileSpreadsheet,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Info,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export default function DataManagementPage() {
  const { profile } = useAuth();
  const { equipments } = useEquipment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('전체');

  const filteredEquipments = equipments.filter((item) => {
    const matchesDept = selectedDept === '전체' || item.department === selectedDept;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      {/* Header with back button */}
      <Header
        showBack
        backHref="/"
        title="K-에듀파인 기자재 목록"
      />

      <main className="mx-auto w-full max-w-xl px-4 py-5 flex-1 space-y-5">
        {/* Title and Description Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              K-에듀파인 기자재 목록
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            K-에듀파인에서 내려받은 기자재 목록을 불러와 현장 조사에 활용합니다.
          </p>
        </div>

        {/* Excel File Import UI Area - 관리자 전용 노출 (일반 교사에게는 절대 노출하지 않음) */}
        {profile?.role === 'admin' ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center">
            <div className="mx-auto mb-3 inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>관리자 전용 기능</span>
            </div>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm border border-indigo-100">
              <Upload className="h-6 w-6" />
            </div>

            <h3 className="mt-3 text-sm font-extrabold text-slate-900">
              K-에듀파인 엑셀 파일 불러오기
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
              관리자 권한으로 .xlsx 파일을 업로드하여 원본 대장을 일괄 등록/수정합니다.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <Link
                href="/admin"
                className="touch-target inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-[0.99] transition-all"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>관리자 페이지에서 Excel 업로드하기</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>교사용 안내:</strong> 본 목록은 현장 실사를 돕기 위한 <strong>읽기 전용</strong> 조회 화면입니다. 원본 대장 수정 및 엑셀 일괄 등록은 행정 관리자 권한으로만 가능합니다.
            </div>
          </div>
        )}

        {/* Currently Loaded Data List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-600" />
              현재 로드된 기자재 목록
            </h3>
            <span className="text-xs text-slate-500">
              총 {filteredEquipments.length}건
            </span>
          </div>

          {/* Search & Department Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="품명, 모델명, 자산번호, 실습실 검색..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Department Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['전체', '게임콘텐츠과', '뷰티메이크업과', '호텔조리과'].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`touch-target rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedDept === dept
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Cards List */}
          <div className="space-y-2.5">
            {filteredEquipments.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-600">
                        {item.assetNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {item.department}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-xs font-semibold text-blue-700">
                      {item.modelName} ({item.specification})
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {item.status === 'matched' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        일치
                      </span>
                    )}
                    {item.status === 'mismatched' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        불일치
                      </span>
                    )}
                    {item.status === 'unverified' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        <Clock className="h-3 w-3 text-slate-400" />
                        미확인
                      </span>
                    )}
                  </div>
                </div>

                {/* Location & Quantity Row */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-600">
                  <span className="text-slate-500">{item.location}</span>
                  <div className="flex items-center gap-2">
                    <span>
                      등록: <strong className="text-slate-800">{item.registeredQuantity}대</strong>
                    </span>
                    {item.actualQuantity !== undefined && (
                      <span>
                        실사: <strong className={item.actualQuantity === item.registeredQuantity ? 'text-emerald-700' : 'text-amber-700'}>
                          {item.actualQuantity}대
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                {item.notes && (
                  <div className="rounded-md bg-amber-50/70 p-1.5 text-[11px] text-amber-900 border border-amber-100">
                    <strong>비고:</strong> {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
  );
}
