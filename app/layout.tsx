import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ─── SEO Metadata ──────────────────────────────────────────────────────────────
// Optimized for high-intent personal finance keywords with strong CTR signals.
export const metadata: Metadata = {
  title: {
    default: "Debt Payment Roadmap — Free Debt Payoff Calculator & Income Accelerator",
    template: "%s | Debt Payment Roadmap",
  },
  description:
    "Calculate your debt-free date using the Avalanche or Snowball method. Discover side hustles to accelerate your payoff. Free tools, no signup required.",
  keywords: [
    "debt payoff calculator",
    "debt avalanche calculator",
    "debt snowball calculator",
    "how to get out of debt",
    "debt freedom date",
    "side hustles to pay off debt",
    "compound interest calculator",
    "amortization schedule",
    "credit card payoff calculator",
    "income ideas",
  ],
  authors: [{ name: "Debt Mastery" }],
  creator: "Debt Mastery",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Debt Mastery — Free Debt Payoff Calculator & Income Accelerator",
    description:
      "Calculate your exact debt-free date with Avalanche or Snowball math. Free, private, no signup.",
    siteName: "Debt Mastery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Mastery — Free Debt Payoff Calculator",
    description:
      "Calculate your exact debt-free date. Avalanche vs. Snowball side-by-side. Free tools, no signup.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
