// frontend/src/components/pos/PosLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";

import POSMenuButton from "./POSMenuButton";
import POSSidebar from "./POSSidebar";
import POSSidebarOverlay from "./POSSidebarOverlay";
import { posMenu, type MenuItem } from "./menuConfig";

export default function PosLayout() {
  const [open, setOpen] = useState(false);
  const items: MenuItem[] = posMenu;

  return (
    <div className="pos-shell">
      {/* Topbar */}
      <header className="pos-topbar">
        <POSMenuButton onClick={() => setOpen(true)} />
        <div className="pos-topbar-title">Tably POS</div>
      </header>

      {/* Sidebar + overlay */}
      <POSSidebar open={open} onClose={() => setOpen(false)} items={items} />
      <POSSidebarOverlay open={open} onClose={() => setOpen(false)} />

      {/* Pagina-content (kassa, producten, voorraad, etc.) */}
      <main className="pos-content">
        <Outlet />
      </main>
    </div>
  );
}
