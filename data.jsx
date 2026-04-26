// data.jsx — sample data + finance utilities

const SAMPLE_DEBTS = [
  { id: "d1", name: "Capital Card",   kind: "Credit Card",   balance: 8420,  apr: 24.99, min: 215, color: "oklch(0.6 0.18 28)",  initials: "CC" },
  { id: "d2", name: "Auto Loan",      kind: "Auto",          balance: 14200, apr: 6.49,  min: 388, color: "oklch(0.55 0.13 240)", initials: "AL" },
  { id: "d3", name: "Student Loan",   kind: "Student",       balance: 22800, apr: 5.25,  min: 246, color: "oklch(0.5 0.12 155)",  initials: "SL" },
  { id: "d4", name: "Store Card",     kind: "Credit Card",   balance: 1240,  apr: 27.99, min: 45,  color: "oklch(0.62 0.16 60)",  initials: "ST" },
  { id: "d5", name: "Personal Loan",  kind: "Personal",      balance: 6800,  apr: 11.5,  min: 175, color: "oklch(0.55 0.14 295)", initials: "PL" },
];

const SAMPLE_ACCOUNTS = [
  { id: "a1", inst: "Northbridge Federal", type: "Checking",   balance: 4280,  status: "ok",   icon: "N" },
  { id: "a2", inst: "Northbridge Federal", type: "Savings",    balance: 12640, status: "ok",   icon: "N" },
  { id: "a3", inst: "Capital Card",        type: "Credit Card",balance: -8420, status: "ok",   icon: "C" },
  { id: "a4", inst: "Atlas Auto Finance",  type: "Auto Loan",  balance: -14200,status: "ok",   icon: "A" },
  { id: "a5", inst: "Meridian Student",    type: "Student",    balance: -22800,status: "warn", icon: "M" },
  { id: "a6", inst: "Quoin Retirement",    type: "401(k)",     balance: 86400, status: "ok",   icon: "Q" },
];

const BADGE_DEFS = [
  { id: "first",   name: "First Payment",  desc: "Logged a payment",       achieved: true },
  { id: "snow",    name: "First Snowflake",desc: "Extra payment applied",  achieved: true },
  { id: "kill1",   name: "First Knockout", desc: "Closed a debt",          achieved: false },
  { id: "streak7", name: "7-Day Streak",   desc: "On-time, all week",      achieved: true },
  { id: "arch",    name: "Strategy Architect", desc: "Built a what-if",   achieved: true },
  { id: "sub5k",   name: "Sub-$5k Hero",   desc: "All debts under $5k",    achieved: false },
  { id: "halve",   name: "Halfway There",  desc: "50% of total paid",      achieved: false },
  { id: "zero",    name: "Debt-Free",      desc: "All zeros",              achieved: false },
];

// ── Finance ─────────────────────────────────────────────────────────────────
// Simulate month-by-month payoff. Returns array of {month, debts:{id:bal}, totalPaid, interestPaid}
function simulatePayoff(debts, strategy, extraPerMonth) {
  const ordered = orderDebts(debts, strategy);
  const work = ordered.map(d => ({ ...d }));
  const months = [];
  let m = 0;
  let totalInterest = 0;
  while (work.some(d => d.balance > 0.01) && m < 600) {
    let pool = extraPerMonth;
    // accrue interest
    for (const d of work) {
      if (d.balance <= 0) continue;
      const i = d.balance * (d.apr / 100) / 12;
      d.balance += i;
      totalInterest += i;
    }
    // pay minimums
    for (const d of work) {
      if (d.balance <= 0) continue;
      const pay = Math.min(d.balance, d.min);
      d.balance -= pay;
      // freed minimums roll into pool when paid off
    }
    // freed minimums become extra (snowball/avalanche rolls)
    for (const d of work) {
      if (d.balance <= 0.01) pool += d.min - (d._consumed ? 0 : 0);
    }
    // apply extra to target (first nonzero in ordered list)
    for (const d of work) {
      if (pool <= 0) break;
      if (d.balance <= 0.01) continue;
      const pay = Math.min(d.balance, pool);
      d.balance -= pay;
      pool -= pay;
    }
    m++;
    const snap = { month: m, totalRemaining: work.reduce((s, d) => s + Math.max(0, d.balance), 0), interestPaid: totalInterest };
    snap.debts = Object.fromEntries(work.map(d => [d.id, Math.max(0, d.balance)]));
    months.push(snap);
  }
  return { months, totalMonths: m, totalInterest };
}

