import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types";

const CATEGORY_COLORS: Record<string, "success" | "info" | "warning" | "secondary"> = {
  "Debt Strategy": "success",
  "Savings": "info",
  "Income": "warning",
  "Budgeting": "secondary",
};

interface ArticleCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const badgeVariant = CATEGORY_COLORS[post.category] ?? "secondary";
  const publishDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (featured) {
    return (
      <article className="group col-span-full rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={badgeVariant}>{post.category}</Badge>
            <span className="text-xs text-slate-400 font-medium">Featured</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors text-balance">
            {post.title}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4 max-w-2xl">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} min read
              </span>
              <span>{post.author}</span>
              <span>{publishDate}</span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Read Article
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200">
      <Badge variant={badgeVariant} className="self-start mb-3">
        {post.category}
      </Badge>
      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors text-balance leading-snug flex-1">
        {post.title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          <span>{post.readTime} min</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
        >
          Read <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
