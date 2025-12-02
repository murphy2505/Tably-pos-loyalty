import { Link } from "react-router-dom";

type ModuleTileProps = {
  title: string;
  description: string;
  status?: "active" | "coming-soon";
  to?: string;
};

const ModuleTile = ({ title, description, status = "active", to }: ModuleTileProps) => {
  const isComingSoon = status === "coming-soon";

  const content = (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 flex flex-col gap-3 hover:border-sky-500/70 transition">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium uppercase tracking-wide text-slate-400">
          {title}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isComingSoon
              ? "bg-slate-700 text-slate-300"
              : "bg-emerald-500/15 text-emerald-300"
          }`}
        >
          {isComingSoon ? "Binnenkort" : "Actief"}
        </span>
      </div>
      <p className="text-sm text-slate-300/90">{description}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/80" />
          Module
        </div>
        {to && !isComingSoon && (
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/90 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-sky-400 transition">
            Openen
          </span>
        )}
      </div>
    </div>
  );

  if (to && !isComingSoon) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

const DashboardOverview = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Overzicht van modules en activiteiten voor deze locatie.
          </p>
        </div>
        {/* placeholder voor locatienaam / switcher */}
        <div className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
          PROD · ’t Centrum
        </div>
      </header>

      {/* Modules grid */}
      <section className="mt-2">
        <h2 className="text-sm font-medium text-slate-300 mb-3">Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* POS kernfunctionaliteit */}
          <ModuleTile
            title="Kassa"
            description="Ga direct naar het kassascherm."
            to="/pos/kassa"
          />
          <ModuleTile
            title="Producten"
            description="Beheer alle producten."
            to="/pos/products"
          />
          <ModuleTile
            title="Categorieën"
            description="Beheer productcategorieën."
            to="/pos/categories"
          />
          <ModuleTile
            title="Voorraad"
            description="Bekijk en beheer voorraad."
            to="/pos/stock"
          />
          <ModuleTile
            title="KDS"
            description="Keukenscherm voor openstaande tickets."
            to="/pos/kds"
          />
          <ModuleTile
            title="Rapportage"
            description="Dagtotalen en rapporten."
            to="/pos/reports"
          />
          <ModuleTile
            title="Klanten"
            description="Zoek en koppel klanten (loyalty)."
            to="/pos/customers"
          />
          <ModuleTile
            title="Kadokaarten"
            description="Tegoed- en cadeaukaarten beheer."
            to="/pos/giftcards"
          />

          {/* Toekomstig */}
          <ModuleTile
            title="Planning"
            description="Reserveringen en planning."
            to="/pos/planning"
          />
          <ModuleTile
            title="Webshop"
            description="Online bestellen en koppeling met kassa."
            status="coming-soon"
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;
