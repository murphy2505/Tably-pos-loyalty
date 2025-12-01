// frontend/src/components/pos/PosLayout.tsx
import { Outlet, NavLink, useLocation } from "react-router-dom";
import "./PosLayout.css";

const PosLayout = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === `/pos${path === "" ? "" : `/${path}`}`;

  return (
    <div className="pos-root">
      {/* Topbar met POS titel + hamburger */}
      <header className="pos-topbar">
        <div className="pos-brand">Tably POS</div>
        <button className="pos-hamburger" aria-label="Open POS menu">
          ☰
        </button>
      </header>

      {/* Hoofdcontent: de specifieke POS-pagina’s komen via <Outlet /> */}
      <div className="pos-main">
        <Outlet />
      </div>

      {/* Bottombar met snelle acties (linkt naar je bestaande routes) */}
      <footer className="pos-bottombar">
        <NavLink
          to="/pos/kassa"
          className={isActive("kassa") ? "pos-bottom-btn active" : "pos-bottom-btn"}
        >
          Kassa
        </NavLink>
        <NavLink
          to="/pos/customers"
          className={isActive("customers") ? "pos-bottom-btn active" : "pos-bottom-btn"}
        >
          Klanten
        </NavLink>
        <NavLink
          to="/pos/giftcards"
          className={isActive("giftcards") ? "pos-bottom-btn active" : "pos-bottom-btn"}
        >
          Kadokaart
        </NavLink>
        <NavLink
          to="/pos/planning"
          className={isActive("planning") ? "pos-bottom-btn active" : "pos-bottom-btn"}
        >
          Planning
        </NavLink>
        <NavLink
          to="/pos/kds"
          className={isActive("kds") ? "pos-bottom-btn active" : "pos-bottom-btn"}
        >
          KDS
        </NavLink>
      </footer>
    </div>
  );
};

export default PosLayout;
