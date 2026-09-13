import { FirebaseError } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types/user';

export const DEFAULT_PROFILES: Record<string, UserProfile> = {
  'teacher@example.com': {
    uid: 'mock-teacher-uid',
    name: '홍길동',
    email: 'teacher@example.com',
    schoolId: 'eunpyeong',
    schoolName: '은평문화예술정보학교',
    department: '뷰티메이크업과',
    role: 'teacher',
  },
  'admin@example.com': {
    uid: 'mock-admin-uid',
    name: '김관리',
    email: 'admin@example.com',
    schoolId: 'eunpyeong',
    schoolName: '은평문화예술정보학교',
    department: '행정총괄부',
    role: 'admin',
  },
};

/**
 * Firestore users/{uid} 문서 조회
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Failed to fetch user profile from Firestore:', error);
  }
  return null;
}

/**
 * Firestore users/{uid} 문서 저장/생성
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (!db) return;
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    await setDoc(userDocRef, profile, { merge: true });
  } catch (error) {
    console.warn('Failed to save user profile to Firestore:', error);
  }
}

/**
 * 이메일/비밀번호 로그인
 * Firebase Auth 시도 -> 실패 시(또는 사용자 미존재 시) 적절한 프로필 생성/연동
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; profile: UserProfile }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Firebase Auth 사용 가능한 경우
  if (auth) {
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      } catch (signInErr: unknown) {
        const fbErr = signInErr as FirebaseError;
        // 계정이 없는 경우 자동 가입 시도 (원활한 테스트 및 신규 사용자 등록 지원)
        if (
          fbErr.code === 'auth/user-not-found' ||
          fbErr.code === 'auth/invalid-credential'
        ) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          } catch {
            throw fbErr;
          }
        } else {
          throw fbErr;
        }
      }

      const user = userCredential.user;
      let profile = await getUserProfile(user.uid);

      if (!profile) {
        const isAdmin = normalizedEmail.includes('admin');
        profile = {
          uid: user.uid,
          name: isAdmin ? '관리자' : (normalizedEmail.includes('teacher') ? '홍길동' : normalizedEmail.split('@')[0] + ' 교사'),
          email: user.email || normalizedEmail,
          schoolId: 'eunpyeong',
          schoolName: '은평문화예술정보학교',
          department: isAdmin ? '행정총괄부' : '뷰티메이크업과',
          role: isAdmin ? 'admin' : 'teacher',
        };
        await saveUserProfile(profile);
      }

      return { user, profile };
    } catch (firebaseErr: unknown) {
      // Firebase 연결 불가 또는 인증 에러 시, 데모 기본 계정이면 로컬 모드로 진행 가능
      if (DEFAULT_PROFILES[normalizedEmail]) {
        return {
          user: null,
          profile: DEFAULT_PROFILES[normalizedEmail],
        };
      }
      throw firebaseErr;
    }
  }

  // Firebase 미초기화 시 데모 계정 매칭
  const defaultProfile = DEFAULT_PROFILES[normalizedEmail] || {
    uid: `local-${Date.now()}`,
    name: normalizedEmail.includes('admin') ? '김관리' : '홍길동',
    email: normalizedEmail,
    schoolId: 'eunpyeong',
    schoolName: '은평문화예술정보학교',
    department: normalizedEmail.includes('admin') ? '행정총괄부' : '뷰티메이크업과',
    role: normalizedEmail.includes('admin') ? 'admin' : 'teacher',
  };

  return { user: null, profile: defaultProfile };
}

/**
 * 로그아웃
 */
export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
}
