// simulator.jsx — Strategy simulator with chip selector

const STRATEGIES = {
  flip: {
    id: "flip",
    name: "Asset Flip",
    short: "Flip a property using a 401(k) loan",
    cash: "$8k–$28k / flip",
    horizon: "4–6 mo",
    risk: "high",
    eyebrow: "Capital strategy",
  },
  rideshare: {
    id: "rideshare",
    name: "Rideshare",
    short: "Drive Uber or Lyft on nights & weekends",
    cash: "$200–$700 / wk",
    horizon: "Weekly",
    risk: "low",
    eyebrow: "Side hustle",
  },
  delivery: {
    id: "delivery",
    name: "Food Delivery",
    short: "DoorDash, Uber Eats, Instacart batches",
    cash: "$150–$550 / wk",
    horizon: "Weekly",
    risk: "low",
    eyebrow: "Side hustle",
  },
  freelance: {
    id: "freelance",
    name: "Freelance Gigs",
    short: "Upwork, Fiverr, Contra — sell a skill by the hour",
    cash: "$300–$1,400 / wk",
    horizon: "1–4 wk",
    risk: "low",
    eyebrow: "Side hustle",
  },
  sell: {
    id: "sell",
    name: "Sell Stuff",
    short: "Marketplace, eBay, Mercari — declutter for cash",
    cash: "$80–$600 / mo",
    horizon: "1–8 wk",
    risk: "minimal",
    eyebrow: "One-off cash",
  },
};

function SimulatorTab({ flipState, setFlip, simStrategy, setSimStrategy, hustleState, setHustle }) {
  const sid = simStrategy || "flip";
  return (
    <>
      <StrategyChips active={sid} onPick={setSimStrategy}/>
      {sid === "flip" ? (
        <FlipSimulator flipState={flipState} setFlip={setFlip}/>
      ) : (
        <HustleSimulator key={sid} sid={sid} state={hustleState[sid]} setState={(k,v) => setHustle(sid, k, v)}/>
      )}
    </>
  );
}

