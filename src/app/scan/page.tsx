'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { StepIndicator } from '@/components/common/StepIndicator';
import { StepPhotoCapture } from '@/components/scan/StepPhotoCapture';
import { StepAiAnalysisCard } from '@/components/scan/StepAiAnalysisCard';
import { StepMatchCandidate } from '@/components/scan/StepMatchCandidate';
import { StepQuantityCheck } from '@/components/scan/StepQuantityCheck';
import { StepSuccessModal } from '@/components/scan/StepSuccessModal';
import { SAMPLE_SCENARIOS, SampleScenario } from '@/data/mockData';
import { AiAnalysisResult, CandidateItem } from '@/types/equipment';
import { useEquipment } from '@/context/EquipmentContext';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ScanPage() {
  const router = useRouter();
  const { updateEquipmentVerification } = useEquipment();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Selected state
  const [selectedScenario, setSelectedScenario] = useState<SampleScenario>(SAMPLE_SCENARIOS[0]);
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);

  // Completed modal state
  const [completedInfo, setCompletedInfo] = useState<{
    candidate: CandidateItem;
    actualQuantity: number;
    notes?: string;
  } | null>(null);

  // Step 1 -> Step 2: Trigger AI Analysis
  const handleAnalyze = (scenario: SampleScenario) => {
    setSelectedScenario(scenario);
    setIsAnalyzing(true);
    setCurrentStep(2);

    // Simulate AI model inference latency
    setTimeout(() => {
      setAiResult(scenario.aiResult);
      setCandidates(scenario.candidates);
      setIsAnalyzing(false);
      setCurrentStep(3);
    }, 900);
  };

  // Step 3 -> Step 4: Candidate selected
  const handleSelectCandidate = (candidate: CandidateItem) => {
    setSelectedCandidate(candidate);
    setCurrentStep(4);
  };

  // Step 4 Complete: Save verification & show modal
  const handleQuantityComplete = (actualQuantity: number, notes?: string) => {
    if (!selectedCandidate) return;

    // Save in context
    updateEquipmentVerification(selectedCandidate.id, actualQuantity, notes);

    // Show success dialog
    setCompletedInfo({
      candidate: selectedCandidate,
      actualQuantity,
      notes,
    });
  };

  // Reset to Step 1 for next scan
  const handleReset = () => {
    setCompletedInfo(null);
    setSelectedCandidate(null);
    setAiResult(null);
    setCandidates([]);
    setCurrentStep(1);
  };

  // Step back navigation
  const handleBack = () => {
    if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 3 || currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      {/* Header with back button */}
      <Header
        showBack
        onBack={handleBack}
      />

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      <main className="mx-auto w-full max-w-xl px-4 py-5 flex-1">
        {/* Step 1: Photo Capture */}
        {currentStep === 1 && (
          <StepPhotoCapture onAnalyze={handleAnalyze} />
        )}

        {/* Step 2: AI Analyzing Spinner */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                기자재를 AI로 분석하고 있습니다...
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                시각적 특징과 라벨 텍스트를 추출하여 K-에듀파인 품목과 대조 중입니다.
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
              <span>선택 항목:</span>
              <span className="font-bold text-slate-800">{selectedScenario.title}</span>
            </div>
          </div>
        )}

        {/* Step 2 & 3: AI Analysis Result & Candidate Matching */}
        {!isAnalyzing && currentStep >= 2 && currentStep === 3 && aiResult && (
          <div className="space-y-4">
            {/* Step navigation prompt */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                사진 다시 찍기
              </button>
            </div>

            {/* AI Analysis Result Card */}
            <StepAiAnalysisCard result={aiResult} />

            {/* Candidate Items Matching List */}
            <StepMatchCandidate
              candidates={candidates}
              onSelectCandidate={handleSelectCandidate}
            />
          </div>
        )}

        {/* Step 4: Actual Quantity Input & Mismatch Alert */}
        {currentStep === 4 && selectedCandidate && (
          <StepQuantityCheck
            candidate={selectedCandidate}
            onComplete={handleQuantityComplete}
          />
        )}

        {/* Success Modal */}
        {completedInfo && (
          <StepSuccessModal
            candidate={completedInfo.candidate}
            actualQuantity={completedInfo.actualQuantity}
            notes={completedInfo.notes}
            onResetToScan={handleReset}
          />
        )}
      </main>
    </div>
  );
}
