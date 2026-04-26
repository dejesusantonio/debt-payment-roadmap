// accounts.jsx — Plaid-style connected accounts + Data Health

function AccountsTab({ accounts, lastSync }) {
  const debt = accounts.filter(a => a.balance < 0);
  const assets = accounts.filter(a => a.balance > 0);
  const totalDebt = Math.abs(debt.reduce((s,a)=>s+a.balance, 0));
  const totalAssets = assets.reduce((s,a)=>s+a.balance, 0);
  const netWorth = totalAssets - totalDebt;

  return (
    <>
      <section className="grid-3">
        <div className="card">
          <div className="h-eyebrow">Net worth</div>
          <div className="serif" style={{fontSize: 32, letterSpacing:"-0.02em", marginTop: 6, color: netWorth >= 0 ? "var(--ink)" : "var(--bad)"}}>
            {netWorth < 0 && "−"}{fmtMoney(Math.abs(netWorth))}
          </div>
          <div className="muted" style={{fontSize: 12, marginTop: 4}}>Liabilities {fmtMoney(totalDebt)} · Assets {fmtMoney(totalAssets)}</div>
        </div>
        <div className="card">
          <div className="h-eyebrow">Connected institutions</div>
          <div className="serif" style={{fontSize: 32, letterSpacing:"-0.02em", marginTop: 6}}>
            {new Set(accounts.map(a=>a.inst)).size}
            <small style={{fontSize: 14, color:"var(--ink-3)"}}> / {accounts.length} accts</small>
          </div>
          <div className="muted" style={{fontSize: 12, marginTop: 4}}>Auto-refreshed daily</div>
        </div>
        <div className="card">
          <div className="h-eyebrow">Last sync</div>
          <div className="serif" style={{fontSize: 32, letterSpacing:"-0.02em", marginTop: 6}}>{lastSync}</div>
          <div className="muted" style={{fontSize: 12, marginTop: 4}}>Liabilities · Investments · Transactions</div>
        </div>
      </section>

      <section className="card">
        <div className="between" style={{marginBottom: 10}}>
          <h2 className="h-section">Connected accounts</h2>
          <button className="btn"><I.Link size={14}/> Link new account</button>
        </div>
        <div>
          {accounts.map(a => (
            <div key={a.id} className="acct-row">
              <div className="acct-icon">{a.icon}</div>
              <div>
                <div style={{fontWeight: 500, fontSize: 13.5}}>{a.inst}</div>
                <div className="muted" style={{fontSize: 11.5}}>{a.type} · ••••{a.id.slice(-4).padStart(4,"0")}</div>
              </div>
              <div>
                <span className={`dot ${a.status === "warn" ? "warn" : ""}`}/>
                <span style={{fontSize: 12, color: a.status === "warn" ? "oklch(0.5 0.13 75)" : "var(--ink-3)"}}>
                  {a.status === "warn" ? "Re-auth required" : "Connected"}
                </span>
              </div>
              <div className="tabular" style={{textAlign:"right", fontWeight: 500, color: a.balance < 0 ? "var(--bad)" : "var(--ink)"}}>
                {a.balance < 0 ? "−" : ""}{fmtMoney(Math.abs(a.balance))}
              </div>
              <div>
                <button className="btn ghost sm"><I.Settings size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid-2">
        <div className="card">
          <h2 className="h-section" style={{marginBottom: 10}}>Data health</h2>
          <div className="ring-wrap" style={{marginBottom: 16}}>
            <div className="ring">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--line-2)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--good)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${0.92 * 213.6} 213.6`}/>
              </svg>
              <div className="ringval">92</div>
            </div>
            <div>
              <div style={{fontSize: 13, fontWeight: 600}}>Confidence score</div>
              <div className="muted" style={{fontSize: 12, marginTop: 3, lineHeight: 1.4}}>
                Aggregated from connection freshness, balance reconciliation, and address verification.
              </div>
            </div>
          </div>
          <div className="col" style={{gap: 10, marginTop: 10}}>
            <CleaningRow ok msg="Address standardized" detail="Verified via Hillside, NJ municipal records"/>
            <CleaningRow ok msg="Outlier removed" detail="Adjusted $5/sqft rehab estimate to regional avg $45/sqft"/>
            <CleaningRow ok msg="Duplicate filtered" detail="Removed redundant balance from linked card"/>
            <CleaningRow warn msg="Manual override detected" detail="Capital Card balance overrides Plaid by −$120"/>
          </div>
        </div>

        <div className="card">
          <h2 className="h-section" style={{marginBottom: 14}}>Recent automations</h2>
          <div className="col" style={{gap: 0}}>
            <AutoRow icon={<I.Zap size={14}/>} title="Auto-pay confirmed" sub="Capital Card · $215.00" time="6 hr ago"/>
            <AutoRow icon={<I.Refresh size={14}/>} title="Balances refreshed" sub="6 of 6 institutions" time="2 hr ago"/>
            <AutoRow icon={<I.Bell size={14}/>} title="Due-date reminder" sub="Auto Loan due in 4 days" time="Yesterday"/>
            <AutoRow icon={<I.Trophy size={14}/>} title="Streak unlocked" sub="7-day on-time payments" time="2 days ago"/>
            <AutoRow icon={<I.Drop size={14}/>} title="Snowflake applied" sub="$320 tax refund → Store Card" time="Mar 28"/>
          </div>
        </div>
      </section>
    </>
  );
}

function CleaningRow({ ok, warn, msg, detail }) {
  return (
    <div className="row" style={{gap: 10, alignItems:"flex-start"}}>
      <div style={{
        width: 18, height: 18, borderRadius: 50, display:"grid", placeItems:"center",
        background: ok ? "var(--good-soft)" : "var(--warn-soft)",
        color: ok ? "var(--good)" : "oklch(0.5 0.12 75)",
        fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1,
      }}>{ok ? "✓" : "!"}</div>
      <div>
        <div style={{fontSize: 12.5, fontWeight: 500}}>{msg}</div>
        <div className="muted" style={{fontSize: 11.5, marginTop: 1}}>{detail}</div>
      </div>
    </div>
  );
}

function AutoRow({ icon, title, sub, time }) {
  return (
    <div style={{display:"grid", gridTemplateColumns:"32px 1fr auto", gap: 10, padding: "10px 0", borderTop:"1px solid var(--line-2)", alignItems:"center"}}>
      <div style={{width: 28, height: 28, borderRadius: 8, background:"var(--accent-soft)", color:"var(--accent)", display:"grid", placeItems:"center"}}>
        {icon}
      </div>
      <div>
        <div style={{fontSize: 13, fontWeight: 500}}>{title}</div>
        <div className="muted" style={{fontSize: 11.5}}>{sub}</div>
      </div>
      <div className="muted" style={{fontSize: 11.5, fontFamily:"var(--font-mono)"}}>{time}</div>
    </div>
  );
}

function AccountsRightPane({}) {
  return (
    <>
      <div className="card tinted-good">
        <div className="row" style={{gap: 10, alignItems:"flex-start"}}>
          <I.Shield size={16} style={{color:"var(--good)"}}/>
          <div>
            <div style={{fontSize: 13, fontWeight: 600}}>Bank-grade encryption</div>
            <div className="muted" style={{fontSize: 12, marginTop: 4, color:"var(--ink-2)"}}>
              Read-only credentials, TLS 1.3 in transit, AES-256 at rest. We never see your password.
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <span className="h-eyebrow">Notifications</span>
        <div className="col" style={{gap: 10, marginTop: 12}}>
          <NotifRow label="Upcoming payments" on/>
          <NotifRow label="Balance over threshold" on/>
          <NotifRow label="Payoff victories" on/>
          <NotifRow label="Strategy re-rank" on={false}/>
          <NotifRow label="Weekly digest" on/>
        </div>
      </div>

      <div className="card">
        <span className="h-eyebrow">Webhooks listening</span>
        <ul style={{listStyle:"none", padding: 0, margin: "12px 0 0", display:"flex", flexDirection:"column", gap: 8, fontFamily:"var(--font-mono)", fontSize: 11.5}}>
          <li><span className="dot"/> NEW_ACCOUNTS_AVAILABLE</li>
          <li><span className="dot"/> LIABILITIES_UPDATE</li>
          <li><span className="dot"/> TRANSACTIONS_UPDATED</li>
          <li><span className="dot warn"/> ITEM_LOGIN_REQUIRED</li>
        </ul>
      </div>
    </>
  );
}

function NotifRow({ label, on }) {
  const [v, setV] = useState(on);
  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap: 10, fontSize: 12.5, minHeight: 22}}>
      <span style={{flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{label}</span>
      <button onClick={() => setV(!v)} style={{
        appearance:"none", border:"none",
        width: 30, height: 17, borderRadius: 999, padding: 0, cursor: "pointer",
        background: v ? "var(--good)" : "var(--line)",
        position:"relative", transition:"background 0.15s",
        flexShrink: 0,
      }}>
        <i style={{
          position:"absolute", top: 2, left: v ? 15 : 2,
          width: 13, height: 13, borderRadius:"50%", background:"#fff",
          transition: "left 0.15s",
        }}/>
      </button>
    </div>
  );
}

Object.assign(window, { AccountsTab, AccountsRightPane });
