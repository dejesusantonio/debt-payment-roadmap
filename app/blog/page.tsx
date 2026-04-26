import type { Metadata } from "next";
import ArticleCard from "@/components/blog/ArticleCard";
import blogPostsData from "@/data/blog-posts.json";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Personal Finance Blog — Debt Payoff Strategies & Money Tips",
  description:
    "Evidence-based personal finance articles. Learn the Debt Avalanche, how to negotiate lower interest rates, build an emergency fund, and find side hustles that actually pay.",
};

const posts = blogPostsData as BlogPost[];

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="section-padding">
      <div className="container-wide">
        {/* Page header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Personal Finance Blog
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Evidence-based strategies to eliminate debt faster, build savings,
            and create income — without the fluff or false promises.
          </p>
        </div>

        {/* Article grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured && <ArticleCard post={featured} featured />}
          {rest.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        {/* Categories sidebar concept — static for now */}
        <div className="mt-12 rounded-xl bg-emerald-50 border border-emerald-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Browse by Topic
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Debt Strategy", "Savings", "Income", "Budgeting", "Investing"].map(
              (cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-medium text-emerald-700 cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  {cat}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
