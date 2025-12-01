import { useNavigate } from "react-router-dom";
import { useModules } from "../../context/modulesContext";
import type { ModuleKey } from "../../context/modulesContext";
import "./DashboardPage.css";

interface ModuleCard {
  key: ModuleKey;
  name: string;
  description: string;
  route: string;
}

const MODULES: ModuleCard[] = [
  {
    key: "pos",
    name: "POS",
    description: "Kassascherm en tafels voor de verkoop.",
    route: "/pos/kassa",
  },
  {
    key: "kds",
    name: "KDS",
    description: "Keukenscherm voor openstaande tickets.",
    route: "/dashboard/kds",
  },
  {
    key: "products",
    name: "Producten",
    description: "Beheer producten, prijzen en btw.",
    route: "/dashboard/products",
  },
  {
    key: "categories",
    name: "Categorieën",
    description: "Structuur van je kassa en menukaarten.",
    route: "/dashboard/categories",
  },
  {
    key: "stock",
    name: "Voorraad",
    description: "Voorraadstanden en derving bijwerken.",
    route: "/dashboard/stock",
  },
  {
    key: "customers",
    name: "Klanten / Loyalty",
    description: "Klanten, wallets en punten inzien.",
    route: "/dashboard/customers",
  },
  {
    key: "loyalty",
    name: "Loyalty",
    description: "Spaarkaarten, punten en beloningen.",
    route: "/loyalty",
  },
  {
    key: "settings",
    name: "Instellingen",
    description: "Printers, SumUp en POS-instellingen.",
    route: "/dashboard/settings",
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { modules, toggleModule } = useModules();

  return (
    <div className="dash-page-root">
      <header className="dash-page-header">
        <div>
          <h1>Tablie Dashboard</h1>
          <p>Overzicht van alle modules voor deze locatie.</p>
        </div>
        <div className="dash-page-meta">
          <span className="dash-chip">PROD · ’t Centrum</span>
          <span className="dash-chip soft">Modules beheer</span>
        </div>
      </header>

      <section className="dash-section">
        <h2>Modules</h2>
        <p className="dash-section-sub">
          Schakel modules in of uit. Later koppel je dit aan je abonnement /
          verkoopmodel.
        </p>

        <div className="dash-modules-grid">
          {MODULES.map((m) => {
            const active = modules[m.key];
            return (
              <div key={m.key} className="dash-module-card">
                <div className="dash-module-head">
                  <h3>{m.name}</h3>
                  <span className={active ? "status-pill on" : "status-pill off"}>
                    {active ? "Actief" : "Uit"}
                  </span>
                </div>
                <p className="dash-module-desc">{m.description}</p>

                <div className="dash-module-footer">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleModule(m.key)}
                    />
                    <span className="slider" />
                  </label>

                  <button
                    className="dash-open-btn"
                    onClick={() => navigate(m.route)}
                    disabled={!active}
                  >
                    Openen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
