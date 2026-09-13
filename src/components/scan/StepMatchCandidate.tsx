'use client';

import React from 'react';
import { CandidateItem } from '@/types/equipment';
import { Check, ArrowRight, Building2, MapPin, Layers } from 'lucide-react';

interface StepMatchCandidateProps {
  candidates: CandidateItem[];
  onSelectCandidate: (candidate: CandidateItem) => void;
}

export const StepMatchCandidate: React.FC<StepMatchCandidateProps> = ({
  candidates,
  onSelectCandidate,
}) => {
  return (
    <div className="space-y-4 pt-1">
      {/* Candidates Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            등록된 기자재 중 비슷한 항목을 찾았습니다.
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            K-에듀파인 물품 목록에서 가장 일치하는 항목을 선택해주세요.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
          후보 {candidates.length}건
        </span>
      </div>

      {/* Candidate Cards List */}
      <div className="space-y-3">
        {candidates.map((candidate, idx) => {
          const isTopCandidate = idx === 0 || candidate.isBestMatch;

          return (
            <div
              key={candidate.id}
              className={`rounded-2xl transition-all ${
                isTopCandidate
                  ? 'border-2 border-blue-600 bg-white shadow-md ring-4 ring-blue-50'
                  : 'border border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              } p-4`}
            >
              {/* Top info badge & match rate */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                      isTopCandidate
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    후보 {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {candidate.name}
                  </span>
                </div>

                {/* Match level badge */}
                <div
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    candidate.matchLevel === '매우 높음'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : candidate.matchLevel === '보통'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span>일치 가능성: {candidate.matchLevel}</span>
                </div>
              </div>

              {/* Model & Spec */}
              <div className="text-sm font-semibold text-slate-900 mb-2.5">
                {candidate.modelName}
              </div>

              {/* Metadata Details (Department, Location, Registered Quantity) */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 mb-3 border border-slate-100">
                {candidate.department && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-medium">{candidate.department}</span>
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{candidate.location}</span>
                  </div>
                )}
                <div className="col-span-2 flex items-center justify-between border-t border-slate-200/60 pt-1.5 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-slate-500">K-에듀파인 등록수량:</span>
                  </div>
                  <span className="font-extrabold text-blue-700 text-sm">
                    {candidate.registeredQuantity}대
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isTopCandidate ? (
                <button
                  type="button"
                  onClick={() => onSelectCandidate(candidate)}
                  className="touch-target w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 px-4 text-sm font-extrabold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>이 기자재가 맞아요</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectCandidate(candidate)}
                  className="touch-target w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all"
                >
                  <span>이 기자재 선택</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
