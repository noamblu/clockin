
export enum PresenceStatus {
  Office = 'Office',
  Home = 'Home',
  Vacation = 'Vacation',
  Sick = 'Sick',
  Branch = 'Branch',
  Other = 'Other',
}

export enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  NotSubmitted = 'Not Submitted',
}

export enum UserRole {
  Employee = 'Employee',
  TeamLead = 'Team Lead',
  HR = 'HR',
  Admin = 'Admin',
}

export type IconName = 'office' | 'home' | 'sun' | 'heart' | 'truck' | 'question' | 'briefcase' | 'user' | 'star' | 'coffee';

export interface StatusOption {
    id: string;
    value: string; // This acts as the enum key
    label: string; // Display text (EN)
    labelHe?: string; // Display text (HE)
    icon: IconName;
    color: string; // Tailwind bg color class
    isDefault?: boolean;
}

export interface DailyPlan {
  day: string;
  date: string;
  status: string | null; // Changed from PresenceStatus enum to string to support dynamic statuses
  note?: string;
}

export interface PresencePlan {
  user: User;
  weekOf: string;
  status: ApprovalStatus;
  plan: DailyPlan[];
  submittedAt?: Date;
  violationReason?: string; 
}
 
export interface Team {
  id: string;
  name: string;
  leaderId: string | null;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  roles: UserRole[];
  teamId?: string;
  email?: string;
  phoneNumber?: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  message: string;
  date: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  isRead: boolean;
  relatedLink?: string;
  // Optional for backward compatibility with HR Dashboard alerts
  userId?: string; 
  userName?: string;
  avatarUrl?: string;
}

export interface MandatoryDate {
  id: string;
  date: string;
  status: string; // Dynamic string
  description: string;
  teamIds?: string[]; 
}

export interface WorkPolicy {
    minOfficeDays: number;
    maxHomeDays: number;
}

declare global {
    interface Window {
        google: any;
    }
}
