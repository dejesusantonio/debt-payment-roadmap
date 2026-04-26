// inventory.jsx — Inventory tab: editable table with drag-rank

function InventoryTab({ debts, setDebts, strategy, setStrategy, openAdd, removeDebt, updateDebt }) {
  const ordered = orderDebts(debts, strategy);
  const targetId = ordered.find(d => d.balance > 0)?.id;
  const totalBalance = debts.reduce((s,d)=>s+d.balance, 0);
  const totalMin = debts.reduce((s,d)=>s+d.min, 0);
  const weightedApr = debts.reduce((s,d)=>s+d.apr*d.balance,0) / Math.max(1,totalBalance);

  const dragId = useRef(null);
  const [dragOverId, setDragOverId] = useState(null);

  const onDragStart = (id) => (e) => {
    if (strategy !== "custom") return;
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (id) => (e) => {
    if (strategy !== "custom") return;
    e.preventDefault();
    setDragOverId(id);
  };
  const onDrop = (id) => (e) => {
    if (strategy !== "custom") return;
    e.preventDefault();
    const from = dragId.current;
    if (!from || from === id) { setDragOverId(null); return; }
    const fromIdx = debts.findIndex(d => d.id === from);
    const toIdx = debts.findIndex(d => d.id === id);
    const next = [...debts];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setDebts(next);
    setDragOverId(null);
    dragId.current = null;
  };

  return (
    <>
      <section className="grid-4">
        <div className="card flat" style={{background:"var(--bg-2)", padding: 16}}>
          <div className="h-eyebrow">Total balance</div>
          <div className="serif" style={{fontSize: 26, letterSpacing:"-0.02em", marginTop: 4}}>{fmtMoney(totalBalance)}</div>
          <div className="muted" style={{fontSize: 12, marginTop: 4}}>{debts.length} active debts</div>
        </div>
        <div className="card flat" style={{background:"var(--bg-2)", padding: 16}}>
          <div className="h-eyebrow">Min payments</div>
          <div className="serif" style={{fontSize: 26, letterSpacing:"-0.02em", marginTop: 4}}>{fmtMoney(totalMin)}<small style={{fontSize: 14, color:"var(--ink-3)"}}>/mo</small></div>
          <div className="muted" style={{fontSize: 12, marginTop: 4}}>Auto-paid on the 1st</div>
        </div>
        <div className="card flat" style={{background:"var(--bg-2)", padding: 16}}>
          <div className="h-eyebrow">Avg. APR (weighted)</div>
          <div className="serif" style={{fontSize: 26, letterSpacing:"-0.02em", marginTop: 4}}>{weightedApr.toFixed(2)}<small style={{fontSize: 14, color:"var(--ink-3)"}}>%</small></div>
          <div className="muted" style={{fontSize: 12, marginTop: 4}}>Rate-shopping could lower this</div>
        </div>
        <div className="card flat" style={{background:"var(--bg-2)", padding: 16}}>
          <div className="h-eyebrow">Highest rate</div>
          <div className="serif" style={{fontSize: 26, letterSpacing:"-0.02em", marginTop: 4, color:"var(--bad)"}}>
            {Math.max(...debts.map(d=>d.apr)).toFixed(2)}<small style={{fontSize:14, color:"var(--ink-3)"}}>%</small>
          </div>
          <div className="muted" style={{fontSize: 12, marginTop: 4}}>Avalanche flags this first</div>
        </div>
      </section>

      <section className="card" style={{padding: 0, overflow:"hidden"}}>
        <div className="between" style={{padding: "var(--pad)"}}>
          <div>
            <h2 className="h-section">Debt inventory</h2>
            <div className="muted" style={{fontSize: 12.5, marginTop: 2}}>
              {strategy === "custom"
                ? "Drag rows to set your custom payoff order."
                : strategy === "snowball"
                  ? "Snowball ranks by smallest balance first."
                  : "Avalanche ranks by highest APR first."}
            </div>
          </div>
          <div className="row" style={{gap: 8}}>
            <StrategyToggle value={strategy} onChange={setStrategy}/>
            <button className="btn primary" onClick={openAdd}><I.Plus size={14}/> Add debt</button>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{width: 40}}></th>
              <th style={{width: 32}}>#</th>
              <th>Creditor</th>
              <th className="num">Balance</th>
              <th className="num">APR</th>
              <th className="num">Min</th>
              <th>Status</th>
              <th style={{width: 70}}></th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((d, i) => (
              <tr key={d.id}
                  className={(dragOverId === d.id ? " drag-over" : "") + (d.id === targetId ? " target-row" : "")}
                  draggable={strategy === "custom"}
                  onDragStart={onDragStart(d.id)}
                  onDragOver={onDragOver(d.id)}
                  onDrop={onDrop(d.id)}>
                <td><span className="grip" style={{opacity: strategy === "custom" ? 1 : 0.3}}><I.Drag size={14}/></span></td>
                <td className="tabular muted">{String(i+1).padStart(2,"0")}</td>
                <td>
                  <div className="creditor">
                    <div className="swatch-icon" style={{background: `oklch(from ${d.color} l c h / 0.18)`, color: d.color}}>
                      {d.initials}
                    </div>
                    <div>
                      <div style={{fontWeight: 500}}>{d.name}</div>
                      <div className="muted" style={{fontSize: 11.5}}>{d.kind}</div>
                    </div>
                  </div>
                </td>
                <td className="num">
                  <input className="cell-input" type="number" value={Math.round(d.balance)}
                         onChange={e => updateDebt(d.id, { balance: Number(e.target.value) || 0 })}/>
                </td>
                <td className="num">
                  <input className="cell-input" type="number" step="0.01" value={d.apr}
                         onChange={e => updateDebt(d.id, { apr: Number(e.target.value) || 0 })}/>
                </td>
                <td className="num">
                  <input className="cell-input" type="number" value={d.min}
                         onChange={e => updateDebt(d.id, { min: Number(e.target.value) || 0 })}/>
                </td>
                <td>
                  {d.id === targetId
                    ? <span className="pill target"><I.Bolt size={10}/> Target</span>
                    : d.apr >= 20
                      ? <span className="pill warn">High rate</span>
                      : <span className="pill">Tracking</span>}
                </td>
                <td>
                  <button className="btn ghost sm" title="Remove" onClick={() => removeDebt(d.id)}><I.Trash size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Heat map */}
      <section className="card">
        <div className="between" style={{marginBottom: 12}}>
          <h2 className="h-section">Interest heat map</h2>
          <div className="muted" style={{fontSize: 12.5}}>Annual interest cost at current balance — bigger blocks bleed more cash.</div>
        </div>
        <HeatMap debts={debts}/>
      </section>
    </>
  );
}

function StrategyToggle({ value, onChange }) {
  const opts = [
    { id: "snowball", label: "Snowball" },
    { id: "avalanche", label: "Avalanche" },
    { id: "custom", label: "Custom" },
  ];
  return (
    <div style={{display:"flex", padding: 2, background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 9, gap: 2}}>
      {opts.map(o => (
        <button key={o.id} className="btn ghost sm"
                style={{
                  background: value === o.id ? "var(--surface)" : "transparent",
                  boxShadow: value === o.id ? "var(--shadow-sm)" : "none",
                  color: value === o.id ? "var(--ink)" : "var(--ink-3)",
                  fontWeight: 500,
                  padding: "5px 11px",
                }}
                onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function HeatMap({ debts }) {
  const data = debts.map(d => ({ ...d, cost: d.balance * d.apr / 100 }))
                    .sort((a,b) => b.cost - a.cost);
  const total = data.reduce((s,d)=>s+d.cost, 0);
  return (
    <div style={{display:"grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 6, gridAutoRows: 60}}>
      {data.map((d) => {
        const span = Math.max(2, Math.round((d.cost/total) * 12));
        return (
          <div key={d.id}
               style={{
                 gridColumn: `span ${span}`,
                 background: `oklch(from ${d.color} l c h / 0.16)`,
                 border: `1px solid oklch(from ${d.color} l c h / 0.4)`,
                 borderRadius: 10,
                 padding: 10,
                 display:"flex", flexDirection:"column", justifyContent:"space-between",
                 minHeight: 110,
                 gridRow: span > 6 ? "span 2" : "span 1",
               }}>
            <div style={{fontSize: 11.5, fontWeight: 600, color: d.color}}>{d.name}</div>
            <div>
              <div className="serif" style={{fontSize: 22, letterSpacing:"-0.02em", color: d.color, lineHeight: 1}}>
                {fmtMoney(d.cost, {decimals: 0})}
              </div>
              <div style={{fontSize: 11, color: "var(--ink-3)", marginTop: 2}}>
                /yr · {d.apr.toFixed(2)}% APR
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InventoryRightPane({ debts }) {
  const sorted = [...debts].sort((a,b)=>b.apr-a.apr);
  const highest = sorted[0];
  const smallest = [...debts].sort((a,b)=>a.balance-b.balance)[0];
  return (
    <>
      <div className="card">
        <span className="h-eyebrow">Strategy preview</span>
        <div className="col" style={{marginTop: 12, gap: 10}}>
          <div className="card flat" style={{background: "var(--bg-2)", padding: 12, borderRadius: 10}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap: 8}}>
              <div className="row" style={{gap: 8, minWidth: 0}}>
                <I.Snow size={14}/>
                <span style={{fontSize: 13, fontWeight: 600}}>Snowball</span>
              </div>
              <span className="tabular muted" style={{fontSize: 11, whiteSpace:"nowrap", flexShrink: 0}}>quick wins</span>
            </div>
            <div className="muted" style={{fontSize: 12, marginTop: 4}}>
              Hit <b style={{color:"var(--ink)"}}>{smallest?.name}</b> first — only {fmtMoney(smallest?.balance)}.
            </div>
          </div>
          <div className="card flat" style={{background: "var(--bg-2)", padding: 12, borderRadius: 10}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap: 8}}>
              <div className="row" style={{gap: 8, minWidth: 0}}>
                <I.Drop size={14}/>
                <span style={{fontSize: 13, fontWeight: 600}}>Avalanche</span>
              </div>
              <span className="tabular muted" style={{fontSize: 11, whiteSpace:"nowrap", flexShrink: 0}}>save most</span>
            </div>
            <div className="muted" style={{fontSize: 12, marginTop: 4}}>
              Crush <b style={{color:"var(--ink)"}}>{highest?.name}</b> at {highest?.apr.toFixed(2)}% APR.
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <span className="h-eyebrow">Quick actions</span>
        <div className="col" style={{marginTop: 12, gap: 8}}>
          <button className="btn"><I.Refresh size={14}/> Refresh balances</button>
          <button className="btn"><I.Link size={14}/> Connect new account</button>
          <button className="btn"><I.Calendar size={14}/> Set due-date alerts</button>
        </div>
      </div>

      <div className="card flat" style={{background: "var(--accent-soft)", border: "none"}}>
        <div className="row" style={{gap: 10, alignItems:"flex-start"}}>
          <I.Spark size={16}/>
          <div>
            <div style={{fontWeight: 600, fontSize: 13}}>Negotiation tip</div>
            <div className="muted" style={{fontSize: 12.5, marginTop: 4, color:"var(--ink-2)"}}>
              Cardholders who phone in score lower APRs roughly half the time. A 4-point cut on {highest?.name} alone saves ~{fmtMoney(highest?.balance * 0.04)}/yr.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { InventoryTab, InventoryRightPane, StrategyToggle, HeatMap });
