'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Camera,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { useEquipment } from '@/context/EquipmentContext';
import { useAuth } from '@/context/AuthContext';
import { createInspection } from '@/services/inspectionService';
import { SAMPLE_SCENARIOS, SampleScenario } from '@/data/mockData';
import { CandidateItem } from '@/types/equipment';

type FlowStep = 'idle' | 'preview' | 'analyzing' | 'candidates' | 'quantity' | 'completed';

export default function HomePage() {
  const [step, setStep] = useState<FlowStep>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<SampleScenario>(SAMPLE_SCENARIOS[0]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
  const [actualQuantity, setActualQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isFailedMatch, setIsFailedMatch] = useState<boolean>(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const { updateEquipmentVerification } = useEquipment();
  const { profile, user } = useAuth();

  // 1. Camera button clicked -> trigger camera capture
  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // 2. Gallery button clicked -> trigger photo album picker
  const handleGalleryClick = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  // 3. File selected (from camera or gallery)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedImage(result);
        setSelectedScenario(SAMPLE_SCENARIOS[0]);
        setIsFailedMatch(false);
        setStep('preview');
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value so same file can be reselected
    e.target.value = '';
  };

  // 3-B. Quick demo sample scenario test (useful for PC test without camera)
  const handleSelectSample = (scenario: SampleScenario) => {
    setSelectedScenario(scenario);
    setCapturedImage(null);
    setIsFailedMatch(false);
    setStep('preview');
  };

  // 4. "이 사진으로 찾기" clicked -> run AI analysis
  const handleStartAnalysis = () => {
    setStep('analyzing');
    // Simulated AI analysis and K-Edufine ledger matching
    setTimeout(() => {
      const top = selectedScenario.candidates[0] || null;
      setSelectedCandidate(top);
      if (top) {
        setActualQuantity(top.registeredQuantity);
      }
      setStep('candidates');
    }, 1200);
  };

  // 5. Candidate confirmed -> move to quantity verification
  const handleConfirmCandidate = (candidate: CandidateItem) => {
    setSelectedCandidate(candidate);
    setActualQuantity(candidate.registeredQuantity);
    setNotes('');
    setStep('quantity');
  };

  // 6. Complete quantity check & save inspection record
  const handleCompleteQuantity = () => {
    if (!selectedCandidate) return;

    // Update equipment verification in local context
    updateEquipmentVerification(selectedCandidate.id, actualQuantity, notes);

    // Save independent inspection record in Firestore / local cache
    const diff = actualQuantity - selectedCandidate.registeredQuantity;
    createInspection({
      equipmentId: selectedCandidate.id,
      assetNumber: selectedCandidate.id,
      equipmentName: selectedCandidate.name,
      modelName: selectedCandidate.modelName,
      department: selectedCandidate.department,
      location: selectedCandidate.location,
      registeredQuantity: selectedCandidate.registeredQuantity,
      actualQuantity,
      difference: diff,
      status: diff === 0 ? 'matched' : 'mismatched',
      notes: notes.trim() || undefined,
      inspectorId: user?.uid || profile?.uid || 'guest-teacher-uid',
      inspectorName: profile?.name || '현장 교사',
      schoolId: profile?.schoolId || 'eunpyeong',
      schoolName: profile?.schoolName || '은평문화예술정보학교',
      createdAt: new Date().toISOString(),
    }).catch((err) => console.warn('Inspection log error:', err));

    setStep('completed');
  };

  // Reset to initial clean state
  const handleResetToIdle = () => {
    setCapturedImage(null);
    setSelectedCandidate(null);
    setIsFailedMatch(false);
    setNotes('');
    setStep('idle');
  };

  // Other candidates (max 2)
  const otherCandidates = selectedScenario.candidates
    .filter((c) => c.id !== selectedCandidate?.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-blue-100">
      {/* Hidden native input elements */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ========================================================================= */}
      {/* 1. 홈 화면 (초기 상태: Google / ChatGPT 스타일 극도로 심플한 화면)             */}
      {/* ========================================================================= */}
      {step === 'idle' && (
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 max-w-md mx-auto w-full">
          {/* Top Brand */}
          <div className="text-center pt-8 sm:pt-14">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              기자재ON
            </h1>
          </div>

          {/* Center Main Action */}
          <div className="my-auto text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                실습실 기자재를 촬영해 주세요.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                등록된 K-에듀파인 기자재 대장에서<br />
                가장 가까운 기자재를 찾아드립니다.
              </p>
            </div>

            {/* Primary CTA Camera Button */}
            <div className="pt-2 flex flex-col items-center">
              <button
                type="button"
                onClick={handleCameraClick}
                className="w-full max-w-xs py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer touch-target"
              >
                <Camera className="h-5 w-5 stroke-[2.4]" />
                <span>기자재 촬영하기</span>
              </button>

              {/* Secondary Gallery Button */}
              <button
                type="button"
                onClick={handleGalleryClick}
                className="mt-3 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 py-2 px-3 transition-colors cursor-pointer"
              >
                사진에서 선택
              </button>
            </div>

            {/* Subtle PC / Demo Fallback scenarios */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium block mb-2">
                시연용 샘플로 바로 체험하기
              </span>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {SAMPLE_SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {s.imageThumbnail} {s.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Right: 관리자 링크만 깔끔하게 표시 */}
          <div className="pt-6 pb-2 flex justify-end">
            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
            >
              관리자
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 사진 미리보기 화면 (사진 선택 후 즉시 분석 X, 미리보기 후 확인)            */}
      {/* ========================================================================= */}
      {step === 'preview' && (
        <div className="flex-1 flex flex-col justify-between p-6 max-w-md mx-auto w-full">
          {/* Top Header */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-black text-slate-900">기자재ON</span>
            <button
              type="button"
              onClick={handleResetToIdle}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              취소
            </button>
          </div>

          {/* Image Preview & Prompt */}
          <div className="my-auto text-center space-y-5 py-4">
            <div className="relative mx-auto w-64 h-64 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
              {capturedImage ? (
                <Image
                  src={capturedImage}
                  alt="촬영한 기자재 미리보기"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="text-6xl mb-2">{selectedScenario.imageThumbnail}</div>
                  <p className="text-xs font-bold text-slate-700">{selectedScenario.title}</p>
                  <p className="text-[11px] text-slate-400">{selectedScenario.subtitle}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                이 사진으로 기자재를 찾을까요?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                K-에듀파인 물품 목록에서 일치하는 품목을 검색합니다.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col items-center space-y-2">
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="w-full max-w-xs py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                이 사진으로 찾기
              </button>

              <button
                type="button"
                onClick={handleCameraClick}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 px-3 transition-colors cursor-pointer"
              >
                다시 촬영
              </button>
            </div>
          </div>

          <div className="py-2 text-center text-[11px] text-slate-400">
            촬영 이미지는 기자재 확인 목적으로만 일시 사용됩니다.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. 분석 중 화면 (심플하고 명확한 상태 안내)                                  */}
      {/* ========================================================================= */}
      {step === 'analyzing' && (
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center max-w-md mx-auto w-full">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            기자재를 찾고 있어요.
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <span>사진 확인</span>
            <span>→</span>
            <span>제조사·모델 분석</span>
            <span>→</span>
            <span className="font-bold text-blue-600">등록 기자재 검색</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. 분석 결과 (후보 기자재 표시: 가장 일치하는 1개 크게 + 다른 후보 최대 2개) */}
      {/* ========================================================================= */}
      {step === 'candidates' && (
        <div className="flex-1 flex flex-col p-5 max-w-md mx-auto w-full space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={handleResetToIdle}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>다시 촬영</span>
            </button>
            <span className="text-xs font-black text-slate-900">기자재 검색 결과</span>
          </div>

          {!isFailedMatch && selectedCandidate ? (
            <div className="space-y-4 my-auto">
              {/* Top Match Hero Card */}
              <div className="rounded-3xl border-2 border-blue-600 bg-white p-5 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    찾은 기자재
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {selectedCandidate.id}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedCandidate.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-600">
                    {selectedCandidate.modelName} · {selectedCandidate.specification}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{selectedCandidate.department}</span>
                  <span className="font-medium text-slate-700">{selectedCandidate.location}</span>
                </div>

                <div className="mt-3 rounded-2xl bg-blue-50/70 p-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">K-에듀파인 등록수량</span>
                  <span className="text-base font-black text-blue-700">
                    {selectedCandidate.registeredQuantity}대
                  </span>
                </div>

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={() => handleConfirmCandidate(selectedCandidate)}
                  className="mt-4 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  이 기자재가 맞아요
                </button>
              </div>

              {/* Other Candidates (Max 2) */}
              {otherCandidates.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 px-1">
                    다른 후보 기자재 ({otherCandidates.length}개)
                  </span>

                  {otherCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => handleConfirmCandidate(cand)}
                      className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800">{cand.name}</h4>
                        <p className="text-[11px] text-slate-500">{cand.modelName} · 등록 {cand.registeredQuantity}대</p>
                      </div>
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
                        선택 <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Requirement 8: Fallback when not found */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsFailedMatch(true)}
                  className="text-xs text-slate-400 hover:text-slate-700 underline"
                >
                  원하는 기자재가 목록에 없나요?
                </button>
              </div>
            </div>
          ) : (
            /* Requirement 8: Search Failure View */
            <div className="my-auto text-center space-y-5 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mx-auto">
                <Search className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  등록된 기자재에서 찾지 못했어요.
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  각도를 바꾸어 다시 촬영하거나, 대장에서 직접 찾아보실 수 있습니다.
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="w-full max-w-xs py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  다시 촬영
                </button>
                <Link
                  href="/data"
                  className="w-full max-w-xs py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs"
                >
                  직접 찾아보기
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. 실제 수량 확인 화면                                                      */}
      {/* ========================================================================= */}
      {step === 'quantity' && selectedCandidate && (
        <div className="flex-1 flex flex-col justify-between p-6 max-w-md mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setStep('candidates')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>후보 다시 선택</span>
            </button>
            <span className="text-xs font-black text-slate-900">수량 확인</span>
          </div>

          <div className="my-auto space-y-5 py-4">
            {/* Target Item summary */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                선택한 기자재
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {selectedCandidate.name}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedCandidate.modelName} · {selectedCandidate.location}
              </p>
            </div>

            {/* Stepper Quantity Box */}
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 text-center space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
                <span>K-에듀파인 장부 수량</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedCandidate.registeredQuantity}대
                </span>
              </div>

              <div className="pt-2">
                <span className="text-xs font-extrabold text-slate-700 block mb-3">
                  실제 실습실 현장 수량
                </span>
                <div className="flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => setActualQuantity((prev) => Math.max(0, prev - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 active:bg-slate-200 font-black text-lg transition-transform active:scale-95 touch-target"
                  >
                    <Minus className="h-5 w-5" />
                  </button>

                  <span className="min-w-16 text-4xl font-black text-slate-900">
                    {actualQuantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setActualQuantity((prev) => prev + 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 active:bg-blue-100 font-black text-lg transition-transform active:scale-95 touch-target"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Discrepancy indicator */}
              {actualQuantity === selectedCandidate.registeredQuantity ? (
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>장부 수량과 정확히 일치합니다</span>
                </div>
              ) : (
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-800 text-xs font-bold flex items-center justify-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>
                    수량 {Math.abs(actualQuantity - selectedCandidate.registeredQuantity)}대{' '}
                    {actualQuantity < selectedCandidate.registeredQuantity ? '부족' : '초과'} (불일치)
                  </span>
                </div>
              )}

              {/* Discrepancy memo input */}
              {actualQuantity !== selectedCandidate.registeredQuantity && (
                <div className="text-left pt-1">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    불일치 사유 메모 (선택)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="예: 1대 AS 센터 수리 입고 중"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Confirm Submit button */}
            <button
              type="button"
              onClick={handleCompleteQuantity}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              실사 확인 완료
            </button>
          </div>

          <div className="py-2 text-center text-[11px] text-slate-400">
            입력된 수량은 실사 로그로 안전하게 기록됩니다.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. 실사 완료 안내 화면                                                      */}
      {/* ========================================================================= */}
      {step === 'completed' && selectedCandidate && (
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center max-w-md mx-auto w-full space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              실사 확인 완료!
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              [{selectedCandidate.name}] 실사 결과(실제 {actualQuantity}대)가 성공적으로 기록되었습니다.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-2.5 pt-4">
            <button
              type="button"
              onClick={handleResetToIdle}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="h-4 w-4" />
              <span>다음 기자재 촬영하기</span>
            </button>

            <Link
              href="/data"
              className="block w-full py-3 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              전체 기자재 대장 확인하기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
