import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export default function MainShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-root">
      <header className="dashboard-header">
        <div className="dashboard-header-left">Tably</div>
        <nav className="dashboard-header-right">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              "dashboard-nav-item" + (isActive ? " active" : "")
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/pos"
            className={({ isActive }) =>
              "dashboard-nav-item" + (isActive ? " active" : "")
            }
          >
            POS
          </NavLink>
          <NavLink
            to="/loyalty"
            className={({ isActive }) =>
              "dashboard-nav-item" + (isActive ? " active" : "")
            }
          >
            Loyalty
          </NavLink>
        </nav>
      </header>
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
