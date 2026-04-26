import type { Metadata } from "next";
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Debt Payoff Calculator ────────────────────────────────────────── */}
      <section
        id="calculator"
        className="section-padding bg-white border-b border-slate-100"
      >
        <div className="container-tight">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Your Debt Payoff Calculator
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Enter your real numbers. We&apos;ll show your exact freedom date,
              total interest cost, and month-by-month payoff schedule.
            </p>
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
