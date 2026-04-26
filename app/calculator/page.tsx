import type { Metadata } from "next";
import DebtCalculator from "@/components/calculator/DebtCalculator";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator — Avalanche & Snowball Methods",
  description:
    "Free debt payoff calculator using the Debt Avalanche and Debt Snowball methods. See your exact payoff date, total interest paid, and month-by-month amortization schedule.",
};

export default function CalculatorPage() {
  return (
    <div className="section-padding">
      <div className="container-tight">
        {/* Page header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Debt Payoff Calculator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The most accurate way to see your debt-free date. Uses the same
            compound interest math your lender uses — so you know exactly
            where every dollar goes.
          </p>
        </div>

        <DebtCalculator />

        {/* Educational content — SEO value */}
        <div className="mt-16 space-y-8 prose prose-slate max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              How the Debt Avalanche Method Works
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The Debt Avalanche strategy directs every extra dollar toward the
              debt with the highest Annual Percentage Rate (APR), while paying
              the minimum on all others. Once the highest-APR debt is eliminated,
              its freed-up payment rolls entirely to the next highest — creating
              an accelerating "avalanche" of debt destruction.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Why it saves money:</strong> Interest compounds daily on
              most credit cards and loans. By eliminating the most expensive debt
              first, you reduce the total interest accruing across your portfolio
              every single month. Studies show the Avalanche method saves the
              average household hundreds to thousands of dollars in total interest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              How the Debt Snowball Method Works
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The Debt Snowball strategy targets the smallest balance first,
              regardless of interest rate. Each eliminated debt frees up its
              minimum payment, which adds to the next target — the "snowball"
              growing as it rolls downhill.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Why it works behaviorally:</strong> Research from Harvard
              Business Review found that people who paid off their smallest
              balances first were more likely to stay motivated and eliminate all
              their debt. The psychological win of a zero balance is real — and
              for many people, staying consistent matters more than mathematical
              optimization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              The Math Behind the Calculator
            </h2>
            <p className="text-slate-600 leading-relaxed">
              This calculator uses standard amortization formulas to compute your
              payoff timeline:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                <strong>Monthly interest:</strong> Balance × (APR ÷ 12 ÷ 100)
              </li>
              <li>
                <strong>Principal reduction:</strong> Monthly payment − Monthly interest
              </li>
              <li>
                <strong>Payoff months:</strong> −ln(1 − r·P/M) ÷ ln(1 + r)
              </li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-3">
              All calculations run client-side in your browser. No financial data
              is ever transmitted or stored.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
