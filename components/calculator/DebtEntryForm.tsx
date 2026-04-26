"use client";

import { useState } from "react";
import { PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/debt-calculations";
import type { Debt, PayoffStrategy } from "@/types";

// ─── Single-Debt Form ─────────────────────────────────────────────────────────

interface SingleDebtFormProps {
  balance: number;
  apr: number;
  payment: number;
  onChange: (field: "balance" | "apr" | "payment", value: number) => void;
}

export function SingleDebtForm({ balance, apr, payment, onChange }: SingleDebtFormProps) {
  const monthlyInterest = (balance * apr) / 100 / 12;
  const paymentTooLow = payment > 0 && payment <= monthlyInterest;

  return (
    <div className="space-y-5">
      {/* Balance */}
      <div className="space-y-1.5">
        <Label htmlFor="balance">Total Debt Balance</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            $
          </span>
          <Input
            id="balance"
            type="number"
            min="0"
            step="100"
            value={balance || ""}
            onChange={(e) => onChange("balance", parseFloat(e.target.value) || 0)}
            className="pl-7"
            placeholder="15,000"
          />
        </div>
      </div>

      {/* APR */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="apr">Annual Interest Rate (APR)</Label>
          <span className="text-sm font-semibold text-emerald-700">
            {apr.toFixed(2)}%
          </span>
        </div>
        <Slider
          id="apr"
          min={0}
          max={36}
          step={0.25}
          value={[apr]}
          onValueChange={([val]) => onChange("apr", val)}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0% (no interest)</span>
          <span>36% (predatory)</span>
        </div>
      </div>

      {/* Monthly payment */}
      <div className="space-y-1.5">
        <Label htmlFor="payment">Monthly Payment</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            $
          </span>
          <Input
            id="payment"
            type="number"
            min="0"
            step="10"
            value={payment || ""}
            onChange={(e) => onChange("payment", parseFloat(e.target.value) || 0)}
            className={`pl-7 ${paymentTooLow ? "border-red-400 focus:ring-red-400" : ""}`}
            placeholder="350"
          />
        </div>
        {paymentTooLow && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              Payment must exceed monthly interest of{" "}
              <strong>{formatCurrency(monthlyInterest)}</strong> to reduce your balance.
            </span>
          </div>
        )}
        {!paymentTooLow && payment > 0 && monthlyInterest > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            {formatCurrency(monthlyInterest)}/mo goes to interest ·{" "}
            {formatCurrency(payment - monthlyInterest)}/mo reduces principal
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Multi-Debt Entry ─────────────────────────────────────────────────────────

interface MultiDebtFormProps {
  debts: Debt[];
  extraPayment: number;
  strategy: PayoffStrategy;
  onDebtsChange: (debts: Debt[]) => void;
  onExtraPaymentChange: (amount: number) => void;
  onStrategyChange: (strategy: PayoffStrategy) => void;
}

const emptyDebt = (): Omit<Debt, "id"> => ({
  name: "",
  balance: 0,
  apr: 0,
  minPayment: 0,
});

export function MultiDebtForm({
  debts,
  extraPayment,
  strategy,
  onDebtsChange,
  onExtraPaymentChange,
  onStrategyChange,
}: MultiDebtFormProps) {
  const [newDebt, setNewDebt] = useState(emptyDebt());

  function addDebt() {
    if (!newDebt.name || newDebt.balance <= 0 || newDebt.minPayment <= 0) return;
    onDebtsChange([
      ...debts,
      { ...newDebt, id: crypto.randomUUID() },
    ]);
    setNewDebt(emptyDebt());
  }

  function removeDebt(id: string) {
    onDebtsChange(debts.filter((d) => d.id !== id));
  }

  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);

  return (
    <div className="space-y-6">
      {/* Strategy selector */}
      <div className="space-y-2">
        <Label>Payoff Strategy</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onStrategyChange("avalanche")}
            className={`rounded-lg border-2 p-3 text-left transition-all ${
              strategy === "avalanche"
                ? "border-emerald-600 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="font-semibold text-sm text-slate-900">
              🏔️ Avalanche
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Highest APR first · saves the most interest
            </div>
          </button>
          <button
            onClick={() => onStrategyChange("snowball")}
            className={`rounded-lg border-2 p-3 text-left transition-all ${
              strategy === "snowball"
                ? "border-emerald-600 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="font-semibold text-sm text-slate-900">
              ❄️ Snowball
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Lowest balance first · best motivational momentum
            </div>
          </button>
        </div>
      </div>

      {/* Existing debts list */}
      {debts.length > 0 && (
        <div className="space-y-2">
          <Label>Your Debts</Label>
          <div className="space-y-2">
            {debts.map((debt) => (
              <div
                key={debt.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm text-slate-900 truncate">
                    {debt.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-slate-500">
                      {formatCurrency(debt.balance)}
                    </span>
                    <Badge variant="warning" className="text-[10px]">
                      {debt.apr}% APR
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatCurrency(debt.minPayment)}/mo min
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="ml-2 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label={`Remove ${debt.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Total: <strong className="text-slate-700">{formatCurrency(totalBalance)}</strong></span>
            <span>Min payments: <strong className="text-slate-700">{formatCurrency(totalMinPayments)}/mo</strong></span>
          </div>
        </div>
      )}

      {/* Add new debt form */}
      <div className="rounded-lg border border-dashed border-slate-300 p-4 space-y-3">
        <Label className="text-slate-600">Add a Debt</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <Input
              placeholder="e.g. Chase Visa, Student Loan"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <Input
              type="number"
              placeholder="Balance"
              min="0"
              value={newDebt.balance || ""}
              onChange={(e) =>
                setNewDebt({ ...newDebt, balance: parseFloat(e.target.value) || 0 })
              }
              className="pl-6 text-sm"
            />
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="APR %"
              min="0"
              max="100"
              step="0.1"
              value={newDebt.apr || ""}
              onChange={(e) =>
                setNewDebt({ ...newDebt, apr: parseFloat(e.target.value) || 0 })
              }
              className="text-sm"
            />
          </div>
          <div className="col-span-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <Input
              type="number"
              placeholder="Minimum monthly payment"
              min="0"
              value={newDebt.minPayment || ""}
              onChange={(e) =>
                setNewDebt({ ...newDebt, minPayment: parseFloat(e.target.value) || 0 })
              }
              className="pl-6 text-sm"
            />
          </div>
        </div>
        <Button
          onClick={addDebt}
          variant="outline"
          size="sm"
          className="w-full"
          disabled={!newDebt.name || newDebt.balance <= 0 || newDebt.minPayment <= 0}
        >
          <PlusCircle className="h-4 w-4" />
          Add Debt
        </Button>
      </div>

      {/* Extra payment slider */}
      {debts.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Extra Monthly Payment ("Snowflake")</Label>
            <span className="text-sm font-semibold text-emerald-700">
              +{formatCurrency(extraPayment)}/mo
            </span>
          </div>
          <Slider
            min={0}
            max={2000}
            step={25}
            value={[extraPayment]}
            onValueChange={([val]) => onExtraPaymentChange(val)}
          />
          <p className="text-xs text-slate-400">
            Any extra you can throw at debt — even $50/mo can shave years off your timeline.
          </p>
        </div>
      )}
    </div>
  );
}
