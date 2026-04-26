"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import HustleCard from "./HustleCard";
import FilterBar from "./FilterBar";
import incomeIdeas from "@/data/income-ideas.json";
import type { IncomeSideHustle, TimeCommitment, IncomePotential } from "@/types";

const hustles = incomeIdeas as IncomeSideHustle[];

export default function IncomeHub() {
  const [timeFilter, setTimeFilter] = useState<TimeCommitment | "all">("all");
  const [incomeFilter, setIncomeFilter] = useState<IncomePotential | "all">("all");

  const filtered = useMemo(() => {
    return hustles.filter((h) => {
      const timeMatch = timeFilter === "all" || h.timeCommitment === timeFilter;
      const incomeMatch = incomeFilter === "all" || h.incomePotential === incomeFilter;
      return timeMatch && incomeMatch;
    });
  }, [timeFilter, incomeFilter]);

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 mb-4">
          <TrendingUp className="h-3.5 w-3.5" />
          Income Generator Hub
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
          Accelerate Your Payoff With Extra Income
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Every dollar of extra income you earn goes straight to debt. Earning
          just <strong className="text-emerald-700">$500/month extra</strong> can
          shave 2–4 years off a $20,000 debt payoff timeline.
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        timeFilter={timeFilter}
        incomeFilter={incomeFilter}
        onTimeChange={setTimeFilter}
        onIncomeChange={setIncomeFilter}
        resultCount={filtered.length}
      />

      {/* Card grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((hustle) => (
            <HustleCard key={hustle.id} hustle={hustle} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-slate-500">
            No ideas match those filters. Try broadening your search.
          </p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 p-6 md:p-8 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          The Debt-Crusher Formula
        </h3>
        <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
          Reduce expenses → Free up cash. Add income → Create surplus.
          Apply 100% of surplus to your highest-APR debt. When that debt dies,
          roll the full payment to the next one. Repeat until free.
        </p>
      </div>
    </div>
  );
}
