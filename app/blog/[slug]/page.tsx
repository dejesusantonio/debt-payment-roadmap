import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import blogPostsData from "@/data/blog-posts.json";
import type { Metadata } from "next";

interface Section {
  h2?: string;
  p?: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  author: string;
  tags: string[];
  featured: boolean;
  sections: Section[];
}

const posts = blogPostsData as BlogPost[];

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

const CATEGORY_COLORS: Record<string, "success" | "info" | "warning" | "secondary"> = {
  "Debt Strategy": "success",
  "Savings": "info",
  "Income": "warning",
  "Budgeting": "secondary",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const publishDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const badgeVariant = CATEGORY_COLORS[post.category] ?? "secondary";
  const relatedPosts = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Article header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="container-tight section-padding">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Badge variant={badgeVariant}>{post.category}</Badge>
            {post.featured && (
              <span className="text-xs font-medium text-slate-400">Featured</span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 text-balance">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 pb-2">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {publishDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="container-tight py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-slate prose-lg max-w-none">
            {post.sections.map((section, i) => {
              if (section.h2) {
                return (
                  <h2
                    key={i}
                    className="text-2xl font-bold text-slate-900 mt-10 mb-4 first:mt-0"
                  >
                    {section.h2}
                  </h2>
                );
              }
              if (section.p) {
                return (
                  <p key={i} className="text-slate-700 leading-relaxed mb-5">
                    {section.p}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-slate-400" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-xl bg-emerald-50 border border-emerald-100 p-6 md:p-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to build your debt payoff plan?
            </h3>
            <p className="text-slate-600 mb-5">
              Use our free calculator to see your exact freedom date using the Avalanche or Snowball method.
            </p>
            <Link
              href="/#calculator"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Calculate My Freedom Date
            </Link>
          </div>
        </div>
      </div>

      {/* Related articles */}
      <div className="border-t border-slate-100 bg-slate-50">
        <div className="container-tight py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">More Articles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group rounded-xl bg-white border border-slate-200 p-5 hover:border-emerald-200 hover:shadow-md transition-all"
              >
                <Badge variant={CATEGORY_COLORS[related.category] ?? "secondary"} className="mb-3">
                  {related.category}
                </Badge>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug text-balance mb-2">
                  {related.title}
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {related.readTime} min read
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
