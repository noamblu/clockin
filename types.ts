
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

export interface DailyPlan {
  day: string;
  date: string;
  status: PresenceStatus | null;
}

export interface PresencePlan {
  user: User;
  weekOf: string;
  status: ApprovalStatus;
  plan: DailyPlan[];
  submittedAt?: Date;
}
 
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
}
