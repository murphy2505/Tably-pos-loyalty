import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">Tablie Dashboard</div>
        <nav className="dashboard-nav">
          <NavLink
            to="/dashboard/customers"
            className={({ isActive }) =>
              "dashboard-nav-item" + (isActive ? " active" : "")
            }
          >
            Customers
          </NavLink>
          <NavLink
            to="/dashboard/pos"
            className={({ isActive }) =>
              "dashboard-nav-item" + (isActive ? " active" : "")
            }
          >
            POS
          </NavLink>
          <NavLink
            to="/dashboard/loyalty"
            className={({ isActive }) =>
              "dashboard-nav-item" + (isActive ? " active" : "")
            }
          >
            Loyalty
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              "dashboard-nav-item" + (isActive ? " active" : "")
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-left">Tablie Dashboard</div>
          <div className="dashboard-header-right">
            <span className="env-chip">PROD · 't Centrum</span>
            <span className="user-chip">Mervyn</span>
          </div>
        </header>
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
