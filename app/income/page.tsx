import type { Metadata } from "next";
import IncomeHub from "@/components/income/IncomeHub";

export const metadata: Metadata = {
  title: "Side Hustles & Income Ideas to Pay Off Debt Faster",
  description:
    "Discover 12+ proven income-generating ideas sorted by time commitment and earning potential. From freelancing to passive income — find what fits your life.",
};

export default function IncomePage() {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <IncomeHub />

        {/* SEO content */}
        <div className="mt-16 max-w-3xl mx-auto space-y-6 prose prose-slate">
          <h2 className="text-2xl font-bold text-slate-900">
            Why Extra Income Is the Fastest Debt Payoff Tool
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Cutting expenses has a floor — you can only reduce spending so far.
            But income has no ceiling. Even an additional $300–$500 per month
            directed entirely at your highest-APR debt can reduce a 5-year payoff
            timeline to 3 years or less.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The key is treating every dollar of extra income as a "snowflake
            payment" — an irregular extra principal payment that chips away at
            your balance outside the normal payment cycle. Most lenders allow
            these with no penalty, and each one reduces the interest that
            compounds on the remaining balance.
          </p>
        </div>
      </div>
    </div>
  );
}
