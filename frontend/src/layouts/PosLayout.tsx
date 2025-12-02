import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const posTabs = [
  { to: "/pos", label: "Kassa", exact: true },
  { to: "/pos/orders", label: "Bestellingen" },
  { to: "/pos/products", label: "Producten" },
  { to: "/pos/categories", label: "Categorieën" },
  { to: "/pos/report-groups", label: "Omzetgroepen" },
  { to: "/pos/stock", label: "Voorraad" },
  { to: "/pos/kds", label: "KDS" },
  { to: "/pos/reports/daily", label: "Rapportage" },
  { to: "/pos/settings", label: "Instellingen" },
];

const PosLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isKassa = location.pathname === "/pos" || location.pathname === "/pos/";

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-950">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-3 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900 hover:bg-slate-800"
              onClick={() => navigate("/dashboard")}
            >
              <span className="sr-only">Terug naar Dashboard</span>
              ←
            </button>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Tably · POS
              </div>
              <div className="text-sm font-medium text-slate-100">
                ’t Centrum – Kassa omgeving
              </div>
            </div>
          </div>

          {/* POS tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            {posTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.exact}
                className={({ isActive }) =>
                  [
                    "px-3 py-1.5 rounded-full border text-xs font-medium transition",
                    isActive
                      ? "bg-sky-500 text-slate-950 border-sky-400"
                      : "bg-slate-900/70 text-slate-300 border-slate-700 hover:border-sky-500/60 hover:text-sky-100",
                  ].join(" ")
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Content + bottom bar wrapper */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 mx-auto w-full max-w-6xl px-3 py-3">
          <Outlet />
        </main>

        {/* Bottom bar alleen tonen in kassascherm (nu skeleton) */}
        {isKassa && (
          <footer className="border-t border-slate-800 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto max-w-6xl px-3 py-2 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 hover:bg-sky-600/90 hover:text-slate-950 transition">
                  Bestellingen
                </button>
                <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700 transition">
                  Tafelbonnen
                </button>
                <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700 transition">
                  Planning
                </button>
                <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700 transition">
                  Kadokaart
                </button>
                <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700 transition">
                  Print laatste bon
                </button>
              </div>
              <div className="text-[10px] text-slate-500">
                Kassier: <span className="text-slate-300">Ingelogd</span>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default PosLayout;
