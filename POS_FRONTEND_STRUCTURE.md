# POS Frontend structuur (layout, routes, koppelingen)

Dit document vat de POS-frontend samen: routes, layout (hamburger + sidebar + overlay), kassascherm en service-koppelingen. Codeblokken tonen alleen de relevante delen; ongewijzigde stukken zijn aangeduid met …existing code….

## 1) Entry en top-level routing

```tsx
// filepath: frontend/src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
```

```tsx
// filepath: frontend/src/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainShell from "./layouts/MainShell";
import DashboardPage from "./pages/dashboard/DashboardPage";
// POS
import PosLayout from "./components/pos/PosLayout";
import PosMainScreen from "./pages/pos/PosMainScreen";
import PosProductsPage from "./pages/pos/PosProductsPage";
import PosCategoriesPage from "./pages/pos/PosCategoriesPage";
import PosStockPage from "./pages/pos/PosStockPage";
import PosReportsPage from "./pages/pos/PosReportsPage";
import PosCustomersPage from "./pages/pos/PosCustomersPage";
import PosGiftcardsPage from "./pages/pos/PosGiftcardsPage";
import PosPlanningPage from "./pages/pos/PosPlanningPage";
import PosTablesPage from "./pages/pos/PosTablesPage";
import KdsPage from "./pages/kds/KdsPage";
// Loyalty + Customers
import LoyaltyPage from "./pages/loyalty/LoyaltyPage";
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pos" element={<PosLayout />}>
          <Route index element={<PosMainScreen />} />
          <Route path="kassa" element={<PosMainScreen />} />
          <Route path="products" element={<PosProductsPage />} />
          <Route path="categories" element={<PosCategoriesPage />} />
          <Route path="stock" element={<PosStockPage />} />
          <Route path="reports" element={<PosReportsPage />} />
          <Route path="customers" element={<PosCustomersPage />} />
          <Route path="giftcards" element={<PosGiftcardsPage />} />
          <Route path="planning" element={<PosPlanningPage />} />
          <Route path="tables" element={<PosTablesPage />} />
          <Route path="kds" element={<KdsPage />} />
        </Route>
        <Route path="/loyalty" element={<LoyaltyPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
```

## 2) POS layout: hamburger + sidebar + overlay

```tsx
// filepath: frontend/src/components/pos/PosLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import POSMenuButton from "./POSMenuButton";
import POSSidebar from "./POSSidebar";
import POSSidebarOverlay from "./POSSidebarOverlay";

export type MenuItem = { key: string; label: string; to: string };

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
```

```tsx
// filepath: frontend/src/components/pos/POSMenuButton.tsx
export default function POSMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="pos-menu-btn" aria-label="Menu" onClick={onClick}>
      ☰
    </button>
  );
}
```

```tsx
// filepath: frontend/src/components/pos/POSSidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuItem } from "./PosLayout";

export default function POSSidebar({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
}) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleItem(to: string) {
    navigate(to);
    onClose();
  }

  return (
    <aside className={"pos-sidebar" + (open ? " open" : "")}>
      <div className="pos-sidebar-header">
        <div className="pos-sidebar-title">POS Menu</div>
        <button className="pos-sidebar-close" onClick={onClose} type="button">✕</button>
      </div>
      <nav className="pos-sidebar-nav">
        {items.map((i) => (
          <button
            key={i.key}
            type="button"
            className={"pos-menu-item" + (location.pathname === i.to ? " is-active" : "")}
            onClick={() => handleItem(i.to)}
          >
            {i.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
```

```tsx
// filepath: frontend/src/components/pos/POSSidebarOverlay.tsx
type Props = { open: boolean; onClose: () => void };

export default function POSSidebarOverlay({ open, onClose }: Props) {
  if (!open) return null;
  return <div className="pos-sidebar-overlay" onClick={onClose} />;
}
```

## 3) POS kassascherm en koppelingen

```tsx
// filepath: frontend/src/pages/pos/PosMainScreen.tsx
export default function PosMainScreen() {
  return (
    <div className="pos-page">
      {/* ...existing code... (categorie-balk, productgrid, orderpaneel) */}
      <div>POS Kassascherm</div>
    </div>
  );
}
```

```tsx
// filepath: frontend/src/pages/pos/PosPage.tsx
// Kassalogica (producten laden, orderregels, qty-controls, betaling + KDS)
// ...existing code...
// In betaling bevestigen:
// await createPosOrder({ lines: orderLines, totals, paymentMethod, source: "counter" });
// await createKdsTicket({ id: result.orderId, ticketNumber: result.ticketNumber, items: orderLines.map(l => ({ name: l.name, qty: l.qty })) });
// setIsPaying(false); setPaymentMethod(null); handleClearOrder();
// ...existing code...
```

```ts
// filepath: frontend/src/services/ordersService.ts
import type { PosOrderLine, PosOrderTotals } from "../types/pos";
export type PaymentMethod = "cash" | "card" | "sumup" | "qr";

export async function createPosOrder(payload: {
  lines: PosOrderLine[];
  totals: PosOrderTotals;
  paymentMethod?: PaymentMethod;
  source?: "counter" | "phone" | "web" | "kiosk";
}) {
  const res = await fetch("/pos/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create POS order");
  return res.json();
}
```

```ts
// filepath: frontend/src/services/kdsService.ts
import type { KdsStatus } from "../types/kds";
export async function createKdsTicket(payload: {
  id: string; ticketNumber: number; items: { name: string; qty: number }[];
}) {
  const res = await fetch("/pos/kds", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create KDS ticket");
}
```

## 4) CSS hooks voor layout/overlay/sidebar

```css
// filepath: frontend/src/styles/pos/pos.css
.pos-layout { position: relative; height: 100vh; width: 100%; background: #0e1116; overflow: hidden; }
.pos-layout-header { display: flex; align-items: center; gap: 12px; height: 64px; padding-left: 80px; color: #e5e7eb; z-index: 50; }
.pos-layout-title { font-weight: 600; font-size: 1rem; }
.pos-layout-content { position: relative; height: calc(100vh - 64px); overflow: auto; z-index: 10; }

.pos-menu-btn { position: absolute; top: 18px; left: 18px; width: 48px; height: 48px; border-radius: 12px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); backdrop-filter: blur(12px); z-index: 110; color: white; font-size: 24px; display: grid; place-items: center; }

.pos-sidebar { position: fixed; top: 0; left: 0; height: 100vh; width: 260px; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); transition: transform 0.25s ease; transform: translateX(-100%); z-index: 100; padding-top: 70px; }
.pos-sidebar.open { transform: translateX(0); }

.pos-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 90; }

.pos-menu-item { display: block; width: 100%; padding: 14px 20px; background: transparent; border: none; color: #e5e7eb; text-align: left; font-size: 16px; cursor: pointer; }
.pos-menu-item.is-active { background: rgba(59,130,246,0.15); border-radius: 10px; }

/* Productgrid leesbaarheid (donker thema) */
.pos-product-card { color: #e5e7eb; }
.pos-product-name { color: #f9fafb; }
.pos-product-price { color: #a5b4fc; }
```

## 5) Netwerk/Proxy

- Vite proxy: `/pos` → POS backend (http://localhost:4002)
- POS UI calls:
  - POST `/pos/orders`
  - POST `/pos/kds`
  - GET/PATCH/DELETE `/pos/kds/*`