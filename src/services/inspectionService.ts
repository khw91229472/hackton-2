import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { InspectionRecord } from '@/types/inspection';

const LOCAL_STORAGE_INSPECTIONS_KEY = 'gijajae_on_inspections_v1';

/**
 * 교사의 현장 실사 결과를 inspections 컬렉션에 독립 생성
 * (equipment 원본 대장은 건드리지 않고 실사 로그를 기록)
 */
export async function createInspection(
  record: Omit<InspectionRecord, 'id'>
): Promise<InspectionRecord> {
  const newId = `insp-${Date.now()}`;
  const fullRecord: InspectionRecord = {
    ...record,
    id: newId,
  };

  // 1. Firestore에 저장 (Firebase 활성화 시)
  if (db) {
    try {
      const colRef = collection(db, 'inspections');
      const docRef = await addDoc(colRef, fullRecord);
      fullRecord.id = docRef.id;
    } catch (e) {
      console.warn('Firestore inspection create failed, saving to local cache:', e);
    }
  }

  // 2. 로컬 스토리지에 캐시 동기화
  if (typeof window !== 'undefined') {
    try {
      const existing = getLocalInspections();
      localStorage.setItem(
        LOCAL_STORAGE_INSPECTIONS_KEY,
        JSON.stringify([fullRecord, ...existing])
      );
    } catch (e) {
      console.warn('Failed to cache inspection locally:', e);
    }
  }

  return fullRecord;
}

/**
 * 실사 결과 목록 조회
 * - 일반 교사: 본인이 작성한 실사 내역만 조회 (inspectorId 필터)
 * - 관리자: 소속 학교(schoolId)의 모든 실사 내역 조회
 */
export async function getInspections(params: {
  schoolId: string;
  userId: string;
  isAdmin: boolean;
}): Promise<InspectionRecord[]> {
  if (db) {
    try {
      const colRef = collection(db, 'inspections');
      let q;

      if (params.isAdmin) {
        // 관리자는 학교 전체 실사 조회
        q = query(
          colRef,
          where('schoolId', '==', params.schoolId),
          orderBy('createdAt', 'desc')
        );
      } else {
        // 교사는 본인 실사 결과만 조회
        q = query(
          colRef,
          where('schoolId', '==', params.schoolId),
          where('inspectorId', '==', params.userId),
          orderBy('createdAt', 'desc')
        );
      }

      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<InspectionRecord, 'id'>),
        }));
      }
    } catch (e) {
      console.warn('Firestore fetch inspections failed, falling back to local:', e);
    }
  }

  // 로컬 캐시 조회
  const localList = getLocalInspections();
  if (params.isAdmin) {
    return localList.filter((item) => item.schoolId === params.schoolId);
  }
  return localList.filter(
    (item) => item.schoolId === params.schoolId && item.inspectorId === params.userId
  );
}

export function getLocalInspections(): InspectionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_INSPECTIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to parse local inspections:', e);
  }
  return [];
}