function orderDebts(debts, strategy) {
  const arr = [...debts];
  if (strategy === "snowball") arr.sort((a, b) => a.balance - b.balance);
  else if (strategy === "avalanche") arr.sort((a, b) => b.apr - a.apr);
  // custom: keep array order
  return arr;
}

function fmtMoney(n, opts = {}) {
  const { decimals = 0, sign = false } = opts;
  if (n == null || isNaN(n)) return "—";
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const s = (n < 0 ? "−" : sign && n > 0 ? "+" : "") + "$" + formatted;
  return s;
}
function fmtMonths(m) {
  if (m == null) return "—";
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (y === 0) return `${r} mo`;
  if (r === 0) return `${y}y`;
  return `${y}y ${r}m`;
}
function monthLabel(offset, fromDate = new Date(2026, 3, 1)) {
  const d = new Date(fromDate);
  d.setMonth(d.getMonth() + offset);
  return d.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

// ── Asset Flip math ─────────────────────────────────────────────────────────
function calcRetirementLoanCosts(loanAmount, ratePct, termYears, marketRate) {
  const totalInterest = loanAmount * (ratePct / 100) * termYears;
  const fv = loanAmount * Math.pow(1 + marketRate / 100, termYears);
  const leakage = Math.max(0, fv - (loanAmount + totalInterest));
  return { totalInterest, leakage };
}
function calcFlipNetProfit(purchase, sale, rehab, holdMonths) {
  const buying = purchase * 0.03;
  const selling = sale * 0.06;
  const monthlyHold = 600;
  const holdCost = monthlyHold * holdMonths;
  const gross = sale - purchase;
  return gross - rehab - buying - selling - holdCost;
}
function calcTaxDrag(interestPaid, currentTax, retireTax) {
  return interestPaid * (currentTax / 100) + interestPaid * (retireTax / 100);
}
function netStrategyGain({ loanAmount, loanRate, termYears, marketRate, purchase, sale, rehab, holdMonths, currentTax, retireTax }) {
  const ret = calcRetirementLoanCosts(loanAmount, loanRate, termYears, marketRate);
  const flip = calcFlipNetProfit(purchase, sale, rehab, holdMonths);
  const tax = calcTaxDrag(ret.totalInterest, currentTax, retireTax);
  const net = flip - ret.leakage - tax;
  return { net, flip, leakage: ret.leakage, tax, totalInterest: ret.totalInterest };
}

// IRS validation
function validate401kLoan(loanAmount, vested) {
  const cap = Math.min(50000, vested * 0.5);
  if (loanAmount > 50000) return { ok: false, level: "bad", msg: "Exceeds IRS $50,000 limit (Section 72(p))." };
  if (loanAmount > vested * 0.5) return { ok: false, level: "bad", msg: `Exceeds 50% of vested balance ($${cap.toLocaleString()}).` };
  if (loanAmount > cap * 0.85) return { ok: true, level: "warn", msg: `Approaching limit — only $${(cap-loanAmount).toLocaleString()} of headroom.` };
  return { ok: true, level: "ok", msg: "Within IRS Section 72(p) limits." };
}

// 70% rule
function validate70Rule(purchase, arv, rehab) {
  const max = arv * 0.70 - rehab;
  const ratio = (purchase + rehab) / arv;
  if (purchase > max && ratio > 0.85) return { ok: false, level: "bad", msg: `Margin under 15%. Purchase exceeds the 70% rule by ${fmtMoney(purchase - max)}.`, max };
  if (purchase > max) return { ok: true, level: "warn", msg: `Thin margin: ${((1 - ratio) * 100).toFixed(1)}% buffer below ARV. Standard rule is 30%.`, max };
  return { ok: true, level: "ok", msg: `Healthy margin: purchase ${fmtMoney(max - purchase)} under the 70% ceiling.`, max };
}

Object.assign(window, {
  SAMPLE_DEBTS, SAMPLE_ACCOUNTS, BADGE_DEFS,
  simulatePayoff, orderDebts,
  fmtMoney, fmtMonths, monthLabel,
  netStrategyGain, calcRetirementLoanCosts, calcFlipNetProfit, calcTaxDrag,
  validate401kLoan, validate70Rule,
});
