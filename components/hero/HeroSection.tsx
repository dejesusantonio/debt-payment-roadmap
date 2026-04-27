import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    value: "$17.5T",
    label: "Total US consumer debt",
    icon: DollarSign,
  },
  {
    value: "24.6%",
    label: "Average credit card APR",
    icon: TrendingUp,
  },
  {
    value: "~18 yrs",
    label: "To pay off $10k at min payments",
    icon: Clock,
  },
  {
    value: "$0",
    label: "Cost to use our tools",
    icon: Shield,
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #059669 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative section-padding">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 mb-6">
            <Shield className="h-3.5 w-3.5" />
            Free tools. No signup required. No financial data stored.
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 text-balance">
            Crush Your Debt.{" "}
            <span className="gradient-text">Build Real Wealth.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 text-balance max-w-2xl mx-auto">
            Use the same Avalanche and Snowball strategies that financial experts
            recommend. Calculate your exact debt-free date, find extra income
            streams, and get a clear payoff roadmap — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="xl">
              <Link href="/#calculator">
                <Calculator className="h-5 w-5" />
                Calculate My Freedom Date
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link href="/#income">
                <TrendingUp className="h-5 w-5" />
                Find Extra Income
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 animate-slide-up">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl bg-white border border-slate-200 p-5 text-center shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 leading-snug">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Social proof strip */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Join thousands of people who used these strategies to pay off debt
          2–4× faster than minimum payments alone.
        </p>
      </div>
    </section>
  );
}
