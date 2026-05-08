export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  village: string | null;
  hasCompletedOnboarding: boolean;
  isTreatmentGroup: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'taken' | 'repaid';
  amount: number;
  purpose: string;
  date: string;
  remainingBalance: number;
  visualPercentage: number;
}

export interface PriorityItem {
  id: number;
  name: string;
  defaultAmount: number;
  description: string;
}

export interface PriorityPlan {
  id: string;
  seasonYear: string;
  totalPriorityAmount: number;
  isActive: boolean;
  items: PriorityPlanItem[];
}

export interface PriorityPlanItem {
  id: string;
  itemName: string;
  estimatedAmount: number;
  priorityOrder: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
}

export interface PastSeasonData {
  seasonYear: string;
  advanceTaken: number;
  daysWorked: number;
  arrearsAmount: number;
}

export interface LedgerSummary {
  totalAdvance: number;
  totalRepaid: number;
  remaining: number;
  plannedAmount: number;
  visualPercentage: number;
}

export interface Warning {
  id: string;
  warningType: 'approaching_limit' | 'exceeded_limit';
  currentAmount: number;
  limitAmount: number;
  isRead: boolean;
  createdAt: string;
}