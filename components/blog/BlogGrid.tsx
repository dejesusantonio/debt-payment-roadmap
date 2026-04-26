import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCard from "./ArticleCard";
import blogPostsData from "@/data/blog-posts.json";
import type { BlogPost } from "@/types";

const posts = blogPostsData as BlogPost[];

export default function BlogGrid() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 mb-4">
          <BookOpen className="h-3.5 w-3.5" />
          Financial Strategy Blog
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
          Learn the Strategies That Actually Work
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Evidence-based personal finance — no fluff, no fads. Just the
          strategies proven to accelerate debt payoff and build lasting wealth.
        </p>
      </div>

      {/* Article grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Featured article spans full width */}
        {featured && <ArticleCard post={featured} featured />}

        {/* Standard article cards */}
        {rest.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {/* View all CTA */}
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/blog">
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
