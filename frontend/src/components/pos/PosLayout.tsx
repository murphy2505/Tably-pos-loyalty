import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import POSMenuButton from "./POSMenuButton";
import POSSidebar from "./POSSidebar";
import POSSidebarOverlay from "./POSSidebarOverlay";
import { posMenu, type MenuItem } from "./menuConfig";

export default function PosLayout() {
  const [open, setOpen] = useState(false);

  const items: MenuItem[] = useMemo(
    () => [
      ...(posMenu as MenuItem[]),
      { key: "modifiers", label: "Modifiers", to: "/pos/core/modifiers" },
    ],
    []
  );

  return (
    <div className="pos-layout">
      <header className="pos-layout-header">
        <POSMenuButton onClick={() => setOpen(true)} />
        <div className="pos-layout-title">Tably POS</div>
      </header>

      <POSSidebar open={open} onClose={() => setOpen(false)} items={items} />
      <POSSidebarOverlay open={open} onClose={() => setOpen(false)} />

      <main className="pos-layout-content">
        <Outlet />
      </main>
    </div>
  );
}
