import Link from "next/link";
import { TrendingDown, Twitter, Youtube, Mail, Lock, Shield, DollarSign, UserCheck } from "lucide-react";

const footerLinks = {
  Tools: [
    { label: "Debt Calculator", href: "/#calculator" },
    { label: "Avalanche Planner", href: "/#calculator" },
    { label: "Income Hub", href: "/#income" },
  ],
  Learn: [
    { label: "Blog", href: "/blog" },
    { label: "Debt Avalanche Guide", href: "/blog/debt-avalanche-vs-snowball" },
    { label: "Emergency Fund 101", href: "/blog/build-1000-emergency-fund-90-days" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

const trustSignals = [
  { icon: Lock, label: "No data stored" },
  { icon: Shield, label: "Private by design" },
  { icon: DollarSign, label: "Always free" },
  { icon: UserCheck, label: "No signup required" },
];

export default function Footer() {
  return (
    <footer>
      {/* Navy trust bar — our FDIC-equivalent confidence strip */}
      <div className="bg-navy-900 border-t border-navy-800">
        <div className="container-wide py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {trustSignals.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-200"
              >
                <Icon className="h-3.5 w-3.5 text-emerald-400" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="container-wide py-12 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                  <TrendingDown className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-900">
                  Debt<span className="text-emerald-600">Mastery</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Free tools and real strategies to help you eliminate debt faster
                and build lasting financial freedom.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Newsletter"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  {group}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-emerald-700 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} DebtMastery. For informational purposes
              only — not financial advice.
            </p>
            <p className="text-xs text-slate-500">
              Built with ❤️ to help real people reach financial freedom.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
