// icons.jsx — minimal stroke icons

const Icon = ({ d, size = 16, stroke = "currentColor", strokeWidth = 1.6, fill = "none", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

const I = {
  Roadmap: (p) => <Icon {...p}><path d="M4 19h16M6 19V9l4-3 4 3v10M14 19V13l3-2 3 2v6"/></Icon>,
  Inventory: (p) => <Icon {...p}><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M9 5v14"/></Icon>,
  Sim: (p) => <Icon {...p}><circle cx="12" cy="12" r="8"/><path d="M12 6v6l4 2"/></Icon>,
  Accounts: (p) => <Icon {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/></Icon>,
  Goals: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></Icon>,
  Bell: (p) => <Icon {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16zM10 20a2 2 0 0 0 4 0"/></Icon>,
  Search: (p) => <Icon {...p}><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></Icon>,
  Plus: (p) => <Icon {...p} d="M12 5v14M5 12h14"/>,
  Trash: (p) => <Icon {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></Icon>,
  Edit: (p) => <Icon {...p}><path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4"/></Icon>,
  Drag: (p) => <Icon {...p}><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></Icon>,
  Trophy: (p) => <Icon {...p}><path d="M8 4h8v4a4 4 0 0 1-8 0V4zM8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3M10 14h4v3h2v3H8v-3h2v-3z"/></Icon>,
  Flame: (p) => <Icon {...p}><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/></Icon>,
  Check: (p) => <Icon {...p} d="M5 13l4 4L19 7"/>,
  Lock: (p) => <Icon {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Icon>,
  Up: (p) => <Icon {...p} d="M5 14l7-7 7 7"/>,
  Down: (p) => <Icon {...p} d="M5 10l7 7 7-7"/>,
  Spark: (p) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/></Icon>,
  Refresh: (p) => <Icon {...p}><path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M18 4v5h-5M6 20v-5h5"/></Icon>,
  Settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4.9a7 7 0 0 0-2.1-1.2L14 3h-4l-.4 2.5a7 7 0 0 0-2.1 1.2L5.1 5.8l-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.9a7 7 0 0 0 2.1 1.2L10 21h4l.4-2.5a7 7 0 0 0 2.1-1.2l2.4.9 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z"/></Icon>,
  Bolt: (p) => <Icon {...p} d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>,
  Shield: (p) => <Icon {...p} d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/>,
  Warning: (p) => <Icon {...p}><path d="M12 4l10 17H2L12 4zM12 10v5M12 18v.5"/></Icon>,
  Link: (p) => <Icon {...p}><path d="M10 14a4 4 0 0 1 0-6l3-3a4 4 0 0 1 6 6l-1 1M14 10a4 4 0 0 1 0 6l-3 3a4 4 0 0 1-6-6l1-1"/></Icon>,
  Calendar: (p) => <Icon {...p}><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></Icon>,
  Drop: (p) => <Icon {...p}><path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/></Icon>,
  Zap: (p) => <Icon {...p} d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>,
  Tree: (p) => <Icon {...p}><path d="M12 3l5 7h-3l4 6h-4l3 4H7l3-4H6l4-6H7l5-7zM12 20v2"/></Icon>,
  Snow: (p) => <Icon {...p}><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19M9 4l3 2 3-2M9 20l3-2 3 2"/></Icon>,
};

window.I = I;
window.Icon = Icon;
