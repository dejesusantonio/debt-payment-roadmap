// app.jsx — main shell

const { useReducer } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#3a3aaa",
  "density": "regular",
  "dark": false,
  "strategy": "avalanche",
  "extraPay": 450,
  "showFlip": true,
  "tone": "coach"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = useState("roadmap");
  const [debts, setDebts] = useState(SAMPLE_DEBTS);
  const [accounts] = useState(SAMPLE_ACCOUNTS);
  const [badges, setBadges] = useState(BADGE_DEFS);
  const [streak, setStreak] = useState(7);
  const [logOpen, setLogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [flipState, setFlipState] = useState({
    loanAmount: 42000, vestedBalance: 86400, loanRate: 8.5, termYears: 5, marketRate: 7,
    purchase: 185000, rehab: 38000, arv: 285000, holdMonths: 5,
    currentTax: 22, retireTax: 18,
  });
  const [simStrategy, setSimStrategy] = useState("flip");
  const [hustleState, setHustleState] = useState({
    rideshare: { hoursPerWeek: 14, hourlyGross: 24, milesPerHour: 18, platformCut: 25, weeksOn: 12 },
    delivery:  { hoursPerWeek: 12, deliveriesPerHour: 2.5, payPerDelivery: 7.5, milesPerDelivery: 3.5, weeksOn: 12 },
    freelance: { billableHours: 8, rate: 75, platformCut: 10, rampWeeks: 2, weeksOn: 12 },
    sell:      { items: 35, avgPrice: 28, sellThrough: 60, platform: 10, weeksOn: 6 },
  });
  const setHustle = (sid, k, v) => setHustleState(s => ({ ...s, [sid]: { ...s[sid], [k]: v }}));

  const setFlip = (k, v) => setFlipState(s => ({ ...s, [k]: v }));

  // sync tweaks → app state
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", oklchFromHex(t.accent));
    document.documentElement.style.setProperty("--accent-2", oklchFromHex(t.accent, 0.62));
    document.documentElement.style.setProperty("--accent-soft", oklchSoftFromHex(t.accent));
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.accent, t.dark, t.density]);

  const strategy = t.strategy;
  const setStrategy = (v) => setTweak("strategy", v);
  const extraPay = t.extraPay;
  const setExtraPay = (v) => setTweak("extraPay", v);

  const updateDebt = (id, patch) => setDebts(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));
  const removeDebt = (id) => setDebts(prev => prev.filter(d => d.id !== id));
  const addDebt = (d) => setDebts(prev => [...prev, { ...d, id: "d" + Math.random().toString(36).slice(2,8) }]);

  const logPayment = (debtId, amount) => {
    const d = debts.find(x => x.id === debtId);
    if (!d) return;
    const nextBal = Math.max(0, d.balance - amount);
    updateDebt(debtId, { balance: nextBal });
    setStreak(s => s + 1);
    setToast({ msg: `Logged ${fmtMoney(amount)} on ${d.name}`, kind: "ok" });
    setTimeout(() => setToast(null), 2400);
    if (nextBal === 0) {
      setBadges(prev => prev.map(b => b.id === "kill1" ? { ...b, achieved: true } : b));
      setTimeout(() => {
        setToast({ msg: `🏆 Knockout! ${d.name} closed forever.`, kind: "celebration" });
        setTimeout(() => setToast(null), 3000);
      }, 600);
    }
  };

  const renderTab = () => {
    switch (tab) {
      case "roadmap":
        return <RoadmapTab debts={debts} strategy={strategy} extraPay={extraPay}
                           setExtraPay={setExtraPay} logPayment={logPayment} openLog={() => setLogOpen(true)}/>;
      case "inventory":
        return <InventoryTab debts={debts} setDebts={setDebts} strategy={strategy} setStrategy={setStrategy}
                             openAdd={() => setAddOpen(true)} removeDebt={removeDebt} updateDebt={updateDebt}/>;
      case "simulator":
        return <SimulatorTab flipState={flipState} setFlip={setFlip}
                             simStrategy={simStrategy} setSimStrategy={setSimStrategy}
                             hustleState={hustleState} setHustle={setHustle}/>;
      case "accounts":
        return <AccountsTab accounts={accounts} lastSync="2 min ago"/>;
      default: return null;
    }
  };

  const renderRight = () => {
    switch (tab) {
      case "roadmap":
        return <RoadmapRightPane debts={debts} strategy={strategy} extraPay={extraPay}
                                 openLog={() => setLogOpen(true)} logPayment={logPayment}
                                 badges={badges} streak={streak}/>;
      case "inventory":
        return <InventoryRightPane debts={debts}/>;
      case "simulator":
        return <SimulatorRightPane flipState={flipState} simStrategy={simStrategy} hustleState={hustleState}/>;
      case "accounts":
        return <AccountsRightPane/>;
      default: return null;
    }
  };

  const navItems = [
    { id: "roadmap", label: "Roadmap", icon: <I.Roadmap size={15}/> },
    { id: "inventory", label: "Inventory", icon: <I.Inventory size={15}/>, badge: debts.length },
    { id: "simulator", label: "Simulator", icon: <I.Sim size={15}/>, badge: t.showFlip ? "5" : null },
    { id: "accounts", label: "Accounts", icon: <I.Accounts size={15}/> },
  ].filter(n => n.id !== "simulator" || t.showFlip);

  const tabLabels = { roadmap: "Roadmap", inventory: "Debt inventory", simulator: "Strategy simulator", accounts: "Accounts & data" };

  return (
    <div className="app" data-screen-label={tabLabels[tab]}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div className="brand-name">Throughline</div>
        </div>

        <div>
          <div className="nav-section">Workspace</div>
          {navItems.map(n => (
            <button key={n.id} className="nav-item" aria-current={tab === n.id ? "page" : undefined} onClick={() => setTab(n.id)}>
              <span className="ico">{n.icon}</span>
              <span>{n.label}</span>
              {n.badge != null && <span className="badge">{n.badge}</span>}
            </button>
          ))}
        </div>

        <div>
          <div className="nav-section">Activity</div>
          <button className="nav-item"><span className="ico"><I.Goals size={15}/></span><span>Goals</span></button>
          <button className="nav-item"><span className="ico"><I.Bell size={15}/></span><span>Notifications</span><span className="badge">3</span></button>
        </div>

        <div className="streak-card">
          <div className="row" style={{gap: 8, alignItems:"center"}}>
            <div style={{width: 22, height: 22, borderRadius: 6, background:"var(--warn-soft)", color:"var(--warn)", display:"grid", placeItems:"center"}}><I.Flame size={13}/></div>
            <span style={{fontSize: 11, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--ink-4)", fontWeight: 600}}>Streak</span>
          </div>
          <div className="num">{streak}<small style={{fontSize:14, color:"var(--ink-3)", marginLeft:4}}>wks</small></div>
          <div className="lbl">{12 - streak} until next badge</div>
          <div className="streak-dots">
            {Array.from({length: 12}).map((_,i) => <i key={i} className={i < streak ? "on" : i === streak ? "today" : ""}/>)}
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="crumbs">
            <span>Workspace</span> <span>›</span> <strong>{tabLabels[tab]}</strong>
          </div>
          <div className="grow"/>
          <div className="search">
            <I.Search size={13}/>
            <span>Search debts, accounts…</span>
            <kbd>⌘K</kbd>
          </div>
          <button className="btn"><I.Refresh size={14}/> Sync</button>
          <button className="btn primary" onClick={() => setLogOpen(true)}><I.Plus size={14}/> Log payment</button>
          <div className="avatar">JM</div>
        </div>

        <div className="page">
          <div className="canvas">
            <PageHeader tab={tab} debts={debts} streak={streak} tone={t.tone}/>
            {renderTab()}
          </div>
          <aside className="rightpane">
            {renderRight()}
          </aside>
        </div>
      </main>

      {logOpen && <LogModal debts={debts} onClose={() => setLogOpen(false)} onSave={(id, amt) => { logPayment(id, amt); setLogOpen(false); }}/>}
      {addOpen && <AddDebtModal onClose={() => setAddOpen(false)} onSave={(d) => { addDebt(d); setAddOpen(false); }}/>}
      {toast && <Toast msg={toast.msg} kind={toast.kind}/>}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme"/>
        <TweakColor label="Accent" value={t.accent} onChange={v => setTweak("accent", v)}/>
        <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak("dark", v)}/>
        <TweakRadio label="Density" value={t.density} options={["compact","regular","comfortable"]} onChange={v => setTweak("density", v)}/>

        <TweakSection label="Strategy"/>
        <TweakRadio label="Method" value={t.strategy}
                    options={[{value:"snowball",label:"Snow"},{value:"avalanche",label:"Aval"},{value:"custom",label:"Custom"}]}
                    onChange={v => setTweak("strategy", v)}/>
        <TweakSlider label="Extra / month" value={t.extraPay} min={0} max={2000} step={25} unit="$" onChange={v => setTweak("extraPay", v)}/>

        <TweakSection label="Modules"/>
        <TweakToggle label="Strategy simulator" value={t.showFlip} onChange={v => { setTweak("showFlip", v); if (!v && tab === "simulator") setTab("roadmap"); }}/>

        <TweakSection label="Voice"/>
        <TweakRadio label="Tone" value={t.tone} options={[{value:"coach",label:"Coach"},{value:"calm",label:"Calm"},{value:"game",label:"Boss"},{value:"dry",label:"Dry"}]} onChange={v => setTweak("tone", v)}/>
      </TweaksPanel>
    </div>
  );
}

