'use client';

import React, { useState } from 'react';
import { CandidateItem } from '@/types/equipment';
import { Minus, Plus, CheckCircle2, AlertTriangle, Building2, MapPin, Check, FileText } from 'lucide-react';

interface StepQuantityCheckProps {
  candidate: CandidateItem;
  onComplete: (actualQty: number, notes?: string) => void;
}

export const StepQuantityCheck: React.FC<StepQuantityCheckProps> = ({
  candidate,
  onComplete,
}) => {
  // Initialize with the candidate's registered quantity or 12 as requested in example
  const [actualQuantity, setActualQuantity] = useState<number>(candidate.registeredQuantity);
  const [notes, setNotes] = useState<string>('');

  const registered = candidate.registeredQuantity;
  const difference = actualQuantity - registered;

  const handleDecrease = () => {
    setActualQuantity((prev) => Math.max(0, prev - 1));
  };

  const handleIncrease = () => {
    setActualQuantity((prev) => prev + 1);
  };

  const handleResetToRegistered = () => {
    setActualQuantity(registered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(actualQuantity, notes.trim() || undefined);
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="text-center pt-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          실제 수량을 확인해주세요.
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          현장에 비치된 실물 수량을 카운트하여 입력해주세요.
        </p>
      </div>

      {/* Selected Equipment Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
            선택된 기자재
          </span>
          <span className="text-xs text-slate-400">현장 실사 대조</span>
        </div>

        <div className="mt-3">
          <div className="text-base font-extrabold text-slate-900">
            {candidate.name}
          </div>
          <div className="text-sm font-semibold text-blue-700 mt-0.5">
            {candidate.modelName}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {candidate.specification}
          </div>
        </div>

        {/* Location info */}
        <div className="mt-3 flex items-center gap-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
          {candidate.department && (
            <div className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span>{candidate.department}</span>
            </div>
          )}
          {candidate.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{candidate.location}</span>
            </div>
          )}
        </div>

        {/* K-Edufine registered quantity */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50/70 p-3 border border-blue-100">
          <span className="text-xs font-semibold text-blue-900">
            K-에듀파인 등록수량:
          </span>
          <span className="text-lg font-black text-blue-700">
            {registered}대
          </span>
        </div>
      </div>

      {/* Actual Quantity Stepper */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center space-y-4">
        <label className="block text-xs font-bold text-slate-700">
          현재 실제 확인된 수량
        </label>

        {/* Stepper with big touch buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={actualQuantity <= 0}
            aria-label="수량 감소"
            className="touch-target flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <Minus className="h-6 w-6 stroke-[3]" />
          </button>

          <div className="flex flex-col items-center justify-center min-w-[100px]">
            <input
              type="number"
              value={actualQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setActualQuantity(isNaN(val) ? 0 : Math.max(0, val));
              }}
              className="w-24 text-center text-4xl font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            />
            <span className="text-xs font-semibold text-slate-400">대</span>
          </div>

          <button
            type="button"
            onClick={handleIncrease}
            aria-label="수량 증가"
            className="touch-target flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.97] transition-all"
          >
            <Plus className="h-6 w-6 stroke-[3]" />
          </button>
        </div>

        {/* Quick button to match registered */}
        {actualQuantity !== registered && (
          <div>
            <button
              type="button"
              onClick={handleResetToRegistered}
              className="text-xs text-blue-600 font-semibold underline hover:text-blue-800"
            >
              등록수량({registered}대)과 동일하게 맞추기
            </button>
          </div>
        )}

        {/* Comparison Alert Banner */}
        <div className="pt-2">
          {difference === 0 ? (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-extrabold text-emerald-900">
                  등록수량과 일치합니다.
                </span>
              </div>
              <p className="mt-1 text-xs text-emerald-700">
                장부 수량({registered}대)과 실제 수량이 완벽히 일치합니다.
              </p>
            </div>
          ) : difference < 0 ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-extrabold text-amber-900">
                  등록수량보다 {Math.abs(difference)}대 적습니다.
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-800">
                등록 {registered}대 / 실사 {actualQuantity}대 (부족: {Math.abs(difference)}대)
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-blue-300 bg-blue-50 p-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-extrabold text-blue-900">
                  등록수량보다 {difference}대 많습니다.
                </span>
              </div>
              <p className="mt-1 text-xs text-blue-800">
                등록 {registered}대 / 실사 {actualQuantity}대 (초과: {difference}대)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Optional Note / Remarks */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <FileText className="h-3.5 w-3.5 text-slate-400" />
          <span>현장 점검 비고 (선택 사항)</span>
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="예: 1대 A/S 입고 중, 라벨 훼손으로 재부착 필요 등"
          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
        />
      </div>

      {/* Bottom Sticky Action: 확인 완료 */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="touch-target w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 px-6 text-base font-extrabold text-white shadow-md hover:bg-blue-700 active:scale-[0.99] transition-all"
        >
          <Check className="h-5 w-5 stroke-[2.5]" />
          <span>확인 완료</span>
        </button>
      </div>
    </div>
  );
};
