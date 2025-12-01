import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const location = useLocation();

  const linkClass = (path: string) => {
    const full = `/dashboard${path ? `/${path}` : ""}`;
    const isActive = location.pathname === full;
    return isActive ? "dash-toplink active" : "dash-toplink";
  };

  return (
    <div className="dash-root">
      <header className="dash-header">
        <div className="dash-title">Tablie Dashboard</div>
        <nav className="dash-topnav">
          <NavLink to="/dashboard" className={linkClass("")}>
            Overzicht
          </NavLink>
          <NavLink to="/dashboard/customers" className={linkClass("customers")}>
            Klanten
          </NavLink>
          <NavLink to="/dashboard/products" className={linkClass("products")}>
            Producten
          </NavLink>
          <NavLink
            to="/dashboard/categories"
            className={linkClass("categories")}
          >
            Categorieën
          </NavLink>
          <NavLink to="/dashboard/stock" className={linkClass("stock")}>
            Voorraad
          </NavLink>
          <NavLink to="/dashboard/kds" className={linkClass("kds")}>
            KDS
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={linkClass("settings")}
          >
            Instellingen
          </NavLink>
        </nav>
      </header>

      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