function PageHeader({ tab, debts, streak, tone }) {
  const balance = debts.reduce((s,d)=>s+d.balance, 0);
  const lines = {
    roadmap: {
      coach:  { eyebrow: "Tuesday · April 25", title: <>You're on pace.<br/><span style={{color:"var(--ink-3)"}}>Three years and counting until zero.</span></> },
      calm:   { eyebrow: "Today · April 25", title: <>Your roadmap to zero.<br/><span style={{color:"var(--ink-3)"}}>Calm, deliberate, on schedule.</span></> },
      game:   { eyebrow: "Mission control", title: <>5 bosses remaining.<br/><span style={{color:"var(--ink-3)"}}>Capital Card is on the ropes.</span></> },
      dry:    { eyebrow: "Overview", title: <>Debt roadmap.<br/><span style={{color:"var(--ink-3)"}}>{fmtMoney(balance)} across 5 accounts.</span></> },
    },
    inventory: {
      coach:  { eyebrow: "Inventory", title: <>Every debt, in one place.<br/><span style={{color:"var(--ink-3)"}}>Pick a strategy and let the math sort it.</span></> },
      calm:   { eyebrow: "Inventory", title: <>The full picture.<br/><span style={{color:"var(--ink-3)"}}>Five accounts. One plan.</span></> },
      game:   { eyebrow: "Lineup", title: <>The boss list.<br/><span style={{color:"var(--ink-3)"}}>Rank them however you'll defeat them.</span></> },
      dry:    { eyebrow: "Liabilities", title: <>Active liabilities.<br/><span style={{color:"var(--ink-3)"}}>Sortable, editable, drag-rankable.</span></> },
    },
    simulator: {
      coach:  { eyebrow: "Strategy sandbox", title: <>Pick a path to extra cash.<br/><span style={{color:"var(--ink-3)"}}>Five strategies, one math engine.</span></> },
      calm:   { eyebrow: "Strategy sandbox", title: <>The hypothetical.<br/><span style={{color:"var(--ink-3)"}}>Stress-test before you commit.</span></> },
      game:   { eyebrow: "Power-up", title: <>Choose your weapon.<br/><span style={{color:"var(--ink-3)"}}>Flip, drive, deliver, freelance, sell.</span></> },
      dry:    { eyebrow: "Simulator", title: <>Strategy simulator.<br/><span style={{color:"var(--ink-3)"}}>Net cash modeling for 5 income strategies.</span></> },
    },
    accounts: {
      coach:  { eyebrow: "Connections", title: <>The numbers, fresh.<br/><span style={{color:"var(--ink-3)"}}>Pulled live from every connected institution.</span></> },
      calm:   { eyebrow: "Connections", title: <>Connected accounts.<br/><span style={{color:"var(--ink-3)"}}>Synced and reconciled.</span></> },
      game:   { eyebrow: "Inventory", title: <>The arsenal.<br/><span style={{color:"var(--ink-3)"}}>Every account in your kit.</span></> },
      dry:    { eyebrow: "Connections", title: <>Linked accounts.<br/><span style={{color:"var(--ink-3)"}}>Read-only, encrypted, refreshed daily.</span></> },
    },
  };
  const set = lines[tab] || lines.roadmap;
  const v = set[tone] || set.coach;
  return (
    <div style={{margin: "8px 0 4px"}}>
      <div className="h-eyebrow" style={{marginBottom: 8}}>{v.eyebrow}</div>
      <h1 className="h-display">{v.title}</h1>
    </div>
  );
}

function LogModal({ debts, onClose, onSave }) {
  const [debtId, setDebtId] = useState(debts[0].id);
  const [amount, setAmount] = useState(250);
  const d = debts.find(x => x.id === debtId);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Log a payment</h3>
        <div className="form-row">
          <label>Debt</label>
          <select value={debtId} onChange={e => setDebtId(e.target.value)}>
            {debts.map(d => <option key={d.id} value={d.id}>{d.name} · {fmtMoney(d.balance)}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value) || 0)}/>
        </div>
        <div className="row" style={{gap: 8, marginTop: 8, flexWrap: "wrap"}}>
          {[d?.min, 250, 500, 1000].map((v,i) => (
            <button key={i} className="btn sm" onClick={() => setAmount(v)}>{fmtMoney(v)}</button>
          ))}
        </div>
        <div className="row" style={{justifyContent:"flex-end", gap: 8, marginTop: 24}}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onSave(debtId, amount)}><I.Check size={14}/> Log payment</button>
        </div>
      </div>
    </div>
  );
}

function AddDebtModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", kind: "Credit Card", balance: 0, apr: 19.99, min: 50,
                                       color: "oklch(0.55 0.15 320)", initials: "??" });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v, initials: k === "name" ? v.slice(0,2).toUpperCase() : f.initials }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Add a debt</h3>
        <div className="form-row">
          <label>Creditor name</label>
          <input value={form.name} placeholder="e.g. Northbridge MasterCard" onChange={e => update("name", e.target.value)}/>
        </div>
        <div className="grid-2">
          <div className="form-row">
            <label>Type</label>
            <select value={form.kind} onChange={e => update("kind", e.target.value)}>
              <option>Credit Card</option><option>Auto</option><option>Student</option>
              <option>Personal</option><option>Mortgage</option><option>Other</option>
            </select>
          </div>
          <div className="form-row">
            <label>APR (%)</label>
            <input type="number" step="0.01" value={form.apr} onChange={e => update("apr", Number(e.target.value))}/>
          </div>
        </div>
        <div className="grid-2">
          <div className="form-row">
            <label>Balance</label>
            <input type="number" value={form.balance} onChange={e => update("balance", Number(e.target.value))}/>
          </div>
          <div className="form-row">
            <label>Min payment</label>
            <input type="number" value={form.min} onChange={e => update("min", Number(e.target.value))}/>
          </div>
        </div>
        <div className="row" style={{justifyContent:"flex-end", gap: 8, marginTop: 12}}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!form.name} onClick={() => onSave(form)}><I.Plus size={14}/> Add</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, kind }) {
  return <div className="toast"><span className="ok-dot"/>{msg}</div>;
}

