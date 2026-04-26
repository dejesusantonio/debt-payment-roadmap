import type { MetadataRoute } from "next";
import blogPostsData from "@/data/blog-posts.json";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://debt-payment-roadmap-git-main-dejesusantonios-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/income`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPostsData.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
