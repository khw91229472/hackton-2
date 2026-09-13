'use client';

import React from 'react';
import { Sparkles, CheckCircle, Tag } from 'lucide-react';
import { AiAnalysisResult } from '@/types/equipment';

interface StepAiAnalysisCardProps {
  result: AiAnalysisResult;
}

export const StepAiAnalysisCard: React.FC<StepAiAnalysisCardProps> = ({ result }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-200 bg-linear-to-b from-blue-50/70 to-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-blue-950">AI 분석 결과</h3>
            <p className="text-[11px] text-blue-700">시각 정보 및 라벨 텍스트 분석 완료</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
          <span>신뢰도: {result.confidence}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
        <div className="rounded-lg bg-white/80 p-2.5 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500">기자재 종류</span>
          <p className="mt-0.5 font-bold text-slate-800 text-sm">{result.category}</p>
        </div>
        <div className="rounded-lg bg-white/80 p-2.5 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500">제조사</span>
          <p className="mt-0.5 font-bold text-slate-800 text-sm">{result.manufacturer}</p>
        </div>
        <div className="rounded-lg bg-white/80 p-2.5 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500">모델명</span>
          <p className="mt-0.5 font-bold text-blue-700 text-sm">{result.modelName}</p>
        </div>
        <div className="rounded-lg bg-white/80 p-2.5 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500">규격</span>
          <p className="mt-0.5 font-bold text-slate-800 text-sm">{result.specification}</p>
        </div>
      </div>

      {/* Detected OCR Tags */}
      {result.detectedTags && result.detectedTags.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-blue-100/60 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">
            <Tag className="h-2.5 w-2.5" />
            인식된 텍스트:
          </span>
          {result.detectedTags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-700 border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