// ── color helpers ──
function oklchFromHex(hex, l) {
  // approximate hex→oklch mapping (we accept hex from color picker, give a flat fallback)
  const { r, g, b } = hexToRgb(hex);
  const [L, a, B] = rgbToOklab(r, g, b);
  const c = Math.sqrt(a*a + B*B);
  let h = Math.atan2(B, a) * 180 / Math.PI; if (h < 0) h += 360;
  return `oklch(${(l ?? L).toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}
function oklchSoftFromHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [L, a, B] = rgbToOklab(r, g, b);
  const c = Math.sqrt(a*a + B*B);
  let h = Math.atan2(B, a) * 180 / Math.PI; if (h < 0) h += 360;
  return `oklch(0.94 ${(c * 0.4).toFixed(3)} ${h.toFixed(1)})`;
}
function hexToRgb(hex) {
  const m = hex.replace("#","");
  const v = m.length === 3 ? m.split("").map(c=>c+c).join("") : m;
  return { r: parseInt(v.slice(0,2),16)/255, g: parseInt(v.slice(2,4),16)/255, b: parseInt(v.slice(4,6),16)/255 };
}
function rgbToOklab(r,g,b) {
  const f = (c) => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
  r=f(r); g=f(g); b=f(b);
  const l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b;
  const m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b;
  const s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return [
    0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
    1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
    0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_,
  ];
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
