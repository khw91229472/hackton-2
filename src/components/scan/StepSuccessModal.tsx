'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Camera, BarChart3, Home } from 'lucide-react';
import { CandidateItem } from '@/types/equipment';

interface StepSuccessModalProps {
  candidate: CandidateItem;
  actualQuantity: number;
  notes?: string;
  onResetToScan: () => void;
}

export const StepSuccessModal: React.FC<StepSuccessModalProps> = ({
  candidate,
  actualQuantity,
  notes,
  onResetToScan,
}) => {
  const isMatch = actualQuantity === candidate.registeredQuantity;
  const diff = actualQuantity - candidate.registeredQuantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-xs">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h3 className="mt-4 text-xl font-extrabold text-slate-900">
            조사 확인 완료!
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            실사 결과가 임시 조사 데이터에 성공적으로 반영되었습니다.
          </p>
        </div>

        {/* Inspection Summary Card */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left space-y-2 text-xs">
          <div>
            <span className="text-[11px] text-slate-400">물품명 및 모델</span>
            <div className="font-bold text-slate-800 text-sm">{candidate.name} ({candidate.modelName})</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
            <div>
              <span className="text-[11px] text-slate-400">등록수량</span>
              <div className="font-semibold text-slate-700">{candidate.registeredQuantity}대</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">실제 확인 수량</span>
              <div className={`font-extrabold ${isMatch ? 'text-emerald-700' : 'text-amber-700'}`}>
                {actualQuantity}대 {diff !== 0 && `(${diff > 0 ? `+${diff}` : diff}대)`}
              </div>
            </div>
          </div>

          {notes && (
            <div className="pt-1 border-t border-slate-200/60">
              <span className="text-[11px] text-slate-400">비고</span>
              <div className="text-slate-600 font-medium">{notes}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={onResetToScan}
            className="touch-target w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-extrabold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all"
          >
            <Camera className="h-4 w-4" />
            <span>다음 기자재 촬영하기</span>
          </button>

          <Link
            href="/status"
            className="touch-target w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all"
          >
            <BarChart3 className="h-4 w-4 text-slate-500" />
            <span>학과별 현황 확인하기</span>
          </Link>

          <Link
            href="/"
            className="touch-target w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>홈으로 이동</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
