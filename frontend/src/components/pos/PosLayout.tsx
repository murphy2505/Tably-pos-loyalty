import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useModules } from "../../context/modulesContext";
import "./PosLayout.css";

const PosLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { modules } = useModules();

  const isActive = (sub: string) => {
    const full = `/pos${sub ? `/${sub}` : ""}`;
    return location.pathname === full;
  };

  return (
    <div className="pos-root">
      <header className="pos-topbar">
        <div className="pos-brand" onClick={() => navigate("/pos/kassa")}>
          Tably POS
        </div>
        <button
          className="pos-hamburger"
          aria-label="Open POS menu"
          onClick={() => {
            console.log("Open POS menu (tafels, printer, SumUp, instellingen)");
          }}
        >
          ☰
        </button>
      </header>

      <div className="pos-main">
        <Outlet />
      </div>

      <footer className="pos-bottombar">
        {modules.pos && (
          <NavLink
            to="/pos/kassa"
            className={
              isActive("kassa") ? "pos-bottom-btn active" : "pos-bottom-btn"
            }
          >
            Kassa
          </NavLink>
        )}

        {/* tafels kun je later koppelen aan losse module als je wilt */}
        <NavLink
          to="/pos/tables"
          className={
            isActive("tables") ? "pos-bottom-btn active" : "pos-bottom-btn"
          }
        >
          Tafels
        </NavLink>

        {modules.kds && (
          <NavLink
            to="/pos/kds"
            className={
              isActive("kds") ? "pos-bottom-btn active" : "pos-bottom-btn"
            }
          >
            KDS
          </NavLink>
        )}

        {modules.customers && (
          <NavLink to="/dashboard/customers" className="pos-bottom-btn">
            Klanten
          </NavLink>
        )}

        {modules.loyalty && (
          <NavLink to="/dashboard/settings" className="pos-bottom-btn">
            Kadokaart / Loyalty
          </NavLink>
        )}

        {modules.settings && (
          <NavLink to="/dashboard/settings" className="pos-bottom-btn">
            Planning
          </NavLink>
        )}
      </footer>
    </div>
  );
};

export default PosLayout;
