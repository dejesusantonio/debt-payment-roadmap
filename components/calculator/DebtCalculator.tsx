"use client";

/**
 * DebtCalculator.tsx
 *
 * The interactive centerpiece of the Debt Mastery platform.
 *
 * Modes:
 *   Single Debt — one loan, full amortization schedule, freedom date.
 *   Multiple Debts — Avalanche vs. Snowball side-by-side comparison
 *                   across any number of debts with a rolling "snowflake"
 *                   extra payment.
 *
 * All heavy math lives in lib/debt-calculations.ts. This component
 * owns state, wires inputs to calculations, and renders results.
 */

import { useState, useMemo } from "react";
import {
  Calculator,
  ListChecks,
  Info,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SingleDebtForm, MultiDebtForm } from "./DebtEntryForm";
import { SingleDebtResults, MultiDebtComparison } from "./PayoffResults";
import AmortizationTable from "./AmortizationTable";
import { buildAmortizationSchedule } from "@/lib/debt-calculations";
import type { Debt, PayoffStrategy } from "@/types";

// ─── Default values — realistic starter scenario ──────────────────────────────
const DEFAULTS = {
  balance: 8500,
  apr: 22.99,
  payment: 250,
};

export default function DebtCalculator() {
  // ── Single-debt state ──────────────────────────────────────────────────────
  const [balance, setBalance] = useState(DEFAULTS.balance);
  const [apr, setApr] = useState(DEFAULTS.apr);
  const [payment, setPayment] = useState(DEFAULTS.payment);

  function handleSingleChange(field: "balance" | "apr" | "payment", value: number) {
    if (field === "balance") setBalance(value);
    else if (field === "apr") setApr(value);
    else setPayment(value);
  }

  // Derived: run the amortization whenever inputs change
  const singleResult = useMemo(() => {
    if (balance <= 0 || payment <= 0) return null;
    const r = apr / 100 / 12;
    if (payment <= balance * r) return null; // payment doesn't cover interest
    return buildAmortizationSchedule(balance, apr, payment);
  }, [balance, apr, payment]);

  // ── Multi-debt state ───────────────────────────────────────────────────────
  const [debts, setDebts] = useState<Debt[]>([
    // Pre-populated with a realistic starter set
    {
      id: "1",
      name: "Chase Sapphire (CC)",
      balance: 4800,
      apr: 24.99,
      minPayment: 96,
    },
    {
      id: "2",
      name: "Capital One Quicksilver",
      balance: 2200,
      apr: 19.99,
      minPayment: 44,
    },
    {
      id: "3",
      name: "Car Loan",
      balance: 11500,
      apr: 7.5,
      minPayment: 285,
    },
  ]);
  const [extraPayment, setExtraPayment] = useState(100);
  const [strategy, setStrategy] = useState<PayoffStrategy>("avalanche");

  const hasEnoughMultiDebtData =
    debts.length >= 2 &&
    debts.every((d) => d.balance > 0 && d.minPayment > 0);

  return (
    <div className="space-y-4">
      {/* Section intro */}
      <div className="flex items-start gap-3 rounded-lg bg-emerald-50 border border-emerald-100 p-4">
        <Info className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-800">
          <strong>How this works:</strong> Enter your real debt numbers. The calculator
          uses compound interest math to show your exact payoff date and how much
          interest you&apos;ll pay. No email required — your data never leaves your browser.
        </div>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="single" className="flex-1 gap-2">
            <Calculator className="h-4 w-4" />
            Single Debt
          </TabsTrigger>
          <TabsTrigger value="multiple" className="flex-1 gap-2">
            <ListChecks className="h-4 w-4" />
            Multiple Debts
          </TabsTrigger>
        </TabsList>

        {/* ── Single Debt Tab ──────────────────────────────────────────────── */}
        <TabsContent value="single">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Input panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Debt</CardTitle>
                <CardDescription>
                  Enter your current balance, interest rate, and what you can
                  pay each month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SingleDebtForm
                  balance={balance}
                  apr={apr}
                  payment={payment}
                  onChange={handleSingleChange}
                />
              </CardContent>
            </Card>

            {/* Results panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Payoff Plan</CardTitle>
                <CardDescription>
                  Results update live as you adjust the inputs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {singleResult ? (
                  <SingleDebtResults result={singleResult} balance={balance} />
                ) : (
                  <EmptyState
                    message={
                      balance <= 0
                        ? "Enter your debt balance to see results."
                        : payment <= 0
                        ? "Enter a monthly payment to see your payoff plan."
                        : "Your payment must exceed the monthly interest charge."
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Amortization schedule */}
          {singleResult && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <AmortizationTable schedule={singleResult.schedule} />
              </CardContent>
            </Card>
          )}

          {/* Educational note */}
          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
            <strong className="text-slate-800">The interest treadmill, explained:</strong>{" "}
            With a {apr.toFixed(2)}% APR on{" "}
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(balance)},{" "}
            you pay{" "}
            <strong className="text-red-700">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                (balance * apr) / 100 / 12
              )}
            </strong>{" "}
            in interest on the very first month alone — before a single dollar reduces
            your principal. This is why paying more than the minimum is so powerful.
          </div>
        </TabsContent>

        {/* ── Multiple Debts Tab ───────────────────────────────────────────── */}
        <TabsContent value="multiple">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Input panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Debts</CardTitle>
                <CardDescription>
                  Add all your debts. We&apos;ll compare Avalanche vs. Snowball
                  and tell you how much each strategy saves.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiDebtForm
                  debts={debts}
                  extraPayment={extraPayment}
                  strategy={strategy}
                  onDebtsChange={setDebts}
                  onExtraPaymentChange={setExtraPayment}
                  onStrategyChange={setStrategy}
                />
              </CardContent>
            </Card>

            {/* Results panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Strategy Comparison</CardTitle>
                <CardDescription>
                  Avalanche vs. Snowball — see which saves more and how soon
                  you&apos;re debt-free.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasEnoughMultiDebtData ? (
                  <MultiDebtComparison
                    debts={debts}
                    extraPayment={extraPayment}
                    activeStrategy={strategy}
                  />
                ) : (
                  <EmptyState message="Add at least 2 debts with balances and minimum payments to compare strategies." />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Strategy explainer */}
          {hasEnoughMultiDebtData && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm">
                <div className="font-semibold text-slate-800 mb-1">🏔️ Why Avalanche works</div>
                <p className="text-slate-600 leading-relaxed">
                  By targeting your highest-APR debt first, every extra dollar does maximum
                  damage to interest. Over time, you pay less total interest than any other
                  strategy. Mathematically optimal — but requires patience for big balances.
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm">
                <div className="font-semibold text-slate-800 mb-1">❄️ Why Snowball works</div>
                <p className="text-slate-600 leading-relaxed">
                  Eliminating small debts quickly creates real momentum. Each payoff frees
                  up a minimum payment that rolls into the next debt like a snowball growing
                  downhill. Research shows this approach helps people stay consistent longer.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Empty state placeholder ──────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-slate-100 p-4 mb-4">
        <Calculator className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-sm text-slate-500 max-w-xs">{message}</p>
    </div>
  );
}
