// ─── Debt Calculator Types ─────────────────────────────────────────────────────

export interface Debt {
  id: string;
  name: string;
  balance: number;   // Current balance in USD
  apr: number;       // Annual Percentage Rate as a percentage (e.g. 19.99)
  minPayment: number; // Required minimum monthly payment in USD
}

export type PayoffStrategy = "avalanche" | "snowball";

export interface MonthlyScheduleEntry {
  month: number;
  startBalance: number;
  payment: number;
  interest: number;
  principal: number;
  endBalance: number;
}

export interface SingleDebtResult {
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  freedomDate: Date;
  schedule: MonthlyScheduleEntry[];
}

export interface MultiDebtPayoffResult {
  strategy: PayoffStrategy;
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  freedomDate: Date;
  payoffOrder: string[]; // debt IDs in the order they get eliminated
}

// ─── Income Hub Types ──────────────────────────────────────────────────────────

export type TimeCommitment = "minimal" | "part-time" | "substantial" | "full-time";
export type IncomePotential = "low" | "medium" | "high" | "very-high";
export type StartupCost = "none" | "low" | "medium" | "high";

export interface IncomeSideHustle {
  id: string;
  name: string;
  description: string;
  category: string;
  timeCommitment: TimeCommitment;
  incomePotential: IncomePotential;
  minMonthly: number;
  maxMonthly: number;
  startupCost: StartupCost;
  skills: string[];
  icon: string; // lucide-react icon name
}

// ─── Blog Types ────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number; // minutes
  publishedAt: string; // ISO date string
  author: string;
  tags: string[];
  featured: boolean;
}
