'use client';

import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { SAMPLE_SCENARIOS, SampleScenario } from '@/data/mockData';

interface StepPhotoCaptureProps {
  onAnalyze: (scenario: SampleScenario, customImagePreview?: string) => void;
}

export const StepPhotoCapture: React.FC<StepPhotoCaptureProps> = ({ onAnalyze }) => {
  const [selectedScenario, setSelectedScenario] = useState<SampleScenario>(SAMPLE_SCENARIOS[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setIsPhotoSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (scenario: SampleScenario) => {
    setSelectedScenario(scenario);
    setImagePreview(null);
    setIsPhotoSelected(true);
  };

  const handleStartAnalysis = () => {
    onAnalyze(selectedScenario, imagePreview || undefined);
  };

  return (
    <div className="space-y-5">
      {/* Title section */}
      <div className="text-center pt-2">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          어떤 기자재인지 찾아볼까요?
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          실습실 기자재를 촬영하면 AI가 K-에듀파인 목록에서 찾아드립니다.
        </p>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Central Large Photo Capture Area */}
      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
          isPhotoSelected
            ? 'border-blue-500 bg-blue-50/20'
            : 'border-dashed border-slate-300 bg-white hover:border-slate-400'
        } p-6 text-center`}
      >
        {isPhotoSelected ? (
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative mx-auto max-w-[280px] overflow-hidden rounded-xl border border-slate-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="촬영된 기자재"
                  className="h-56 w-full object-cover"
                />
                <div className="absolute top-2 right-2 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                  사용자 업로드
                </div>
              </div>
            ) : (
              <div className="mx-auto flex h-44 w-full max-w-[280px] flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                <div className="text-5xl">{selectedScenario.imageThumbnail}</div>
                <div className="mt-3 text-sm font-bold text-slate-800">
                  {selectedScenario.title}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {selectedScenario.subtitle}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-blue-700 shadow-xs border border-blue-100">
                  <CheckCircle2 className="h-3 w-3 text-blue-600" />
                  샘플 사진 준비 완료
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPhotoSelected(false);
                  setImagePreview(null);
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 underline"
              >
                <RefreshCw className="h-3 w-3" />
                다시 선택하기
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Camera className="h-8 w-8" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              기자재 사진을 등록해주세요
            </p>
            <p className="mt-1 text-xs text-slate-400">
              카메라로 직접 찍거나 갤러리에서 선택할 수 있습니다
            </p>
          </div>
        )}
      </div>

      {/* Two Large Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="touch-target flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all"
        >
          <Camera className="h-5 w-5" />
          <span>카메라로 촬영</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="touch-target flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 active:scale-[0.99] transition-all"
        >
          <ImageIcon className="h-5 w-5 text-slate-600" />
          <span>사진에서 선택</span>
        </button>
      </div>

      {/* Guide Note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-left">
        <div className="flex items-start gap-2.5">
          <span className="text-base">💡</span>
          <div>
            <p className="text-xs font-semibold text-amber-900">
              촬영 팁
            </p>
            <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
              제품 전체 모습과 <strong>제조사·모델명 라벨</strong>이 함께 보이면 더 정확하게 찾을 수 있어요.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Test Sample Selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            🎯 원클릭 테스트 샘플 선택
          </span>
          <span className="text-[11px] text-slate-400">카메라가 없을 때 바로 테스트</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {SAMPLE_SCENARIOS.map((sc) => {
            const isCurrent = selectedScenario.id === sc.id && isPhotoSelected && !imagePreview;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectSample(sc)}
                className={`touch-target flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xl">{sc.imageThumbnail}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">{sc.title}</div>
                  <div className="truncate text-[10px] text-slate-400">{sc.categoryName}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button: 사진 분석하기 (Prominent when photo is selected) */}
      {isPhotoSelected && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleStartAnalysis}
            className="touch-target w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 px-6 text-base font-extrabold text-white shadow-md hover:bg-blue-700 active:scale-[0.99] transition-all"
          >
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span>사진 분석하기</span>
          </button>
        </div>
      )}
    </div>
  );
};
