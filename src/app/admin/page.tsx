'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { useEquipment } from '@/context/EquipmentContext';
import {
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Download,
  Check,
} from 'lucide-react';

export default function AdminPage() {
  const { profile } = useAuth();
  const {
    equipments,
    departments,
    totalRegistered,
    totalVerified,
    totalMismatched,
  } = useEquipment();

  // Tab navigation for admin features
  const [activeTab, setActiveTab] = useState<'all' | 'mismatch' | 'excel' | 'departments'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('전체');

  // Excel upload simulation state
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Unverified count
  const unverifiedCount = Math.max(0, totalRegistered - totalVerified);

  // Mismatched equipments
  const mismatchedItems = equipments.filter((eq) => eq.status === 'mismatched');

  // Filtered equipment list
  const filteredEquipments = equipments.filter((item) => {
    if (activeTab === 'mismatch' && item.status !== 'mismatched') return false;
    const matchesDept = selectedDept === '전체' || item.department === selectedDept;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleSimulateExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadState('uploading');
      setTimeout(() => {
        setUploadState('success');
      }, 1200);
    }
  };

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
          {/* Admin Header Title */}
          <div className="rounded-3xl bg-linear-to-br from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-yellow-300" />
                <span>관리자 모드</span>
              </div>
              <span className="text-xs text-indigo-200 font-medium">
                {profile?.name || '관리자'} ({profile?.department || '행정총괄부'})
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight">
              {profile?.schoolName || '은평문화예술정보학교'}
            </h1>
            <p className="mt-1 text-xs text-indigo-200">
              K-에듀파인 공식 장부와 학과별 현장 실사 데이터를 통합 관리합니다.
            </p>
          </div>

          {/* 4 Required KPI Summary Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {/* 1. 등록 기자재 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">등록 기자재</span>
                <Layers className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{totalRegistered}</span>
                <span className="text-xs text-slate-400">대</span>
              </div>
              <span className="text-[10px] text-slate-400">K-에듀파인 대장</span>
            </div>

            {/* 2. 실사 완료 */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800">실사 완료</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-700">{totalVerified}</span>
                <span className="text-xs text-emerald-600">대</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">
                진행률 {Math.round((totalVerified / (totalRegistered || 1)) * 100)}%
              </span>
            </div>

            {/* 3. 수량 불일치 */}
            <div
              onClick={() => setActiveTab('mismatch')}
              className="cursor-pointer rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 shadow-xs hover:border-amber-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-900">수량 불일치</span>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-700">{totalMismatched}</span>
                <span className="text-xs text-amber-600">건</span>
              </div>
              <span className="text-[10px] text-amber-800 font-bold underline">
                불일치 내역 확인 →
              </span>
            </div>

            {/* 4. 미확인 기자재 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">미확인 기자재</span>
                <Clock className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-700">{unverifiedCount}</span>
                <span className="text-xs text-slate-400">대</span>
              </div>
              <span className="text-[10px] text-slate-400">실사 대기 품목</span>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl bg-slate-200/70 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 rounded-xl py-2 px-3 transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. 기자재 대장 ({equipments.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mismatch')}
              className={`flex-1 rounded-xl py-2 px-3 transition-colors ${
                activeTab === 'mismatch'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              5. 수량 불일치 ({mismatchedItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              className={`flex-1 rounded-xl py-2 px-3 transition-colors ${
                activeTab === 'excel'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-700 hover:text-indigo-900'
              }`}
            >
              2. Excel 업로드
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('departments')}
              className={`flex-1 rounded-xl py-2 px-3 transition-colors ${
                activeTab === 'departments'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 hover:text-blue-900'
              }`}
            >
              4. 학과별 현황
            </button>
          </div>

          {/* Tab 2: Excel File Upload Section */}
          {activeTab === 'excel' && (
            <div className="rounded-3xl border border-indigo-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    K-에듀파인 기자재 목록 Excel 업로드
                  </h2>
                  <p className="text-xs text-slate-500">
                    K-에듀파인 물품관리에서 내려받은 표준 양식 엑셀 파일을 업로드합니다.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center">
                <input
                  type="file"
                  id="admin-excel-input"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleSimulateExcelUpload}
                />
                <label
                  htmlFor="admin-excel-input"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-xs border border-indigo-100 mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    Excel 파일(.xlsx) 선택 또는 드래그
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    물품관리번호, 물품명, 규격, 학과, 등록수량 열이 포함되어야 합니다.
                  </span>
                </label>
              </div>

              {/* Upload Status Feedback */}
              {uploadState === 'uploading' && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                  <span className="text-xs font-bold text-blue-700 animate-pulse">
                    [{uploadedFileName}] 파일을 파싱하고 K-에듀파인 대장을 업데이트 중입니다...
                  </span>
                </div>
              )}

              {uploadState === 'success' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-800">
                    <Check className="h-4 w-4" />
                    <span>[{uploadedFileName}] 업로드 및 데이터 동기화 완료!</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-700">
                    총 177건의 실습 기자재가 최신 대장 정보로 갱신되었습니다.
                  </p>
                </div>
              )}

              {/* Excel Format Guide & Template */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>💡 K-에듀파인 표준 양식 안내</span>
                  <button
                    type="button"
                    onClick={() => alert('K-에듀파인 기자재 샘플 엑셀 양식이 다운로드되었습니다.')}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Download className="h-3 w-3" />
                    표준 양식 다운로드
                  </button>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  관리자만 엑셀 파일을 업로드하여 원본 대장을 등록/수정할 수 있으며, 일반 교사 화면에는 엑셀 업로드 및 삭제 기능이 절대 노출되지 않습니다.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: All Departments Status Section */}
          {activeTab === 'departments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  전체 학과 실사 현황
                </h2>
                <Link href="/status" className="text-xs font-bold text-blue-600 hover:underline">
                  상세보기 →
                </Link>
              </div>

              <div className="space-y-3">
                {departments.map((dept) => (
                  <div
                    key={dept.department}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900">{dept.department}</h3>
                          <span className="text-[11px] text-slate-400">담당 교사 실사 진행 중</span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                          dept.progressRate >= 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        진행률 {dept.progressRate}%
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          dept.progressRate >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${dept.progressRate}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <span>등록 <strong>{dept.registeredCount}대</strong></span>
                      <span>확인 <strong>{dept.verifiedCount}대</strong></span>
                      <span className={dept.mismatchCount > 0 ? 'text-amber-700 font-bold' : 'text-slate-500'}>
                        불일치 <strong>{dept.mismatchCount}종</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 1 & Tab 5: Equipment List & Mismatch Review */}
          {(activeTab === 'all' || activeTab === 'mismatch') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    {activeTab === 'mismatch' ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>수량 불일치 기자재 현황</span>
                      </>
                    ) : (
                      <>
                        <Layers className="h-4 w-4 text-indigo-600" />
                        <span>K-에듀파인 기자재 대장 관리</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeTab === 'mismatch'
                      ? '장부 등록 수량과 실제 확인 수량이 다른 기자재 목록입니다.'
                      : 'K-에듀파인에 등록된 전체 실습 기자재 목록입니다.'}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {filteredEquipments.length}건
                </span>
              </div>

              {/* Search & Dept Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="품명, 모델명, 자산번호, 실습실 검색..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['전체', '게임콘텐츠과', '뷰티메이크업과', '호텔조리과'].map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setSelectedDept(dept)}
                      className={`touch-target rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                        selectedDept === dept
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment Item Cards */}
              <div className="space-y-2.5">
                {filteredEquipments.map((item) => {
                  const isMismatch = item.status === 'mismatched';
                  const diff = item.actualQuantity !== undefined ? item.actualQuantity - item.registeredQuantity : 0;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border bg-white p-4 shadow-2xs space-y-2.5 transition-all ${
                        isMismatch ? 'border-amber-300 ring-2 ring-amber-50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                              {item.assetNumber}
                            </span>
                            <span className="text-[11px] font-bold text-blue-700">
                              {item.department}
                            </span>
                          </div>
                          <div className="mt-1 text-sm font-extrabold text-slate-900">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-600">
                            {item.modelName} ({item.specification})
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {item.status === 'matched' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                              <CheckCircle2 className="h-3 w-3" />
                              수량 일치
                            </span>
                          )}
                          {item.status === 'mismatched' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                              <AlertTriangle className="h-3 w-3 text-amber-600" />
                              수량 불일치
                            </span>
                          )}
                          {item.status === 'unverified' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                              <Clock className="h-3 w-3" />
                              실사 대기
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Location comparison */}
                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700">
                        <div>
                          <span className="text-slate-400">실습실: </span>
                          <span className="font-semibold">{item.location}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400">장부: </span>
                          <strong className="text-slate-900">{item.registeredQuantity}대</strong>
                          {item.actualQuantity !== undefined && (
                            <>
                              <span className="text-slate-400"> / 실사: </span>
                              <strong className={isMismatch ? 'text-amber-700' : 'text-emerald-700'}>
                                {item.actualQuantity}대
                              </strong>
                              {diff !== 0 && (
                                <span className="ml-1 font-bold text-amber-700">
                                  ({diff > 0 ? `+${diff}` : diff}대)
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Teacher Notes if any */}
                      {item.notes && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                          <strong>교사 현장 실사 메모:</strong> {item.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick links at bottom */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800">관리자 안내 사항</h4>
            <p className="text-slate-500 leading-relaxed">
              본 관리자 모드는 학교 행정실 및 담당 관리자 전용 화면입니다. 일반 교사는 기자재 대장을 임의로 수정하거나 엑셀을 업로드할 수 없으며, 현장 실사 수량 확인만 수행할 수 있습니다.
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}