function StrategyChips({ active, onPick }) {
  const ids = ["flip", "rideshare", "delivery", "freelance", "sell"];
  return (
    <section className="strategy-chips card flat" style={{padding: 14, background:"var(--bg-2)", border:"1px solid var(--line)"}}>
      <div className="between" style={{marginBottom: 12}}>
        <div>
          <span className="h-eyebrow">Pick a strategy</span>
          <div className="muted" style={{fontSize: 12.5, marginTop: 4}}>Each strategy plugs into the same engine — surplus routes to your highest-cost debt.</div>
        </div>
        <span className="muted" style={{fontSize: 11.5, whiteSpace:"nowrap"}}>5 strategies · more coming</span>
      </div>
      <div className="chip-rail">
        {ids.map(id => {
          const s = STRATEGIES[id];
          const isActive = id === active;
          return (
            <button key={id} className={`strat-chip ${isActive ? "active" : ""}`} onClick={() => onPick(id)}>
              <div className="strat-chip-head">
                <span className="strat-chip-icon">{StratIcon(id)}</span>
                <span className={`strat-chip-risk risk-${s.risk}`}>{s.risk}</span>
              </div>
              <div className="strat-chip-name">{s.name}</div>
              <div className="strat-chip-meta">
                <span className="tabular">{s.cash}</span>
                <span className="muted">·</span>
                <span className="muted">{s.horizon}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function StratIcon(id) {
  const sz = 16;
  if (id === "flip")      return <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><path d="M2 13L8 3L14 13H2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="9.5" r="1.2" fill="currentColor"/></svg>;
  if (id === "rideshare") return <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><rect x="2" y="6" width="12" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M3.5 6L4.5 3.5H11.5L12.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="11" cy="12" r="1" fill="currentColor"/></svg>;
  if (id === "delivery")  return <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><rect x="3" y="4" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M3 7H13" stroke="currentColor" strokeWidth="1.4"/><path d="M6 4V2.5H10V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
  if (id === "freelance") return <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.5" width="11" height="9" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7H11M5 9.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
  if (id === "sell")      return <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><path d="M3 5H13L12 13H4L3 5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5.5 5C5.5 3.5 6.5 2.5 8 2.5C9.5 2.5 10.5 3.5 10.5 5" stroke="currentColor" strokeWidth="1.4"/></svg>;
  return null;
}

// ════════════════════════════════════════════════════════════════════════
// ASSET FLIP SIMULATOR (deep, capital strategy)
// ════════════════════════════════════════════════════════════════════════
function FlipSimulator({ flipState, setFlip }) {
  const f = flipState;
  const validation401k = validate401kLoan(f.loanAmount, f.vestedBalance);
  const rule70 = validate70Rule(f.purchase, f.arv, f.rehab);
  const result = netStrategyGain({
    loanAmount: f.loanAmount, loanRate: f.loanRate, termYears: f.termYears,
    marketRate: f.marketRate, purchase: f.purchase, sale: f.arv, rehab: f.rehab,
    holdMonths: f.holdMonths, currentTax: f.currentTax, retireTax: f.retireTax
  });
  const isViable = result.net > 0;

  return (
    <>
      <section className="hero" style={{gridTemplateColumns: "1fr 1fr"}}>
        <div className="hero-l" style={{background: isViable ? "var(--ink)" : "oklch(0.28 0.08 25)"}}>
          <span className="eye">Net Strategy Gain</span>
          <div className="num" style={{color: isViable ? "oklch(0.85 0.12 155)" : "oklch(0.85 0.15 25)"}}>
            {result.net >= 0 ? "+" : "−"}{fmtMoney(Math.abs(result.net))}
          </div>
          <span className="delta" style={{
            background: isViable ? "oklch(0.85 0.12 155 / 0.12)" : "oklch(0.85 0.15 25 / 0.15)",
            color: isViable ? "oklch(0.85 0.12 155)" : "oklch(0.85 0.15 25)",
          }}>
            {isViable ? <><I.Check size={11}/> Strategy is mathematically sound</> : <><I.Warning size={11}/> Standard payoff beats this strategy</>}
          </span>
          <div style={{fontSize: 12.5, color: "oklch(1 0 0 / 0.6)", marginTop: 4, lineHeight: 1.5}}>
            {isViable
              ? "After accounting for opportunity cost, hidden fees, and double-tax drag, the flip still nets a real surplus."
              : "Frictional costs, lost compound growth, and tax drag eat the projected profit."}
          </div>
        </div>
        <div className="hero-r" style={{padding: "var(--pad)", display:"grid", gridTemplateColumns:"1fr 1fr", gap: 16, alignContent:"center"}}>
          <div className="kpi">
            <span className="lbl">Flip net profit</span>
            <span className="val">{fmtMoney(result.flip)}</span>
            <span className="sub">after buy/hold/sell fees</span>
          </div>
          <div className="kpi">
            <span className="lbl">401(k) leakage</span>
            <span className="val" style={{color:"var(--bad)"}}>−{fmtMoney(result.leakage)}</span>
            <span className="sub">growth foregone</span>
          </div>
          <div className="kpi">
            <span className="lbl">Tax drag</span>
            <span className="val" style={{color:"var(--bad)"}}>−{fmtMoney(result.tax)}</span>
            <span className="sub">double-taxation</span>
          </div>
          <div className="kpi">
            <span className="lbl">Time horizon</span>
            <span className="val">{f.holdMonths}<small style={{fontSize:14, color:"var(--ink-3)"}}>mo</small></span>
            <span className="sub">acquisition → sale</span>
          </div>
        </div>
      </section>

      <section className="grid-2">
        <RiskCard validation={validation401k} title="IRS Compliance · Section 72(p)"
                  detail={`Loan ${fmtMoney(f.loanAmount)} against ${fmtMoney(f.vestedBalance)} vested. Cap is the lesser of $50,000 or 50% of vested balance.`}/>
        <RiskCard validation={rule70} title="The 70% Rule"
                  detail={`Max allowable offer = ARV × 70% − Rehab = ${fmtMoney(rule70.max)}. You're at ${fmtMoney(f.purchase)}.`}/>
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="between" style={{marginBottom: 14, gap: 10, flexWrap: "wrap"}}>
            <h2 className="h-section" style={{whiteSpace: "nowrap"}}>Retirement loan</h2>
            <span className="toggle-pill" style={{background:"var(--warn-soft)", color:"oklch(0.4 0.12 75)", whiteSpace: "nowrap"}}>
              <I.Warning size={11}/> Termination clock
            </span>
          </div>
          <div className="col" style={{gap: 16}}>
            <FlipSlider label="Loan amount" value={f.loanAmount} min={5000} max={75000} step={500}
                       fmt={fmtMoney} onChange={v => setFlip("loanAmount", v)} ceiling={50000}/>
            <FlipSlider label="Loan rate (Prime + 1.5%)" value={f.loanRate} min={3} max={12} step={0.25}
                       fmt={v => `${v.toFixed(2)}%`} onChange={v => setFlip("loanRate", v)}/>
            <FlipSlider label="Term" value={f.termYears} min={1} max={5} step={1}
                       fmt={v => `${v}y`} onChange={v => setFlip("termYears", v)} ceiling={5}/>
            <FlipSlider label="Vested balance" value={f.vestedBalance} min={20000} max={250000} step={5000}
                       fmt={fmtMoney} onChange={v => setFlip("vestedBalance", v)}/>
          </div>
        </div>
        <div className="card">
          <h2 className="h-section" style={{marginBottom: 14}}>The flip</h2>
          <div className="col" style={{gap: 16}}>
            <FlipSlider label="Purchase price" value={f.purchase} min={50000} max={400000} step={5000}
                       fmt={fmtMoney} onChange={v => setFlip("purchase", v)}/>
            <FlipSlider label="Rehab budget" value={f.rehab} min={5000} max={150000} step={1000}
                       fmt={fmtMoney} onChange={v => setFlip("rehab", v)}/>
            <FlipSlider label="After Repair Value (ARV)" value={f.arv} min={80000} max={600000} step={5000}
                       fmt={fmtMoney} onChange={v => setFlip("arv", v)}/>
            <FlipSlider label="Months to sale" value={f.holdMonths} min={1} max={14} step={1}
                       fmt={v => `${v} mo`} onChange={v => setFlip("holdMonths", v)} warnAbove={9} warnBelow={3}/>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="h-section" style={{marginBottom: 4}}>Standard payoff vs. Asset Flip</h2>
        <div className="muted" style={{fontSize: 12.5, marginBottom: 18}}>
          Side-by-side projection. The flip surplus, if positive, gets applied as a snowflake.
        </div>
        <FlipComparison flipState={f} result={result} isViable={isViable}/>
      </section>

      <section className="card">
        <h2 className="h-section" style={{marginBottom: 14}}>Strategy friction</h2>
        <FrictionBreakdown flipState={f} result={result}/>
      </section>
    </>
  );
}

function FlipSlider({ label, value, min, max, step, fmt, onChange, ceiling, warnAbove, warnBelow }) {
  const overCap = ceiling != null && value > ceiling;
  const tooHigh = warnAbove != null && value > warnAbove;
  const tooLow = warnBelow != null && value < warnBelow;
  const flag = overCap || tooHigh || tooLow;
  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap: 12, marginBottom: 8}}>
        <span style={{fontSize: 12.5, color:"var(--ink-2)", fontWeight: 500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", minWidth: 0, flex: 1}}>{label}</span>
        <span className="tabular" style={{
          fontSize: 14, fontWeight: 600, whiteSpace:"nowrap", flexShrink: 0,
          color: overCap ? "var(--bad)" : flag ? "oklch(0.5 0.13 75)" : "var(--ink)"
        }}>
          {fmt(value)} {overCap && <I.Warning size={12}/>}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
             className="flip-slider"
             onChange={e => onChange(Number(e.target.value))}
             style={{
               appearance:"none", width:"100%", height: 4, borderRadius: 999,
               background: `linear-gradient(90deg, var(--accent) ${((value-min)/(max-min))*100}%, var(--line-2) ${((value-min)/(max-min))*100}%)`,
               outline:"none", cursor:"pointer",
             }}/>
      {ceiling != null && (
        <div style={{position:"relative", height: 0}}>
          <div style={{position:"absolute", left: `${((ceiling - min)/(max - min))*100}%`, top: -10, width: 1, height: 10, background:"var(--bad)", marginLeft: -0.5}}/>
        </div>
      )}
    </div>
  );
}

function RiskCard({ validation, title, detail }) {
  const tone = validation.level === "bad" ? "bad" : validation.level === "warn" ? "warn" : "ok";
  const sym = validation.level === "bad" ? "!" : validation.level === "warn" ? "!" : "✓";
  return (
    <div className={`risk-card ${tone}`}>
      <div className="ind">{sym}</div>
      <div style={{flex: 1}}>
        <div className="ttl">{title}</div>
        <div className="desc">{validation.msg}</div>
        <div className="muted" style={{fontSize: 11.5, marginTop: 12, lineHeight: 1.5, display: "block"}}>{detail}</div>
      </div>
    </div>
  );
}

function FlipComparison({ flipState, result, isViable }) {
  const standardInterest = 8400;
  const data = [
    { label: "Standard Avalanche", value: -standardInterest, color: "var(--ink-3)" },
    { label: "Asset Flip strategy", value: result.net, color: isViable ? "var(--good)" : "var(--bad)" },
  ];
  const max = Math.max(...data.map(d => Math.abs(d.value)), 5000);
  return (
    <div style={{display:"grid", gridTemplateColumns: "1fr", gap: 14}}>
      {data.map((d, i) => {
        const widthPct = (Math.abs(d.value) / max) * 100;
        return (
          <div key={i} style={{display:"grid", gridTemplateColumns: "180px 1fr 120px", alignItems:"center", gap: 14}}>
            <div style={{fontSize: 13, fontWeight: 500}}>{d.label}</div>
            <div style={{position:"relative", height: 28, background:"var(--bg-2)", borderRadius: 6}}>
              <div style={{
                position:"absolute", left: 0, top: 0, bottom: 0,
                width: `${widthPct}%`,
                background: d.color, borderRadius: 6,
                display:"flex", alignItems:"center", justifyContent:"flex-end",
                padding: "0 10px", color:"#fff", fontSize: 11.5, fontWeight: 600,
              }}>
                {widthPct > 25 ? `${d.value < 0 ? "−" : "+"}${fmtMoney(Math.abs(d.value))}` : ""}
              </div>
            </div>
            <div className="tabular" style={{fontWeight: 600, color: d.value < 0 ? "var(--bad)" : "var(--good)"}}>
              {d.value < 0 ? "−" : "+"}{fmtMoney(Math.abs(d.value))}
            </div>
          </div>
        );
      })}
      <div className="muted" style={{fontSize: 12, marginTop: 6, paddingTop: 12, borderTop: "1px solid var(--line-2)"}}>
        Standard Avalanche figure assumes the existing crushing fund without taking a 401(k) loan.
      </div>
    </div>
  );
}

function FrictionBreakdown({ flipState: f, result }) {
  const items = [
    { label: "Acquisition closing costs", value: f.purchase * 0.03, hint: "~3% of purchase price" },
    { label: "Holding costs", value: 600 * f.holdMonths, hint: `${f.holdMonths} months × $600 (taxes, insurance, utilities)` },
    { label: "Selling commission", value: f.arv * 0.06, hint: "6% agent fee · NJ Realty Transfer Fee not shown" },
    { label: "401(k) loan interest leakage", value: result.leakage, hint: "Compound growth foregone vs. 7% market" },
    { label: "Double-taxation drag", value: result.tax, hint: "Interest paid with after-tax dollars, taxed again at withdrawal" },
    { label: "Plan admin fees", value: 75 + 35 * f.termYears, hint: "$75 origination + $35/yr maintenance" },
  ];
  const total = items.reduce((s, x) => s + x.value, 0);
  return (
    <div className="col" style={{gap: 0}}>
      {items.map((x, i) => (
        <div key={i} style={{display:"grid", gridTemplateColumns:"1fr 120px", alignItems:"center", padding:"10px 0", borderTop: i ? "1px solid var(--line-2)" : "none"}}>
          <div>
            <div style={{fontSize: 13, fontWeight: 500}}>{x.label}</div>
            <div className="muted" style={{fontSize: 11.5, marginTop: 1}}>{x.hint}</div>
          </div>
          <div className="tabular" style={{textAlign:"right", fontWeight: 600, color: "var(--bad)"}}>−{fmtMoney(x.value)}</div>
        </div>
      ))}
      <div style={{display:"grid", gridTemplateColumns:"1fr 120px", padding: "14px 0 0", borderTop: "1px solid var(--line)", marginTop: 6, alignItems:"center"}}>
        <div className="serif" style={{fontSize: 18}}>Total frictional cost</div>
        <div className="tabular" style={{textAlign:"right", fontSize: 18, fontWeight: 600, color: "var(--bad)", fontFamily:"var(--font-serif)", letterSpacing:"-0.01em"}}>−{fmtMoney(total)}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// HUSTLE SIMULATOR (rideshare, delivery, freelance, sell)
// ════════════════════════════════════════════════════════════════════════

const HUSTLE_CONFIG = {
  rideshare: {
    grossLabel: "Gross fare income",
    inputs: [
      { k: "hoursPerWeek", label: "Hours per week", min: 2, max: 40, step: 1, fmt: v => `${v} hr`, hint: "Weekday evenings + weekends" },
      { k: "hourlyGross", label: "Gross $/hr (incl. tips)", min: 12, max: 45, step: 0.5, fmt: v => `$${v.toFixed(2)}`, hint: "Average across surge & base" },
      { k: "milesPerHour", label: "Miles driven per hour", min: 8, max: 30, step: 1, fmt: v => `${v} mi`, hint: "IRS deduction rate $0.67/mi" },
      { k: "platformCut", label: "Platform commission", min: 15, max: 40, step: 1, fmt: v => `${v}%`, hint: "Already netted in payout" },
      { k: "weeksOn", label: "Weeks active", min: 2, max: 26, step: 1, fmt: v => `${v} wk`, hint: "Run length" },
    ],
    expenses: (s) => {
      const fuel = (s.hoursPerWeek * s.milesPerHour) / 28 * 3.40 * s.weeksOn; // 28mpg, $3.40/gal
      const wear = s.hoursPerWeek * s.milesPerHour * 0.12 * s.weeksOn; // wear&tear
      const insurance = 22 * (s.weeksOn / 4.33); // rideshare insurance rider
      return [
        { label: "Fuel",                value: fuel,      hint: "≈28 mpg @ $3.40/gal" },
        { label: "Vehicle wear & tear", value: wear,      hint: "$0.12/mi maintenance + depreciation" },
        { label: "Rideshare insurance", value: insurance, hint: "$22/wk endorsement" },
      ];
    },
    risks: [
      { tone: "warn", title: "Vehicle depreciation", desc: "High-mileage driving accelerates resale loss. Plan a vehicle-replacement reserve.", level: "warn" },
      { tone: "ok",   title: "1099 self-employment tax", desc: "Set aside ~15.3% for SE tax — quarterly estimateds due to IRS.", level: "warn" },
    ],
    quickRefs: [
      { label: "Avg US rideshare hourly", value: "$19.81/hr after expenses" },
      { label: "IRS standard mileage", value: "$0.67/mi (2026)" },
      { label: "SE tax rate", value: "15.3% on net earnings" },
    ],
  },

  delivery: {
    grossLabel: "Gross delivery payout",
    inputs: [
      { k: "hoursPerWeek", label: "Hours per week", min: 2, max: 35, step: 1, fmt: v => `${v} hr`, hint: "Lunch + dinner peaks pay best" },
      { k: "deliveriesPerHour", label: "Deliveries per hour", min: 1, max: 5, step: 0.5, fmt: v => `${v.toFixed(1)}`, hint: "DoorDash avg ≈ 2/hr" },
      { k: "payPerDelivery", label: "Average pay per delivery", min: 4, max: 14, step: 0.25, fmt: v => `$${v.toFixed(2)}`, hint: "Includes base + tip" },
      { k: "milesPerDelivery", label: "Miles per delivery", min: 1, max: 8, step: 0.5, fmt: v => `${v.toFixed(1)} mi` },
      { k: "weeksOn", label: "Weeks active", min: 2, max: 26, step: 1, fmt: v => `${v} wk` },
    ],
    expenses: (s) => {
      const totalMiles = s.hoursPerWeek * s.deliveriesPerHour * s.milesPerDelivery * s.weeksOn;
      const fuel = totalMiles / 30 * 3.40;
      const wear = totalMiles * 0.10;
      const phone = 12 * (s.weeksOn / 4.33);
      return [
        { label: "Fuel",                value: fuel,    hint: `${totalMiles.toFixed(0)} mi total ≈ 30 mpg` },
        { label: "Vehicle wear",        value: wear,    hint: "$0.10/mi" },
        { label: "Hot-bag + phone plan",value: phone,   hint: "$12/wk overhead" },
      ];
    },
    risks: [
      { tone: "ok",   title: "Multi-app stacking", desc: "Run DoorDash + Uber Eats + Instacart simultaneously — improves $/hr by ~22%.", level: "ok" },
      { tone: "warn", title: "Low-tip orders",     desc: "Decline orders under $1.50/mi. Algorithm punishes cherry-picking, but math wins.", level: "warn" },
    ],
    quickRefs: [
      { label: "Avg delivery $/hr", value: "$15–$22 after expenses" },
      { label: "Acceptance rate floor", value: "70% on DoorDash for Top Dasher" },
      { label: "Best blocks", value: "Fri–Sun, 11a–2p & 5p–9p" },
    ],
  },

  freelance: {
    grossLabel: "Gross client billings",
    inputs: [
      { k: "billableHours", label: "Billable hours / week", min: 2, max: 25, step: 1, fmt: v => `${v} hr`, hint: "Realistic w/ a day job" },
      { k: "rate", label: "Hourly rate", min: 25, max: 200, step: 5, fmt: v => `$${v}/hr`, hint: "Set rate ≥ market floor" },
      { k: "platformCut", label: "Platform fee", min: 0, max: 20, step: 1, fmt: v => `${v}%`, hint: "Upwork: 10%, Fiverr: 20%, direct: 0%" },
      { k: "rampWeeks", label: "Ramp-up weeks", min: 0, max: 8, step: 1, fmt: v => `${v} wk`, hint: "Time to first paying client" },
      { k: "weeksOn", label: "Weeks active (after ramp)", min: 4, max: 26, step: 1, fmt: v => `${v} wk` },
    ],
    expenses: (s) => {
      const tools = 18 * (s.weeksOn + s.rampWeeks) / 4.33;
      const taxReserve = 0; // separated below as reminder
      return [
        { label: "Tools & subscriptions", value: tools, hint: "$18/wk avg (Figma, ChatGPT, Notion)" },
      ];
    },
    risks: [
      { tone: "warn", title: "Quarterly estimated taxes", desc: "1099 income — owe quarterlies (Apr/Jun/Sep/Jan). Reserve 25–30% before snowflaking.", level: "warn" },
      { tone: "ok",   title: "Skill-portable income",     desc: "Compounds: rate goes up with each portfolio piece. Lower long-term risk than asset strategies.", level: "ok" },
      { tone: "ok",   title: "No capital required",       desc: "Zero upfront cost vs. flip strategy ($42k loan). Pure time-for-money.", level: "ok" },
    ],
    quickRefs: [
      { label: "Median Upwork rate", value: "$35–$95/hr" },
      { label: "Fiverr take-rate", value: "20% platform fee" },
      { label: "Tax reserve", value: "25–30% of net" },
    ],
  },

  sell: {
    grossLabel: "Gross resale revenue",
    inputs: [
      { k: "items", label: "Items to list", min: 5, max: 100, step: 1, fmt: v => `${v} items` },
      { k: "avgPrice", label: "Avg sale price", min: 8, max: 200, step: 1, fmt: v => `$${v}`, hint: "Realistic — clothes ~$15, electronics ~$60" },
      { k: "sellThrough", label: "Sell-through rate", min: 30, max: 90, step: 5, fmt: v => `${v}%`, hint: "% of listings that actually sell" },
      { k: "platform", label: "Platform fee", min: 0, max: 15, step: 1, fmt: v => `${v}%`, hint: "Marketplace 0%, eBay 13%, Mercari 10%" },
      { k: "weeksOn", label: "Weeks to clear", min: 2, max: 16, step: 1, fmt: v => `${v} wk` },
    ],
    expenses: (s) => {
      const sold = s.items * (s.sellThrough / 100);
      const shipping = sold * 4.50 * 0.6; // 60% shipped
      const supplies = sold * 0.85;
      return [
        { label: "Shipping (paid by you)", value: shipping, hint: `${(sold*0.6).toFixed(0)} shipped × $4.50` },
        { label: "Packing supplies",       value: supplies, hint: "Boxes, tape, labels ($0.85/item)" },
      ];
    },
    risks: [
      { tone: "ok",   title: "Zero downside", desc: "You already own the items. Worst case: you keep them.", level: "ok" },
      { tone: "ok",   title: "1099-K threshold", desc: "If you exceed $5,000 across platforms in 2026, expect a 1099-K. Hobby-loss rules apply if not a business.", level: "warn" },
    ],
    quickRefs: [
      { label: "Avg household resellable", value: "$1,200–$3,500" },
      { label: "Best categories", value: "Brand-name clothes, tech, books" },
      { label: "Timing", value: "Sun evenings drive most views" },
    ],
  },
};

function calcHustle(sid, s) {
  const cfg = HUSTLE_CONFIG[sid];
  let gross = 0;
  if (sid === "rideshare") gross = s.hoursPerWeek * s.hourlyGross * s.weeksOn;
  if (sid === "delivery")  gross = s.hoursPerWeek * s.deliveriesPerHour * s.payPerDelivery * s.weeksOn;
  if (sid === "freelance") gross = s.billableHours * s.rate * s.weeksOn * (1 - s.platformCut/100);
  if (sid === "sell")      gross = s.items * s.avgPrice * (s.sellThrough/100) * (1 - s.platform/100);
  const expenses = cfg.expenses(s);
  const totalExpenses = expenses.reduce((a,b) => a + b.value, 0);
  const grossHours = sid === "freelance" ? s.billableHours * s.weeksOn :
                     sid === "sell" ? s.items * 0.4 :
                     s.hoursPerWeek * s.weeksOn;
  // Self-employment / 1099 reserve (varies)
  const reservePct = sid === "freelance" ? 27 : sid === "sell" ? 0 : 15.3;
  const taxReserve = Math.max(0, gross - totalExpenses) * (reservePct/100);
  const net = gross - totalExpenses - taxReserve;
  const horizonWeeks = (sid === "freelance" ? s.weeksOn + (s.rampWeeks||0) : s.weeksOn) || 4;
  const monthly = net / (horizonWeeks / 4.33);
  return { gross, expenses, totalExpenses, taxReserve, reservePct, net, hours: grossHours, hourlyNet: net / Math.max(1, grossHours), horizonWeeks, monthly };
}

function HustleSimulator({ sid, state, setState }) {
  const cfg = HUSTLE_CONFIG[sid];
  const meta = STRATEGIES[sid];
  const r = calcHustle(sid, state);
  const isViable = r.net > 0;

  return (
    <>
      <section className="hero" style={{gridTemplateColumns: "1fr 1fr"}}>
        <div className="hero-l" style={{background: "var(--ink)"}}>
          <span className="eye">{meta.name} · projected take-home</span>
          <div className="num" style={{color: isViable ? "oklch(0.85 0.12 155)" : "oklch(0.85 0.15 25)"}}>
            +{fmtMoney(r.net)}
          </div>
          <span className="delta" style={{
            background: "oklch(0.85 0.12 155 / 0.12)",
            color: "oklch(0.85 0.12 155)",
          }}>
            <I.Check size={11}/> {fmtMoney(r.monthly)}/mo · routes to highest APR
          </span>
          <div style={{fontSize: 12.5, color: "oklch(1 0 0 / 0.6)", marginTop: 4, lineHeight: 1.5}}>
            {meta.short}. Net of expenses{r.taxReserve > 0 ? ` and ${r.reservePct}% tax reserve` : ""}.
          </div>
        </div>
        <div className="hero-r" style={{padding: "var(--pad)", display:"grid", gridTemplateColumns:"1fr 1fr", gap: 16, alignContent:"center"}}>
          <div className="kpi">
            <span className="lbl">Gross</span>
            <span className="val">{fmtMoney(r.gross)}</span>
            <span className="sub">over {r.horizonWeeks} weeks</span>
          </div>
          <div className="kpi">
            <span className="lbl">Net per hour</span>
            <span className="val">${r.hourlyNet.toFixed(2)}</span>
            <span className="sub">after all costs</span>
          </div>
          <div className="kpi">
            <span className="lbl">Expenses</span>
            <span className="val" style={{color:"var(--bad)"}}>−{fmtMoney(r.totalExpenses)}</span>
            <span className="sub">{cfg.expenses(state).length} line items</span>
          </div>
          <div className="kpi">
            <span className="lbl">Tax reserve</span>
            <span className="val" style={{color:"var(--bad)"}}>−{fmtMoney(r.taxReserve)}</span>
            <span className="sub">{r.reservePct}% of net{r.reservePct === 0 ? " · n/a" : ""}</span>
          </div>
        </div>
      </section>

      {/* Risk cards */}
      <section className={cfg.risks.length === 1 ? "" : "grid-2"}>
        {cfg.risks.map((r, i) => (
          <RiskCard key={i} validation={{level: r.level, msg: r.desc}} title={r.title} detail={""}/>
        ))}
      </section>

      {/* Inputs */}
      <section className="card">
        <div className="between" style={{marginBottom: 14, gap: 10, flexWrap: "wrap"}}>
          <h2 className="h-section" style={{whiteSpace:"nowrap"}}>{meta.name} inputs</h2>
          <span className="toggle-pill" style={{background:"var(--bg-2)", color:"var(--ink-2)", whiteSpace:"nowrap"}}>
            <I.Check size={11}/> Realistic defaults loaded
          </span>
        </div>
        <div className="grid-2" style={{gap: "var(--pad)"}}>
          {cfg.inputs.map(inp => (
            <FlipSlider key={inp.k} label={inp.label} value={state[inp.k]}
                       min={inp.min} max={inp.max} step={inp.step}
                       fmt={inp.fmt} onChange={v => setState(inp.k, v)}/>
          ))}
        </div>
      </section>

      {/* Expense breakdown */}
      <section className="card">
        <h2 className="h-section" style={{marginBottom: 14}}>Net take-home, line by line</h2>
        <div className="col" style={{gap: 0}}>
          <BreakdownRow label={cfg.grossLabel} hint={`Over ${r.horizonWeeks} weeks`} value={r.gross} positive top/>
          {r.expenses.map((x, i) => (
            <BreakdownRow key={i} label={x.label} hint={x.hint} value={-x.value}/>
          ))}
          {r.taxReserve > 0 && (
            <BreakdownRow label="Self-employment tax reserve" hint={`${r.reservePct}% on ${fmtMoney(Math.max(0, r.gross - r.totalExpenses))} net`} value={-r.taxReserve}/>
          )}
          <div style={{display:"grid", gridTemplateColumns:"1fr 140px", padding: "14px 0 0", borderTop: "1px solid var(--line)", marginTop: 6, alignItems:"center"}}>
            <div className="serif" style={{fontSize: 18}}>Net to debt payoff</div>
            <div className="tabular" style={{textAlign:"right", fontSize: 18, fontWeight: 600, color: r.net > 0 ? "var(--good)" : "var(--bad)", fontFamily:"var(--font-serif)", letterSpacing:"-0.01em"}}>+{fmtMoney(r.net)}</div>
          </div>
        </div>
      </section>

      {/* Quick references */}
      <section className="card flat" style={{background:"var(--bg-2)", border:"1px solid var(--line)"}}>
        <span className="h-eyebrow">Reference benchmarks</span>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 14, marginTop: 12}}>
          {cfg.quickRefs.map((q, i) => (
            <div key={i} style={{padding: 10, background:"var(--surface)", borderRadius: 8, border:"1px solid var(--line)"}}>
              <div className="muted" style={{fontSize: 11, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight: 600}}>{q.label}</div>
              <div style={{fontSize: 13, fontWeight: 500, marginTop: 4}}>{q.value}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function BreakdownRow({ label, hint, value, positive, top }) {
  return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 140px", alignItems:"center", padding:"10px 0", borderTop: top ? "none" : "1px solid var(--line-2)"}}>
      <div>
        <div style={{fontSize: 13, fontWeight: 500}}>{label}</div>
        {hint && <div className="muted" style={{fontSize: 11.5, marginTop: 1}}>{hint}</div>}
      </div>
      <div className="tabular" style={{textAlign:"right", fontWeight: 600, color: value > 0 ? "var(--ink)" : "var(--bad)"}}>
        {value > 0 ? "+" : "−"}{fmtMoney(Math.abs(value))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// RIGHT PANE (adapts per strategy)
// ════════════════════════════════════════════════════════════════════════
function SimulatorRightPane({ flipState, simStrategy, hustleState }) {
  const sid = simStrategy || "flip";
  if (sid === "flip") return <FlipRightPane flipState={flipState}/>;
  return <HustleRightPane sid={sid} state={hustleState[sid]}/>;
}

function FlipRightPane({ flipState }) {
  const f = flipState;
  const validation401k = validate401kLoan(f.loanAmount, f.vestedBalance);
  const rule70 = validate70Rule(f.purchase, f.arv, f.rehab);
  const result = netStrategyGain({
    loanAmount: f.loanAmount, loanRate: f.loanRate, termYears: f.termYears,
    marketRate: f.marketRate, purchase: f.purchase, sale: f.arv, rehab: f.rehab,
    holdMonths: f.holdMonths, currentTax: f.currentTax, retireTax: f.retireTax
  });
  const isViable = result.net > 0;
  let confidence = 70;
  if (validation401k.level === "bad") confidence -= 35;
  else if (validation401k.level === "warn") confidence -= 10;
  if (rule70.level === "bad") confidence -= 25;
  else if (rule70.level === "warn") confidence -= 12;
  if (f.holdMonths < 3) confidence -= 8;
  if (f.holdMonths > 8) confidence -= 5;
  if (isViable) confidence += 10;
  confidence = Math.max(5, Math.min(95, confidence));

  return (
    <>
      <div className="card">
        <span className="h-eyebrow">Confidence</span>
        <div className="ring-wrap" style={{marginTop: 14}}>
          <div className="ring">
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--line-2)" strokeWidth="6"/>
              <circle cx="40" cy="40" r="34" fill="none"
                      stroke={confidence > 70 ? "var(--good)" : confidence > 40 ? "var(--warn)" : "var(--bad)"}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(confidence/100) * 213.6} 213.6`}/>
            </svg>
            <div className="ringval">{confidence}</div>
          </div>
          <div>
            <div style={{fontSize: 13, fontWeight: 600}}>{confidence > 70 ? "High confidence" : confidence > 40 ? "Moderate" : "Low confidence"}</div>
            <div className="muted" style={{fontSize: 12, marginTop: 3, lineHeight: 1.4}}>
              Inputs reconciled against linked Plaid balances · last sync 2 min ago
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <span className="h-eyebrow">Why we ranked it this way</span>
        <ul style={{listStyle:"none", padding: 0, margin: "12px 0 0", display:"flex", flexDirection:"column", gap: 10}}>
          <li className="row" style={{gap: 8, alignItems:"flex-start"}}>
            <I.Check size={14} style={{color:"var(--good)", flexShrink: 0, marginTop: 2}}/>
            <span style={{fontSize: 12.5}}><b>Vested balance covers</b> the loan with $36k of legal headroom under IRS 72(p).</span>
          </li>
          <li className="row" style={{gap: 8, alignItems:"flex-start"}}>
            <I.Check size={14} style={{color:"var(--good)", flexShrink: 0, marginTop: 2}}/>
            <span style={{fontSize: 12.5}}><b>5-month hold</b> sits inside the national average of 5–6 months.</span>
          </li>
          <li className="row" style={{gap: 8, alignItems:"flex-start"}}>
            <I.Warning size={14} style={{color:"var(--warn)", flexShrink: 0, marginTop: 2}}/>
            <span style={{fontSize: 12.5}}><b>Termination risk:</b> if you change jobs, the balance is due by next April.</span>
          </li>
          <li className="row" style={{gap: 8, alignItems:"flex-start"}}>
            <I.Warning size={14} style={{color:"var(--warn)", flexShrink: 0, marginTop: 2}}/>
            <span style={{fontSize: 12.5}}><b>Compound leakage</b> grows roughly 2% a year on the displaced balance.</span>
          </li>
        </ul>
      </div>

      <div className="card flat" style={{background:"var(--bg)", border:"1px dashed var(--line)"}}>
        <span className="h-eyebrow">Apply surplus to</span>
        <div className="muted" style={{fontSize: 12.5, marginTop: 8, lineHeight: 1.5}}>
          {isViable
            ? "On a successful flip, the platform will queue the net gain as a snowflake on Capital Card (highest APR)."
            : "Net gain is negative — no snowflake to schedule."}
        </div>
        <button className="btn" style={{marginTop: 12, width: "100%", justifyContent:"center"}} disabled={!isViable}>
          {isViable ? "Schedule snowflake" : "Strategy declined"}
        </button>
      </div>
    </>
  );
}

function HustleRightPane({ sid, state }) {
  const meta = STRATEGIES[sid];
  const r = calcHustle(sid, state);
  const isViable = r.net > 0;

  // months saved off payoff = monthly snowflake / typical interest savings ratio (rough)
  const monthsSaved = Math.round((r.net / 8400) * 11);
  const targetDebt = sid === "sell" ? "Store Card (27.99%)" : "Capital Card (24.99%)";

  return (
    <>
      <div className="card">
        <span className="h-eyebrow">Strategy at a glance</span>
        <div style={{marginTop: 12, display:"flex", flexDirection:"column", gap: 10}}>
          <KvRow label="Total run" value={`${r.horizonWeeks} weeks`}/>
          <KvRow label="Hours invested" value={`${r.hours.toFixed(0)} hr`}/>
          <KvRow label="Net per hour" value={`$${r.hourlyNet.toFixed(2)}`}/>
          <KvRow label="Net total" value={fmtMoney(r.net)} bold/>
          <KvRow label="Routes to" value={targetDebt} small/>
        </div>
      </div>

      <div className="card">
        <span className="h-eyebrow">Time-to-cash</span>
        <div className="muted" style={{fontSize: 12.5, marginTop: 6, lineHeight: 1.5}}>
          {sid === "sell"
            ? "First sales typically clear in 48–72 hours. Most listings sell within 2 weeks."
            : sid === "freelance"
            ? `Expect ${state.rampWeeks || 2} weeks to land your first paying client, then steady cash flow.`
            : "First payout deposits in 2–7 days. Weekly cadence after that — clean and predictable."}
        </div>
        <div style={{marginTop: 14, display:"flex", gap: 4, alignItems:"flex-end", height: 60}}>
          {Array.from({length: Math.min(r.horizonWeeks, 14)}).map((_, i) => {
            const h = sid === "freelance" && i < (state.rampWeeks || 0) ? 6 : 18 + (i % 3) * 8 + (i * 1.5);
            return <div key={i} style={{flex: 1, height: `${Math.min(h, 60)}px`, background: i < (state.rampWeeks || 0) && sid === "freelance" ? "var(--line)" : "var(--accent-soft)", borderRadius: 2}}/>;
          })}
        </div>
        <div className="muted" style={{fontSize: 11, marginTop: 6, display:"flex", justifyContent:"space-between"}}>
          <span>Wk 1</span><span>Wk {Math.min(r.horizonWeeks, 14)}</span>
        </div>
      </div>

      <div className="card flat" style={{background:"var(--bg)", border:"1px dashed var(--line)"}}>
        <span className="h-eyebrow">Apply surplus to</span>
        <div className="muted" style={{fontSize: 12.5, marginTop: 8, lineHeight: 1.5}}>
          {isViable
            ? `Cuts ${monthsSaved > 0 ? `~${monthsSaved} months` : "weeks"} off your payoff. Auto-routed to ${targetDebt}.`
            : "Strategy is breaking even — adjust inputs or try another."}
        </div>
        <button className="btn primary" style={{marginTop: 12, width: "100%", justifyContent:"center"}} disabled={!isViable}>
          {isViable ? <><I.Check size={13}/> Activate {meta.name}</> : "Adjust inputs"}
        </button>
      </div>
    </>
  );
}

function KvRow({ label, value, bold, small }) {
  return (
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", gap: 10}}>
      <span className="muted" style={{fontSize: small ? 11.5 : 12.5}}>{label}</span>
      <span className="tabular" style={{fontSize: bold ? 16 : small ? 12 : 13, fontWeight: bold ? 600 : 500, textAlign:"right"}}>{value}</span>
    </div>
  );
}

Object.assign(window, {
  SimulatorTab, SimulatorRightPane,
  FlipSlider, RiskCard, FlipComparison, FrictionBreakdown,
  STRATEGIES, HUSTLE_CONFIG, calcHustle,
});
