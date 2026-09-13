'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  PlayCircle,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Camera,
  Layers
} from 'lucide-react';
import { useEquipment } from '@/context/EquipmentContext';

export default function LabMateViewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { equipments, totalRegistered, totalVerified, totalMismatched } = useEquipment();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDemoClick = () => {
    setIsDemoMode(true);
  };

  const handleReset = () => {
    setFile(null);
    setIsDemoMode(false);
    setSelectedDept('all');
    setSearchQuery('');
  };

  const isShowingData = file !== null || isDemoMode;

  // Filter equipment list
  const filteredEquipments = equipments.filter((item) => {
    const matchDept = selectedDept === 'all' || item.department === selectedDept;
    const matchSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6">
      {/* 1. 심플한 헤더 */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center py-4 border-b border-slate-200/60 mb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-7 h-7 text-indigo-600" />
          <Link href="/" className="font-bold text-xl text-slate-800 tracking-tight hover:text-indigo-600 transition-colors">
            LabMate
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold border border-indigo-100">
            특성화고 실습실 인수인계 뷰어
          </span>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded-md hover:bg-slate-200/60 transition"
          >
            기자재ON 홈 →
          </Link>
        </div>
      </header>

      {/* 2. 중앙 메인: 직관적인 드래그 앤 드롭 영역 또는 정리된 뷰어 화면 */}
      {!isShowingData ? (
        <main className="max-w-2xl mx-auto w-full my-auto text-center py-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-4 border border-indigo-100">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>K-에듀파인 엑셀 파일 즉시 시각화</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight sm:text-4xl">
            복잡한 에듀파인 기자재 대장,<br />
            <span className="text-indigo-600">한 번에 정리</span>해서 보여드립니다
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            에듀파인에서 내려받은 기자재 목록 엑셀 파일(.xlsx)을 올려주세요.
          </p>

          {/* 큼직한 업로드 박스 */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm hover:shadow-md group"
          >
            <div className="w-16 h-16 bg-indigo-50 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 transition-colors">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-base font-semibold text-slate-700">
              {file ? (file as File).name : '엑셀 파일을 이곳에 끌어다 놓으세요'}
            </p>
            <p className="text-xs text-slate-400 mt-1">또는 내 컴퓨터에서 파일 찾기</p>

            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl cursor-pointer transition shadow-xs"
            >
              파일 선택
            </label>
          </div>

          {/* 시연용 퀵 버튼 (발표 시 엑셀 파일 찾느라 버벅거리지 않는 치트키) */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={handleDemoClick}
              className="flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 py-2 px-3 rounded-lg hover:bg-indigo-50/60 transition"
            >
              <PlayCircle className="w-4 h-4 mr-1.5 text-indigo-500" />
              데모용 샘플 데이터로 즉시 확인하기
            </button>
          </div>
        </main>
      ) : (
        /* 파싱/시연 데이터 뷰어 화면 */
        <main className="max-w-4xl mx-auto w-full my-auto py-4 space-y-5">
          {/* Top Status Banner */}
          <div className="rounded-3xl border border-indigo-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      {isDemoMode ? '시연용 샘플' : '엑셀 파싱 완료'}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {file ? file.name : '2026학년도_은평문화예술정보학교_기자재대장.xlsx'}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    K-에듀파인 물품목록 총 {equipments.length}개 품목을 실습실 및 인수인계 규격에 맞게 정리했습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  다시 올리기
                </button>
                <Link
                  href="/scan"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
                >
                  <Camera className="h-3.5 w-3.5" />
                  현장 실사 시작
                </Link>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="rounded-2xl bg-slate-50 p-3">
                <span className="text-[11px] font-bold text-slate-500">총 등록 대수</span>
                <p className="mt-1 text-xl font-black text-slate-900">{totalRegistered}대</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700">실사 완료</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <p className="mt-1 text-xl font-black text-emerald-800">{totalVerified}대</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-700">수량 불일치</span>
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <p className="mt-1 text-xl font-black text-amber-800">{totalMismatched}건</p>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-700">실습 학과</span>
                  <Layers className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <p className="mt-1 text-xl font-black text-indigo-900">3개 학과</p>
              </div>
            </div>
          </div>

          {/* Search & Department Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl bg-slate-200/70 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedDept('all')}
                className={`rounded-xl px-3 py-1.5 transition ${
                  selectedDept === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                전체 ({equipments.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDept('게임콘텐츠과')}
                className={`rounded-xl px-3 py-1.5 transition ${
                  selectedDept === '게임콘텐츠과'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                게임콘텐츠과
              </button>
              <button
                type="button"
                onClick={() => setSelectedDept('뷰티메이크업과')}
                className={`rounded-xl px-3 py-1.5 transition ${
                  selectedDept === '뷰티메이크업과'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                뷰티메이크업과
              </button>
              <button
                type="button"
                onClick={() => setSelectedDept('호텔조리과')}
                className={`rounded-xl px-3 py-1.5 transition ${
                  selectedDept === '호텔조리과'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                호텔조리과
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="기자재명, 모델명, 위치 검색..."
                className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Equipment Table */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">관리번호</th>
                    <th className="py-3 px-4">물품명 / 모델명</th>
                    <th className="py-3 px-4">규격 / 사양</th>
                    <th className="py-3 px-4">학과 및 실습실 위치</th>
                    <th className="py-3 px-4 text-center">등록 / 실사</th>
                    <th className="py-3 px-4 text-center">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredEquipments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-500">
                        {item.assetNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.manufacturer} · {item.modelName}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                        {item.specification}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{item.department}</div>
                        <div className="text-[11px] text-slate-500">{item.location}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-black text-slate-900">{item.registeredQuantity}대</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className={`font-black ${
                          item.status === 'mismatched' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {item.actualQuantity}대
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.status === 'matched' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            일치
                          </span>
                        )}
                        {item.status === 'mismatched' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700 border border-amber-200">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            불일치
                          </span>
                        )}
                        {item.status === 'unverified' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 border border-slate-200">
                            <Clock className="h-2.5 w-2.5" />
                            미실사
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* 3. 푸터 */}
      <footer className="text-center text-xs text-slate-400 py-4 mt-6 border-t border-slate-200/50">
        기술진로부 실습실 및 자격증 스마트 행정 지원 시스템
      </footer>
    </div>
  );
}
