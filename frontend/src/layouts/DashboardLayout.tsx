// src/css/layouts/DashboardLayout.tsx
import { Outlet, NavLink, useLocation } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === `/dashboard${path === "" ? "" : `/${path}`}`;

  return (
    <div className="dashboard-layout-root">
      <header className="dashboard-layout-header">
        <div className="dashboard-layout-title">
          Dashboard
        </div>
        <nav className="dashboard-layout-topnav">
          <NavLink
            to="/dashboard"
            className={isActive("") ? "dash-toplink active" : "dash-toplink"}
          >
            Overzicht
          </NavLink>
          <NavLink
            to="/dashboard/products"
            className={isActive("products") ? "dash-toplink active" : "dash-toplink"}
          >
            Producten
          </NavLink>
          <NavLink
            to="/dashboard/categories"
            className={isActive("categories") ? "dash-toplink active" : "dash-toplink"}
          >
            Categorieën
          </NavLink>
          <NavLink
            to="/dashboard/stock"
            className={isActive("stock") ? "dash-toplink active" : "dash-toplink"}
          >
            Voorraad
          </NavLink>
          <NavLink
            to="/dashboard/customers"
            className={isActive("customers") ? "dash-toplink active" : "dash-toplink"}
          >
            Klanten
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={isActive("settings") ? "dash-toplink active" : "dash-toplink"}
          >
            Instellingen
          </NavLink>
        </nav>
      </header>

      <main className="dashboard-layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
