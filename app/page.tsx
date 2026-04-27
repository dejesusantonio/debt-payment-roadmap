import type { Metadata } from "next";
import {
  Lock,
  DollarSign,
  UserX,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import HeroSection from "@/components/hero/HeroSection";
import DebtCalculator from "@/components/calculator/DebtCalculator";
import IncomeHub from "@/components/income/IncomeHub";
import BlogGrid from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Free Debt Payoff Calculator — Avalanche & Snowball | Debt Mastery",
  description:
    "Enter your debt balance, interest rate, and monthly payment to see your exact debt-free date. Compare Avalanche vs. Snowball strategies. 100% free, no signup.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Debt Payoff Calculator",
      description:
        "Free debt payoff calculator using the Avalanche and Snowball methods. See your exact debt-free date and total interest cost.",
      url: "https://debt-payment-roadmap-git-main-dejesusantonios-projects.vercel.app",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "Organization",
      name: "Debt Mastery",
      url: "https://debt-payment-roadmap-git-main-dejesusantonios-projects.vercel.app",
      description:
        "Free tools and strategies to help you eliminate debt faster using proven payoff methods.",
    },
  ],
};

// ── Trust pillars (shown directly below hero) ──────────────────────────────────
const trustPillars = [
  {
    icon: Lock,
    title: "Private by Design",
    desc: "Your numbers never leave your browser — nothing is stored or transmitted.",
  },
  {
    icon: DollarSign,
    title: "Always Free",
    desc: "No premium tier, no ads, no upsells. Free forever, no strings attached.",
  },
  {
    icon: UserX,
    title: "No Account Needed",
    desc: "Jump straight in. No email, no password, no credit check required.",
  },
  {
    icon: CheckCircle2,
    title: "Accurate Math",
    desc: "Compound-interest formulas used by CFPs and financial planning software.",
  },
];

// ── How-It-Works steps (shown above the calculator) ────────────────────────────
const steps = [
  {
    num: "1",
    title: "Enter your debts",
    desc: "Balance, interest rate, and monthly payment",
  },
  {
    num: "2",
    title: "Choose a strategy",
    desc: "Avalanche saves the most; Snowball builds momentum",
  },
  {
    num: "3",
    title: "See your freedom date",
    desc: "Exact payoff date and month-by-month schedule",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Trust Strip ───────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustPillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                  <Icon className="h-4 w-4 text-emerald-700" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Debt Payoff Calculator ────────────────────────────────────────── */}
      <section
        id="calculator"
        className="section-padding bg-white border-b border-slate-100"
      >
        <div className="container-tight">
          {/* Section header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Your Debt Payoff Calculator
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Enter your real numbers. We&apos;ll show your exact freedom date,
              total interest cost, and month-by-month payoff schedule.
            </p>
          </div>

          {/* How It Works — 3-step process reduces anxiety before entering data */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 sm:gap-0 mb-10 rounded-xl bg-slate-50 border border-slate-200 p-5 md:p-6">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-2 sm:flex-1">
                <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:text-center sm:gap-2 sm:px-4 flex-1">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-white text-sm font-bold">
                    {step.num}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{step.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{step.desc}</div>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden sm:block h-4 w-4 text-slate-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          <DebtCalculator />
        </div>
      </section>

      {/* ── Income Generator Hub ──────────────────────────────────────────── */}
      <section
        id="income"
        className="section-padding bg-slate-50 border-b border-slate-100"
      >
        <div className="container-wide">
          <IncomeHub />
        </div>
      </section>

      {/* ── Blog ─────────────────────────────────────────────────────────── */}
      <section id="blog" className="section-padding bg-white">
        <div className="container-wide">
          <BlogGrid />
        </div>
      </section>
    </>
  );
}
