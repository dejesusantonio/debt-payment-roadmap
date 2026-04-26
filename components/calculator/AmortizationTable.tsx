import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyExact } from "@/lib/debt-calculations";
import type { MonthlyScheduleEntry } from "@/types";

interface AmortizationTableProps {
  schedule: MonthlyScheduleEntry[];
}

const PAGE_SIZE = 12; // Show 1 year at a time

export default function AmortizationTable({ schedule }: AmortizationTableProps) {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = schedule.slice(0, visibleCount);
  const hasMore = visibleCount < schedule.length;

  return (
    <div className="mt-4 space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
      >
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
        {expanded ? "Hide" : "Show"} full amortization schedule ({schedule.length} months)
      </button>

      {expanded && (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Month</th>
                <th className="px-3 py-2.5 text-right font-semibold text-slate-600">Payment</th>
                <th className="px-3 py-2.5 text-right font-semibold text-red-600">Interest</th>
                <th className="px-3 py-2.5 text-right font-semibold text-emerald-600">Principal</th>
                <th className="px-3 py-2.5 text-right font-semibold text-slate-600">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((row) => {
                const interestPct = (row.interest / row.payment) * 100;
                return (
                  <tr
                    key={row.month}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 py-2 text-slate-500">{row.month}</td>
                    <td className="px-3 py-2 text-right font-mono text-slate-700">
                      {formatCurrencyExact(row.payment)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-red-600">
                      {formatCurrencyExact(row.interest)}
                      <span className="text-slate-300 ml-1">
                        ({interestPct.toFixed(0)}%)
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-emerald-600">
                      {formatCurrencyExact(row.principal)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-slate-900 font-medium">
                      {formatCurrencyExact(row.endBalance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Load more */}
          {hasMore && (
            <div className="border-t border-slate-200 p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Show next 12 months
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
