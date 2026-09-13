'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile, UserRole } from '@/types/user';
import {
  getUserProfile,
  loginWithEmail,
  logoutUser,
} from '@/services/authService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_PROFILE_KEY = 'gijajae_on_user_profile_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cached profile:', e);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => !!auth);

  // Sync profile to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (profile) {
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save profile cache:', e);
    }
  }, [profile]);

  // Firebase onAuthStateChanged listener
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setProfile(userProfile);
          } else {
            const email = firebaseUser.email || '';
            const isAdm = email.includes('admin');
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: isAdm ? '관리자' : (email.includes('teacher') ? '홍길동' : '김교사'),
              email,
              schoolId: 'eunpyeong',
              schoolName: '은평문화예술정보학교',
              department: isAdm ? '행정총괄부' : '뷰티메이크업과',
              role: isAdm ? 'admin' : 'teacher',
            };
            setProfile(newProfile);
          }
        } catch (e) {
          console.warn('Error fetching profile:', e);
        }
      } else {
        if (!localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY)) {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      setUser(result.user);
      setProfile(result.profile);
      return result.profile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
      }
    } finally {
      setLoading(false);
    }
  };

  const role = profile?.role || null;
  const isAuthenticated = !!profile;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
