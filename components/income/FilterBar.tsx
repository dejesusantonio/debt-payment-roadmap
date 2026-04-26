"use client";

import { cn } from "@/lib/utils";
import type { TimeCommitment, IncomePotential } from "@/types";

// ─── Filter option definitions ─────────────────────────────────────────────────

const TIME_OPTIONS: { value: TimeCommitment | "all"; label: string }[] = [
  { value: "all", label: "Any time" },
  { value: "minimal", label: "< 2 hrs/wk" },
  { value: "part-time", label: "5–15 hrs/wk" },
  { value: "substantial", label: "15–25 hrs/wk" },
  { value: "full-time", label: "25+ hrs/wk" },
];

const INCOME_OPTIONS: { value: IncomePotential | "all"; label: string }[] = [
  { value: "all", label: "Any income" },
  { value: "low", label: "< $500/mo" },
  { value: "medium", label: "$500–$3k/mo" },
  { value: "high", label: "$1k–$8k/mo" },
  { value: "very-high", label: "$5k+/mo" },
];

interface FilterBarProps {
  timeFilter: TimeCommitment | "all";
  incomeFilter: IncomePotential | "all";
  onTimeChange: (value: TimeCommitment | "all") => void;
  onIncomeChange: (value: IncomePotential | "all") => void;
  resultCount: number;
}

export default function FilterBar({
  timeFilter,
  incomeFilter,
  onTimeChange,
  onIncomeChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Time commitment filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Time Commitment
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TIME_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={timeFilter === opt.value}
                onClick={() => onTimeChange(opt.value as TimeCommitment | "all")}
              />
            ))}
          </div>
        </div>

        {/* Income potential filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Income Potential
          </label>
          <div className="flex flex-wrap gap-1.5">
            {INCOME_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={incomeFilter === opt.value}
                onClick={() => onIncomeChange(opt.value as IncomePotential | "all")}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-slate-500">
        Showing <strong className="text-slate-700">{resultCount}</strong> income idea
        {resultCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
      )}
    >
      {label}
    </button>
  );
}
