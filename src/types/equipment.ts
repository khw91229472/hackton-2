export type InspectionStatus = 'unverified' | 'matched' | 'mismatched';

export type MatchConfidence = '매우 높음' | '보통' | '낮음';

export interface Equipment {
  id: string;
  assetNumber: string; // K-에듀파인 물품관리번호 (예: 2021-G-0042)
  name: string; // 물품명 (예: 삼성전자 모니터)
  category: string; // 분류 (예: 모니터, 3D프린터, 제과오븐 등)
  manufacturer: string; // 제조사 (예: Samsung, LG, 신도리코)
  modelName: string; // 모델명 (예: S27R350)
  specification: string; // 규격 (예: 27인치 FHD IPS)
  department: string; // 학과 (예: 게임콘텐츠과, 뷰티메이크업과, 호텔조리과)
  location: string; // 실습실 위치 (예: 게임실습실, 제과제빵실습실)
  registeredQuantity: number; // K-에듀파인 등록수량
  actualQuantity?: number; // 현장 실사 수량
  status: InspectionStatus; // 조사 상태
  lastCheckedAt?: string; // 최근 점검 일시
  notes?: string; // 점검 비고 (예: "1대 AS 입고", "라벨 훼손")
  sampleImageUrl?: string; // 샘플 이미지
}

export interface AiAnalysisResult {
  category: string; // 기자재 종류 (예: 모니터)
  manufacturer: string; // 제조사 (예: Samsung)
  modelName: string; // 모델명 (예: S27R350)
  specification: string; // 규격 (예: 27인치)
  confidence: string; // 분석 신뢰도 (예: 높음)
  detectedTags: string[]; // 검출된 텍스트/라벨 태그
}

export interface CandidateItem {
  id: string;
  name: string;
  modelName: string;
  specification: string;
  department: string;
  location: string;
  registeredQuantity: number;
  matchLevel: MatchConfidence;
  matchScore: number;
  isBestMatch?: boolean;
}

export interface DepartmentSummary {
  department: string;
  registeredCount: number;
  verifiedCount: number;
  mismatchCount: number;
  progressRate: number;
}
