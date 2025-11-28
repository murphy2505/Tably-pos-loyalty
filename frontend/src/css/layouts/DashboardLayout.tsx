import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">Tablie Dashboard</div>
        <nav className="dashboard-nav">
          <NavLink to="/dashboard/customers" className="dashboard-nav-item">
            Customers
          </NavLink>
          <NavLink to="/dashboard/pos" className="dashboard-nav-item">
            POS
          </NavLink>
          <NavLink to="/dashboard/loyalty" className="dashboard-nav-item">
            Loyalty
          </NavLink>
          <NavLink to="/dashboard/settings" className="dashboard-nav-item">
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
