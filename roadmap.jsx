// roadmap.jsx — Roadmap tab content + right pane

const { useState, useMemo, useRef, useEffect } = React;

function RoadmapTab({ debts, strategy, extraPay, setExtraPay, logPayment, openLog }) {
  const sim = useMemo(() => simulatePayoff(debts, strategy, extraPay), [debts, strategy, extraPay]);
  const baseline = useMemo(() => simulatePayoff(debts, strategy, 0), [debts, strategy]);
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const startingBalance = 75600; // hypothetical starting point so we can show a delta
  const ordered = orderDebts(debts, strategy);
  const targetDebt = ordered.find(d => d.balance > 0);

  const debtFreeMonth = sim.totalMonths;
  const baselineMonth = baseline.totalMonths;
  const monthsSaved = baselineMonth - debtFreeMonth;
  const interestSaved = baseline.totalInterest - sim.totalInterest;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-l">
          <span className="eye">Total balance · {strategy === "snowball" ? "Snowball" : strategy === "avalanche" ? "Avalanche" : "Custom"}</span>
          <div className="num">{fmtMoney(totalBalance)}<small>.{(totalBalance % 1).toFixed(2).slice(2)}</small></div>
          <span className="delta"><I.Down size={11}/> {fmtMoney(startingBalance - totalBalance)} since you started · {((1 - totalBalance/startingBalance)*100).toFixed(1)}%</span>
          <div className="gauge" style={{background:"oklch(1 0 0 / 0.08)", marginTop: 6}}>
            <div className="fill" style={{width: `${((1 - totalBalance/startingBalance)*100).toFixed(1)}%`, background: "oklch(0.85 0.12 155)"}}/>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", color: "oklch(1 0 0 / 0.45)", fontSize: 11, fontFamily:"var(--font-mono)"}}>
            <span>Started Jan '24 · {fmtMoney(startingBalance)}</span>
            <span>Goal · $0</span>
          </div>
        </div>
        <div className="hero-r">
          <div className="kpi">
            <span className="lbl">Debt-free date</span>
            <span className="val">{monthLabel(debtFreeMonth)}</span>
            <span className="sub">{fmtMonths(debtFreeMonth)} from today · {monthsSaved > 0 ? `${monthsSaved} mo earlier` : "on baseline"}</span>
          </div>
          <div className="kpi">
            <span className="lbl">Lifetime interest saved</span>
            <span className="val" style={{color: "var(--good)"}}>{fmtMoney(interestSaved)}</span>
            <span className="sub">vs minimums-only</span>
          </div>
          <div className="kpi">
            <span className="lbl">Crushing fund</span>
            <span className="val">{fmtMoney(extraPay)}<small style={{fontSize:14, color:"var(--ink-3)"}}>/mo</small></span>
            <span className="sub">applied to <b style={{color:"var(--ink)"}}>{targetDebt?.name || "—"}</b></span>
          </div>
        </div>
      </section>

      {/* Roadmap timeline */}
      <section className="card">
        <div className="between" style={{marginBottom: 16}}>
          <div>
            <h2 className="h-section">Roadmap</h2>
            <div className="muted" style={{fontSize: 12.5, marginTop: 2}}>Month-by-month projection. The dark marker shows today.</div>
          </div>
          <div className="row">
            <div className="legend">
              <span><i style={{background:"var(--accent)"}}/>Paid</span>
              <span><i style={{background:"var(--line)"}}/>Remaining</span>
              <span><i style={{background:"var(--ink)", width: 2, height: 12, borderRadius: 0, verticalAlign:"middle"}}/>Today</span>
            </div>
          </div>
        </div>

        <Timeline debts={debts} sim={sim} ordered={ordered} totalMonths={Math.min(72, sim.totalMonths)} />
      </section>

      {/* Strategy comparison */}
      <section className="card">
        <div className="between" style={{marginBottom: 12}}>
          <div>
            <h2 className="h-section">Snowball vs. Avalanche</h2>
            <div className="muted" style={{fontSize: 12.5, marginTop: 2}}>Total balance over time. Both extend the same crushing fund.</div>
          </div>
          <div className="legend">
            <span><i style={{background: "var(--accent)"}}/>Avalanche</span>
            <span><i style={{background: "var(--warn)"}}/>Snowball</span>
            <span><i style={{background: "var(--ink-3)"}}/>Minimums only</span>
          </div>
        </div>
        <ComparisonChart debts={debts} extraPay={extraPay} />
      </section>

      {/* Quick what-if */}
      <section className="card">
        <div className="between" style={{marginBottom: 8}}>
          <h2 className="h-section">What if you added more?</h2>
          <span className="toggle-pill"><I.Bolt size={11}/> Live</span>
        </div>
        <p className="muted" style={{fontSize: 13, margin: "0 0 16px", maxWidth: 520}}>
          Drag to see how a few extra dollars a month reshape your roadmap.
        </p>
        <div style={{display:"grid", gridTemplateColumns: "1fr 240px", gap: 28, alignItems:"center"}}>
          <div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
              <div>
                <span className="h-eyebrow">Extra per month</span>
                <div className="serif" style={{fontSize: 32, letterSpacing:"-0.02em", lineHeight:1, marginTop:4}}>
                  {fmtMoney(extraPay)}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <span className="h-eyebrow">New debt-free date</span>
                <div className="serif" style={{fontSize: 22, letterSpacing:"-0.01em", marginTop:4}}>{monthLabel(sim.totalMonths)}</div>
              </div>
            </div>
            <div className="whatif" style={{padding: 0, marginTop: 18}}>
              <input type="range" min="0" max="2000" step="25" value={extraPay} onChange={e => setExtraPay(Number(e.target.value))}/>
              <div className="scale">
                <span>$0</span><span>$500</span><span>$1,000</span><span>$1,500</span><span>$2,000</span>
              </div>
            </div>
          </div>
          <div className="card flat" style={{background: "var(--bg-2)", padding: 16, borderRadius: 12}}>
            <div className="h-eyebrow">Versus baseline</div>
            <div style={{display:"flex", flexDirection:"column", gap: 10, marginTop: 10}}>
              <div className="between">
                <span style={{fontSize: 12.5, color:"var(--ink-3)"}}>Time saved</span>
                <span className="tabular" style={{fontWeight:600}}>{monthsSaved >= 0 ? fmtMonths(monthsSaved) : "—"}</span>
              </div>
              <div className="between">
                <span style={{fontSize: 12.5, color:"var(--ink-3)"}}>Interest saved</span>
                <span className="tabular" style={{fontWeight:600, color:"var(--good)"}}>{fmtMoney(interestSaved)}</span>
              </div>
              <div className="between">
                <span style={{fontSize: 12.5, color:"var(--ink-3)"}}>Last payment</span>
                <span className="tabular" style={{fontWeight:600}}>{monthLabel(sim.totalMonths)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Timeline({ debts, sim, ordered, totalMonths }) {
  const monthsToShow = Math.max(24, totalMonths);
  const ticks = useMemo(() => {
    const out = [];
    const step = monthsToShow > 60 ? 12 : 6;
    for (let m = 0; m < monthsToShow; m += step) out.push(m);
    return out;
  }, [monthsToShow]);

  return (
    <div>
      <div className="timeline-axis">
        {ticks.map((m,i) => <span key={i} className="tick">{monthLabel(m)}</span>)}
      </div>
      {ordered.map((d, idx) => {
        // find first month where this debt is paid off
        let paidMonth = sim.months.findIndex(s => (s.debts[d.id] || 0) <= 0.01);
        if (paidMonth === -1) paidMonth = sim.totalMonths;
        const widthPct = Math.min(100, (paidMonth / monthsToShow) * 100);
        const isTarget = idx === 0;
        return (
          <div key={d.id} className="tl-row">
            <div className="name">
              <span className="swatch" style={{background: d.color}}/>
              <span>{d.name}</span>
              <span className="meta">{fmtMoney(d.balance)}</span>
            </div>
            <div className={"tl-bar" + (isTarget ? " is-target":"")}>
              <div className="fill" style={{width: `${widthPct}%`}}/>
            </div>
            <div className="tl-pay">
              {paidMonth === sim.totalMonths ? "—" : `paid ${monthLabel(paidMonth)}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ComparisonChart({ debts, extraPay }) {
  const aval = useMemo(() => simulatePayoff(debts, "avalanche", extraPay), [debts, extraPay]);
  const snow = useMemo(() => simulatePayoff(debts, "snowball", extraPay), [debts, extraPay]);
  const mins = useMemo(() => simulatePayoff(debts, "avalanche", 0), [debts]);
  const W = 800, H = 220, P = { l: 56, r: 16, t: 16, b: 28 };
  const maxMonths = Math.max(aval.totalMonths, snow.totalMonths, mins.totalMonths);
  const initial = debts.reduce((s,d)=>s+d.balance,0);
  const x = (m) => P.l + (m / maxMonths) * (W - P.l - P.r);
  const y = (v) => P.t + (1 - v / initial) * (H - P.t - P.b);

  const buildPath = (sim) => {
    let p = `M ${x(0)},${y(initial)}`;
    sim.months.forEach((s) => { p += ` L ${x(s.month)},${y(s.totalRemaining)}`; });
    return p;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xTicks = useMemo(() => {
    const step = maxMonths > 72 ? 24 : maxMonths > 36 ? 12 : 6;
    const arr = [];
    for (let m = 0; m <= maxMonths; m += step) arr.push(m);
    if (arr[arr.length-1] !== maxMonths) arr.push(maxMonths);
    return arr;
  }, [maxMonths]);

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {yTicks.map((t,i) => (
          <g key={i}>
            <line x1={P.l} x2={W-P.r} y1={y(initial*t)} y2={y(initial*t)} stroke="var(--line-2)" strokeDasharray={i===0?"0":"3 3"}/>
            <text x={P.l-8} y={y(initial*t)+3.5} textAnchor="end" fontSize="10" fill="var(--ink-4)" fontFamily="var(--font-mono)">
              {t === 0 ? "$0" : `$${Math.round(initial*t/1000)}k`}
            </text>
          </g>
        ))}
        {xTicks.map((m,i) => (
          <g key={i}>
            <line x1={x(m)} x2={x(m)} y1={H-P.b} y2={H-P.b+4} stroke="var(--ink-4)"/>
            <text x={x(m)} y={H-P.b+16} textAnchor="middle" fontSize="10" fill="var(--ink-4)" fontFamily="var(--font-mono)">{monthLabel(m)}</text>
          </g>
        ))}
        <path d={buildPath(mins)} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <path d={buildPath(snow)} fill="none" stroke="var(--warn)" strokeWidth="2"/>
        <path d={buildPath(aval)} fill="none" stroke="var(--accent)" strokeWidth="2.5"/>
        {/* end markers */}
        <circle cx={x(aval.totalMonths)} cy={y(0)} r="4" fill="var(--accent)"/>
        <circle cx={x(snow.totalMonths)} cy={y(0)} r="3.5" fill="var(--warn)"/>
      </svg>
    </div>
  );
}

function RoadmapRightPane({ debts, strategy, extraPay, openLog, logPayment, badges, streak }) {
  const ordered = orderDebts(debts, strategy);
  const target = ordered.find(d => d.balance > 0);
  const startBal = 12000; // arbitrary starting reference for target
  const initialTargetBalance = target ? Math.max(target.balance * 1.5, target.balance + 2000) : 0;
  const progress = target ? (1 - target.balance / initialTargetBalance) * 100 : 0;

  return (
    <>
      <div className="card target-card">
        <div className="between" style={{marginBottom: 6}}>
          <span className="h-eyebrow">This month's target</span>
          <span className="toggle-pill"><I.Bolt size={11}/> Active</span>
        </div>
        {target ? (
          <>
            <div className="now" style={{marginTop: 8}}>{target.name}</div>
            <div className="muted" style={{fontSize: 12.5, marginBottom: 14}}>{target.kind} · {target.apr.toFixed(2)}% APR</div>
            <div className="between" style={{marginBottom: 6}}>
              <span style={{fontSize: 12, color: "var(--ink-3)"}}>Balance</span>
              <span className="tabular" style={{fontWeight: 600}}>{fmtMoney(target.balance)}</span>
            </div>
            <div className="gauge"><div className="fill" style={{width: `${progress.toFixed(1)}%`}}/></div>
            <div className="between" style={{marginTop: 6, fontSize: 11, color: "var(--ink-4)"}}>
              <span>{progress.toFixed(0)}% paid</span>
              <span>{fmtMoney(initialTargetBalance - target.balance)} chipped</span>
            </div>
            <button className="btn primary" style={{width: "100%", marginTop: 14, justifyContent:"center"}} onClick={openLog}>
              <I.Plus size={14}/> Log a payment
            </button>
          </>
        ) : (
          <div style={{textAlign:"center", padding: "24px 0"}}>
            <I.Trophy size={28}/>
            <div className="serif" style={{fontSize: 20, marginTop: 6}}>You're debt-free.</div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="between" style={{marginBottom: 14}}>
          <span className="h-eyebrow">Streak</span>
          <span className="tabular" style={{fontSize: 12, color: "var(--ink-3)"}}>{streak} weeks</span>
        </div>
        <div className="row" style={{gap: 12}}>
          <div style={{width:36, height:36, borderRadius: 10, background: "var(--warn-soft)", color: "var(--warn)", display:"grid", placeItems:"center"}}>
            <I.Flame size={18}/>
          </div>
          <div>
            <div className="serif" style={{fontSize: 22, letterSpacing:"-0.01em", lineHeight: 1}}>{streak}-week streak</div>
            <div className="muted" style={{fontSize: 12}}>Keep going — next mission unlocks at 12.</div>
          </div>
        </div>
        <div className="streak-dots" style={{marginTop: 14}}>
          {Array.from({length: 14}).map((_,i) => (
            <i key={i} className={i < streak ? "on" : i === streak ? "today" : ""}/>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="between" style={{marginBottom: 14}}>
          <span className="h-eyebrow">Achievements</span>
          <span style={{fontSize: 11, color:"var(--ink-4)"}}>{badges.filter(b=>b.achieved).length}/{badges.length}</span>
        </div>
        <div className="badges">
          {badges.map(b => (
            <div key={b.id} className={"badge-card" + (b.achieved ? "" : " locked")}>
              <div className="ico-lg">{b.achieved ? <I.Trophy size={18}/> : <I.Lock size={14}/>}</div>
              <div className="nm">{b.name}</div>
              <div className="ds">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card flat" style={{background:"var(--bg)", border:"1px dashed var(--line)"}}>
        <div className="row" style={{alignItems:"flex-start", gap: 10}}>
          <div style={{width:28, height:28, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display:"grid", placeItems:"center", flexShrink: 0}}>
            <I.Spark size={14}/>
          </div>
          <div>
            <div style={{fontSize: 12.5, fontWeight: 600}}>Tip</div>
            <div className="muted" style={{fontSize: 12.5, marginTop: 2}}>
              Round up your auto-pay by $25 a month — for {target?.name || "this debt"}, that pulls the payoff date in by ~3 months.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { RoadmapTab, RoadmapRightPane, Timeline, ComparisonChart });
