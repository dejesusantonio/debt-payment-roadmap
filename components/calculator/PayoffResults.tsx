import { CalendarCheck, TrendingDown, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDuration,
  formatFreedomDate,
  runMultiDebtPayoff,
} from "@/lib/debt-calculations";
import type { SingleDebtResult, MultiDebtPayoffResult, Debt, PayoffStrategy } from "@/types";

// ─── Single-Debt Results ───────────────────────────────────────────────────────

interface SingleDebtResultsProps {
  result: SingleDebtResult;
  balance: number;
}

export function SingleDebtResults({ result, balance }: SingleDebtResultsProps) {
  const interestPct = ((result.totalInterest / balance) * 100).toFixed(0);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Freedom date — hero metric */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white text-center">
        <CalendarCheck className="h-8 w-8 mx-auto mb-2 opacity-80" />
        <div className="text-sm font-medium opacity-80 mb-1">Your Debt-Free Date</div>
        <div className="text-3xl font-extrabold">
          {formatFreedomDate(result.freedomDate)}
        </div>
        <div className="text-sm opacity-75 mt-1">
          {formatDuration(result.totalMonths)} from today
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={DollarSign}
          label="Total Paid"
          value={formatCurrency(result.totalPaid)}
          sub={`Principal + interest`}
        />
        <MetricCard
          icon={TrendingDown}
          label="Total Interest"
          value={formatCurrency(result.totalInterest)}
          sub={`${interestPct}% of balance`}
          highlight
        />
        <MetricCard
          icon={Clock}
          label="Payoff Time"
          value={formatDuration(result.totalMonths)}
          sub="at current rate"
        />
      </div>

      {/* Insight */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>💡 Pro tip:</strong> Adding just{" "}
        <strong>{formatCurrency(Math.round(result.totalPaid / result.totalMonths * 0.2 / 10) * 10)}</strong> extra
        per month (20% more) would shave approximately{" "}
        <strong>{Math.round(result.totalMonths * 0.25)} months</strong> off your timeline
        and save hundreds in interest.
      </div>
    </div>
  );
}

// ─── Multi-Debt Comparison ────────────────────────────────────────────────────

interface MultiDebtComparisonProps {
  debts: Debt[];
  extraPayment: number;
  activeStrategy: PayoffStrategy;
}

export function MultiDebtComparison({
  debts,
  extraPayment,
  activeStrategy,
}: MultiDebtComparisonProps) {
  const avalanche = runMultiDebtPayoff(debts, extraPayment, "avalanche");
  const snowball = runMultiDebtPayoff(debts, extraPayment, "snowball");

  const interestSaved = Math.abs(snowball.totalInterest - avalanche.totalInterest);
  const monthsDiff = Math.abs(snowball.totalMonths - avalanche.totalMonths);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Active strategy freedom date */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white text-center">
        <CalendarCheck className="h-8 w-8 mx-auto mb-2 opacity-80" />
        <div className="text-sm font-medium opacity-80 mb-1">
          {activeStrategy === "avalanche" ? "🏔️ Avalanche" : "❄️ Snowball"} Debt-Free Date
        </div>
        <div className="text-3xl font-extrabold">
          {formatFreedomDate(
            activeStrategy === "avalanche" ? avalanche.freedomDate : snowball.freedomDate
          )}
        </div>
        <div className="text-sm opacity-75 mt-1">
          {formatDuration(
            activeStrategy === "avalanche" ? avalanche.totalMonths : snowball.totalMonths
          )}{" "}
          from today
        </div>
      </div>

      {/* Side-by-side strategy comparison */}
      <div className="grid grid-cols-2 gap-3">
        <StrategyCard
          label="🏔️ Avalanche"
          subtitle="High APR first"
          result={avalanche}
          isActive={activeStrategy === "avalanche"}
          badge="Saves most money"
        />
        <StrategyCard
          label="❄️ Snowball"
          subtitle="Low balance first"
          result={snowball}
          isActive={activeStrategy === "snowball"}
          badge="Most motivating"
        />
      </div>

      {/* Comparison insight */}
      {interestSaved > 0 && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          <strong>
            {avalanche.totalInterest <= snowball.totalInterest ? "🏔️ Avalanche" : "❄️ Snowball"}
          </strong>{" "}
          saves you{" "}
          <strong>{formatCurrency(interestSaved)}</strong> in interest and finishes{" "}
          {monthsDiff > 0 ? (
            <>
              <strong>{formatDuration(monthsDiff)}</strong> sooner.
            </>
          ) : (
            <>at the same time.</>
          )}{" "}
          Pick the strategy you'll actually stick with — consistency matters more
          than optimization.
        </div>
      )}
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${
        highlight
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <Icon
        className={`h-4 w-4 mx-auto mb-1 ${
          highlight ? "text-red-500" : "text-emerald-600"
        }`}
      />
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div
        className={`text-sm font-bold leading-tight ${
          highlight ? "text-red-700" : "text-slate-900"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

function StrategyCard({
  label,
  subtitle,
  result,
  isActive,
  badge,
}: {
  label: string;
  subtitle: string;
  result: MultiDebtPayoffResult;
  isActive: boolean;
  badge: string;
}) {
  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${
        isActive ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
      }`}
    >
      <div className="font-semibold text-sm text-slate-900">{label}</div>
      <div className="text-xs text-slate-500 mb-2">{subtitle}</div>
      <Badge variant={isActive ? "success" : "secondary"} className="text-xs mb-3">
        {badge}
      </Badge>
      <div className="space-y-1">
        <div className="text-xs text-slate-500">
          Free in{" "}
          <span className="font-semibold text-slate-800">
            {formatDuration(result.totalMonths)}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Interest:{" "}
          <span className="font-semibold text-red-700">
            {formatCurrency(result.totalInterest)}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Total paid:{" "}
          <span className="font-semibold text-slate-800">
            {formatCurrency(result.totalPaid)}
          </span>
        </div>
      </div>
    </div>
  );
}
