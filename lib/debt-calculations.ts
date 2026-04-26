/**
 * debt-calculations.ts
 *
 * Core financial math for the Debt Mastery platform.
 * Implements two proven payoff strategies:
 *
 *   Avalanche — targets the highest-APR debt first.
 *               Minimizes total interest paid. Mathematically optimal.
 *
 *   Snowball  — targets the lowest-balance debt first.
 *               Builds momentum through quick wins. Behaviorally powerful.
 *
 * All monetary values are in USD. APR values are percentages (e.g. 19.99).
 */

import type {
  Debt,
  SingleDebtResult,
  MultiDebtPayoffResult,
  MonthlyScheduleEntry,
  PayoffStrategy,
} from "@/types";

// ─── Core Math Primitives ──────────────────────────────────────────────────────

/**
 * Converts an annual APR percentage to a monthly decimal rate.
 * e.g. 19.99% APR → 0.016658 monthly rate
 */
export function getMonthlyRate(annualApr: number): number {
  return annualApr / 100 / 12;
}

/**
 * Returns the number of months to pay off a single debt.
 *
 * Derived from the compound interest formula:
 *   n = -ln(1 - r·P / M) / ln(1 + r)
 *
 * where:
 *   P = current balance
 *   r = monthly interest rate
 *   M = monthly payment
 *
 * Returns Infinity if the monthly payment doesn't cover the interest charge —
 * a signal to the UI to warn the user their payment is too low.
 */
export function calcPayoffMonths(
  balance: number,
  annualApr: number,
  monthlyPayment: number
): number {
  const r = getMonthlyRate(annualApr);

  // Zero-interest loan: straight division
  if (r === 0) return Math.ceil(balance / monthlyPayment);

  const monthlyInterest = balance * r;
  if (monthlyPayment <= monthlyInterest) return Infinity;

  return Math.ceil(
    -Math.log(1 - monthlyInterest / monthlyPayment) / Math.log(1 + r)
  );
}

/**
 * Returns the minimum monthly payment needed to retire a debt in `months` months.
 *
 * Standard amortization formula:
 *   M = P · r · (1 + r)^n / ((1 + r)^n − 1)
 */
export function calcRequiredPayment(
  balance: number,
  annualApr: number,
  months: number
): number {
  const r = getMonthlyRate(annualApr);
  if (r === 0) return balance / months;
  const factor = Math.pow(1 + r, months);
  return (balance * r * factor) / (factor - 1);
}

// ─── Single-Debt Amortization ─────────────────────────────────────────────────

/**
 * Generates a complete month-by-month amortization schedule for a single debt.
 *
 * Each row shows exactly how much of each payment goes toward interest
 * vs. reducing the principal — useful for helping users understand the
 * "interest treadmill" effect of minimum payments.
 */
export function buildAmortizationSchedule(
  balance: number,
  annualApr: number,
  monthlyPayment: number
): SingleDebtResult {
  const r = getMonthlyRate(annualApr);
  const schedule: MonthlyScheduleEntry[] = [];
  let currentBalance = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  // 600-month cap = 50 years; prevents infinite loops for near-zero payments
  while (currentBalance > 0.005 && month < 600) {
    month++;
    const startBalance = currentBalance;
    const interestCharge = currentBalance * r;

    // Final payment may be smaller than the regular payment
    const actualPayment = Math.min(monthlyPayment, currentBalance + interestCharge);
    const principalPayment = actualPayment - interestCharge;

    currentBalance = Math.max(0, currentBalance - principalPayment);
    totalInterest += interestCharge;
    totalPaid += actualPayment;

    schedule.push({
      month,
      startBalance,
      payment: actualPayment,
      interest: interestCharge,
      principal: principalPayment,
      endBalance: currentBalance,
    });
  }

  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + month);

  return { totalMonths: month, totalInterest, totalPaid, freedomDate, schedule };
}

// ─── Multi-Debt Strategy Payoff ───────────────────────────────────────────────

/**
 * Simulates paying off multiple debts using either the Avalanche or Snowball strategy.
 *
 * How it works each month:
 *   1. Calculate the total budget (sum of all minimums + any extra payment).
 *   2. Pay the minimum on every non-priority active debt.
 *   3. Throw all remaining budget at the priority debt.
 *   4. When the priority debt is eliminated, its freed minimum automatically
 *      rolls into the next priority debt ("the snowball effect").
 *
 * This correctly models the real-world strategy: you never reduce your total
 * monthly payment as debts are paid off — you accelerate the paydown.
 */
export function runMultiDebtPayoff(
  debts: Debt[],
  extraMonthlyPayment: number,
  strategy: PayoffStrategy
): MultiDebtPayoffResult {
  if (debts.length === 0) {
    return {
      strategy,
      totalMonths: 0,
      totalInterest: 0,
      totalPaid: 0,
      freedomDate: new Date(),
      payoffOrder: [],
    };
  }

  // Sort once by strategy: APR descending (Avalanche) or balance ascending (Snowball)
  const sorted = [...debts].sort((a, b) =>
    strategy === "avalanche" ? b.apr - a.apr : a.balance - b.balance
  );

  const balances = sorted.map((d) => d.balance);
  const rates = sorted.map((d) => getMonthlyRate(d.apr));
  const payoffOrder: string[] = [];
  let totalInterest = 0;
  let month = 0;

  while (balances.some((b) => b > 0.005) && month < 600) {
    month++;

    // Total monthly cash available
    let remaining =
      sorted.reduce((sum, d) => sum + d.minPayment, 0) + extraMonthlyPayment;

    // The priority debt is the first active one in strategy-sorted order
    const priorityIdx = balances.findIndex((b) => b > 0.005);

    // Step 1: Pay minimums on all non-priority active debts
    for (let i = 0; i < sorted.length; i++) {
      if (balances[i] <= 0.005 || i === priorityIdx) continue;

      const interest = balances[i] * rates[i];
      const payment = Math.min(sorted[i].minPayment, balances[i] + interest);
      const principal = payment - interest;

      balances[i] = Math.max(0, balances[i] - principal);
      totalInterest += interest;
      remaining -= payment;
    }

    // Step 2: Apply all remaining budget to the priority debt
    if (priorityIdx >= 0) {
      const interest = balances[priorityIdx] * rates[priorityIdx];
      const payment = Math.min(remaining, balances[priorityIdx] + interest);
      const principal = Math.max(0, payment - interest);

      balances[priorityIdx] = Math.max(0, balances[priorityIdx] - principal);
      totalInterest += interest;

      if (balances[priorityIdx] <= 0.005) {
        payoffOrder.push(sorted[priorityIdx].id);
      }
    }
  }

  const totalPrincipal = debts.reduce((sum, d) => sum + d.balance, 0);
  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + month);

  return {
    strategy,
    totalMonths: month,
    totalInterest,
    totalPaid: totalPrincipal + totalInterest,
    freedomDate,
    payoffOrder,
  };
}

// ─── Display Formatters ────────────────────────────────────────────────────────

export function formatDuration(months: number): string {
  if (!isFinite(months)) return "Never — increase your payment";
  const years = Math.floor(months / 12);
  const mo = months % 12;
  if (years === 0) return `${mo} month${mo !== 1 ? "s" : ""}`;
  if (mo === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} yr ${mo} mo`;
}

export function formatFreedomDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyExact(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
