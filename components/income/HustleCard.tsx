import {
  Code2,
  PenLine,
  Car,
  Landmark,
  GraduationCap,
  ShoppingBag,
  TrendingUp,
  Home,
  Share2,
  Package,
  Video,
  MonitorSmartphone,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { IncomeSideHustle } from "@/types";

// Maps JSON icon name strings to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  PenLine,
  Car,
  Landmark,
  GraduationCap,
  ShoppingBag,
  TrendingUp,
  Home,
  Share2,
  Package,
  Video,
  MonitorSmartphone,
  DollarSign,
};

const TIME_LABELS: Record<IncomeSideHustle["timeCommitment"], string> = {
  minimal: "< 2 hrs/wk",
  "part-time": "5–15 hrs/wk",
  substantial: "15–25 hrs/wk",
  "full-time": "25+ hrs/wk",
};

const INCOME_LABELS: Record<IncomeSideHustle["incomePotential"], string> = {
  low: "Under $500/mo",
  medium: "$500–$3k/mo",
  high: "$1k–$8k/mo",
  "very-high": "$5k+/mo",
};

const INCOME_BADGE: Record<
  IncomeSideHustle["incomePotential"],
  "secondary" | "info" | "success" | "warning"
> = {
  low: "secondary",
  medium: "info",
  high: "success",
  "very-high": "warning",
};

const STARTUP_LABELS: Record<IncomeSideHustle["startupCost"], string> = {
  none: "No startup cost",
  low: "Low cost to start",
  medium: "Moderate investment",
  high: "High investment",
};

interface HustleCardProps {
  hustle: IncomeSideHustle;
}

export default function HustleCard({ hustle }: HustleCardProps) {
  const Icon = ICON_MAP[hustle.icon] ?? DollarSign;

  const incomeRange =
    hustle.minMonthly === 0
      ? `Up to $${hustle.maxMonthly.toLocaleString()}/mo`
      : `$${hustle.minMonthly.toLocaleString()}–$${hustle.maxMonthly.toLocaleString()}/mo`;

  return (
    <article className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200">
      {/* Icon + name row */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
          <Icon className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 leading-tight truncate">
            {hustle.name}
          </h3>
          <span className="text-xs text-slate-500">{hustle.category}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
        {hustle.description}
      </p>

      {/* Income potential */}
      <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 mb-4 text-center">
        <div className="text-xs text-slate-500 mb-0.5">Income Potential</div>
        <div className="text-lg font-bold text-emerald-700">{incomeRange}</div>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge variant={INCOME_BADGE[hustle.incomePotential]}>
          {INCOME_LABELS[hustle.incomePotential]}
        </Badge>
        <Badge variant="outline">{TIME_LABELS[hustle.timeCommitment]}</Badge>
        <Badge variant="secondary">{STARTUP_LABELS[hustle.startupCost]}</Badge>
      </div>

      {/* Skills */}
      <div>
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
          Skills needed
        </div>
        <div className="flex flex-wrap gap-1">
          {hustle.skills.map((skill) => (
            <span
              key={skill}
              className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
