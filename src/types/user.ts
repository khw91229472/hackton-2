export type UserRole = 'teacher' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  schoolId: string;
  schoolName: string;
  department: string;
  role: UserRole;
  createdAt?: string;
}
