import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type UserRole = "employee" | "manager" | "admin";

interface POSSidebarProps {
  open: boolean;
  onClose(): void;
  role: UserRole;
}

function canAccess(role: UserRole, key: string) {
  if (role === "admin" || role === "manager") return true;
  // employee alleen kassa
  return key === "cashier";
}

const items: { key: string; label: string; path: string }[] = [
  { key: "cashier", label: "Kassa", path: "/pos" },
  { key: "products", label: "Producten & voorraad", path: "/pos/products" },
  { key: "reservations", label: "Reserveringen", path: "/pos/reservations" },
  { key: "kds", label: "KDS", path: "/pos/kds" },
];

export default function POSSidebar({ open, onClose, role }: POSSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Sluit bij routechange
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function handleClick(to: string) {
    navigate(to);
    onClose();
  }

  return (
    <aside className={"pos-sidebar" + (open ? " open" : "")} role="navigation">
      <div className="pos-sidebar-header">
        <div className="pos-sidebar-title">POS Menu</div>
        <button className="pos-sidebar-close" type="button" onClick={onClose}>
          ✕
        </button>
      </div>
      <nav className="pos-sidebar-nav">
        {items.filter(i => canAccess(role, i.key)).map(i => (
          <button
            key={i.key}
            type="button"
            onClick={() => handleClick(i.path)}
            className={
              "pos-menu-item" + (location.pathname === i.path ? " is-active" : "")
            }
          >
            {i.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
