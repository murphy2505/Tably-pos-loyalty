import { Outlet } from "react-router-dom";
import { useState } from "react";
import POSMenuButton from "./POSMenuButton";
import POSSidebar from "./POSSidebar";
import POSSidebarOverlay from "./POSSidebarOverlay";

export type MenuItem = { label: string; to: string; key: string };

const menuItems: MenuItem[] = [
  { key: "cashier", label: "Kassa", to: "/pos/kassa" },
  { key: "products", label: "Producten", to: "/pos/products" },
  { key: "categories", label: "Categorieën", to: "/pos/categories" },
  { key: "stock", label: "Voorraad", to: "/pos/stock" },
  { key: "kds", label: "KDS", to: "/pos/kds" },
  { key: "reports", label: "Rapportage", to: "/pos/reports" },
  { key: "customers", label: "Klanten", to: "/pos/customers" },
  { key: "giftcards", label: "Kadokaarten", to: "/pos/giftcards" },
  { key: "planning", label: "Planning", to: "/pos/planning" },
  { key: "settings", label: "Instellingen", to: "/pos/settings" },
];

export default function PosLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pos-layout">
      <header className="pos-layout-header">
        <POSMenuButton onClick={() => setOpen(true)} />
        <div className="pos-layout-title">Tably POS</div>
      </header>

      <POSSidebar open={open} onClose={() => setOpen(false)} items={menuItems} />
      <POSSidebarOverlay open={open} onClose={() => setOpen(false)} />

      <main className="pos-layout-content">
        <Outlet />
      </main>
    </div>
  );
}
