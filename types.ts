
export type UserRole = 'USER' | 'ADMIN';
export type SubscriptionTier = 'BASIC' | 'PREMIUM';
export type LoanStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  mainBalance: number;
  hsaBalance: number;
  totalSteps: number;
  subscriptionTier: SubscriptionTier;
  loanStatus: LoanStatus;
  loanAmount: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'SAVINGS_TRANSFER' | 'LOAN_REQUEST' | 'LOAN_APPROVAL' | 'LOAN_REJECTION' | 'TIER_CHANGE' | 'INITIAL_DEPOSIT';
  amount: number;
  timestamp: number;
  description: string;
}

export interface LoanRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: LoanStatus;
  timestamp: number;
  reason: string;
}
