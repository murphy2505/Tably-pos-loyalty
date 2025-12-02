import { NavLink, Outlet } from "react-router-dom";
import { ModulesProvider, useModules } from "../context/modulesContext";
import "./MainShell.css";

const MainShellInner = () => {
  const { modules } = useModules();

  return (
    <div className="tably-root">
      <aside className="tably-sidebar">
        <div className="tably-logo">Tably</div>

        <nav className="tably-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "tably-nav-link active" : "tably-nav-link"
            }
          >
            Dashboard
          </NavLink>

          {modules.pos && (
            <NavLink
              to="/pos"
              className={({ isActive }) =>
                isActive ? "tably-nav-link active" : "tably-nav-link"
              }
            >
              POS
            </NavLink>
          )}

          {modules.loyalty && (
            <NavLink
              to="/loyalty"
              className={({ isActive }) =>
                isActive ? "tably-nav-link active" : "tably-nav-link"
              }
            >
              Loyalty
            </NavLink>
          )}
        </nav>
      </aside>

      {/* PAGE CONTENT LOADER */}
      <main className="tably-main">
        <Outlet />
      </main>
    </div>
  );
};

const MainShell = () => {
  return (
    <ModulesProvider>
      <MainShellInner />
    </ModulesProvider>
  );
};

export default MainShell;
