'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, DepartmentSummary } from '@/types/equipment';
import { INITIAL_EQUIPMENT_LIST, INITIAL_DEPARTMENTS } from '@/data/mockData';

interface EquipmentContextType {
  equipments: Equipment[];
  departments: DepartmentSummary[];
  updateEquipmentVerification: (id: string, actualQuantity: number, notes?: string) => void;
  resetToDefault: () => void;
  totalRegistered: number;
  totalVerified: number;
  totalMismatched: number;
  overallProgress: number;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

const STORAGE_KEY_EQUIPMENTS = 'gijajae_on_equipments_v1';
const STORAGE_KEY_DEPARTMENTS = 'gijajae_on_departments_v1';

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedEquips = localStorage.getItem(STORAGE_KEY_EQUIPMENTS);
        if (savedEquips) return JSON.parse(savedEquips);
      } catch (e) {
        console.warn('Failed to load stored equipment data:', e);
      }
    }
    return INITIAL_EQUIPMENT_LIST;
  });

  const [departments, setDepartments] = useState<DepartmentSummary[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDepts = localStorage.getItem(STORAGE_KEY_DEPARTMENTS);
        if (savedDepts) return JSON.parse(savedDepts);
      } catch (e) {
        console.warn('Failed to load stored department data:', e);
      }
    }
    return INITIAL_DEPARTMENTS;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(equipments));
      localStorage.setItem(STORAGE_KEY_DEPARTMENTS, JSON.stringify(departments));
    } catch (e) {
      console.warn('Failed to save equipment data to localStorage:', e);
    }
  }, [equipments, departments]);

  const updateEquipmentVerification = (id: string, actualQuantity: number, notes?: string) => {
    let targetDept = '';

    setEquipments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          targetDept = item.department;
          const status = actualQuantity === item.registeredQuantity ? 'matched' : 'mismatched';
          return {
            ...item,
            actualQuantity,
            status,
            notes: notes !== undefined ? notes : item.notes,
            lastCheckedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return item;
      })
    );

    // Also update department stats
    if (targetDept) {
      setDepartments((prevDepts) =>
        prevDepts.map((d) => {
          if (d.department === targetDept) {
            // Count verified and mismatches for this dept
            return {
              ...d,
              verifiedCount: Math.min(d.registeredCount, d.verifiedCount + (d.verifiedCount < d.registeredCount ? 1 : 0)),
            };
          }
          return d;
        })
      );
    }
  };

  const resetToDefault = () => {
    setEquipments(INITIAL_EQUIPMENT_LIST);
    setDepartments(INITIAL_DEPARTMENTS);
    try {
      localStorage.removeItem(STORAGE_KEY_EQUIPMENTS);
      localStorage.removeItem(STORAGE_KEY_DEPARTMENTS);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
  };

  const totalRegistered = departments.reduce((acc, curr) => acc + curr.registeredCount, 0);
  const totalVerified = departments.reduce((acc, curr) => acc + curr.verifiedCount, 0);
  const totalMismatched = departments.reduce((acc, curr) => acc + curr.mismatchCount, 0);
  const overallProgress = totalRegistered > 0 ? Math.round((totalVerified / totalRegistered) * 100) : 0;

  return (
    <EquipmentContext.Provider
      value={{
        equipments,
        departments,
        updateEquipmentVerification,
        resetToDefault,
        totalRegistered,
        totalVerified,
        totalMismatched,
        overallProgress,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}
