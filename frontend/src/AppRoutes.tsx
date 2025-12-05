// src/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainShell from "./layouts/MainShell";

// Dashboard
import DashboardPage from "./pages/dashboard/DashboardPage";

// POS
import PosLayout from "./components/pos/PosLayout";   // POS layout
import PosPage from "./pages/pos/PosPage";            // kassascherm
import PosProductsPage from "./pages/pos/PosProductsPage";
import PosCategoriesPage from "./pages/pos/PosCategoriesPage";
import PosStockPage from "./pages/pos/PosStockPage";
import PosReportsPage from "./pages/pos/PosReportsPage";
import PosCustomersPage from "./pages/pos/PosCustomersPage";
import PosGiftcardsPage from "./pages/pos/PosGiftcardsPage";
import PosPlanningPage from "./pages/pos/PosPlanningPage";
import PosTablesPage from "./pages/pos/PosTablesPage";
import KdsPage from "./pages/kds/KdsPage";
import PosRevenueGroupsPage from "./pages/pos/PosRevenueGroupsPage";
import ModifiersPage from "./pages/core/ModifiersPage";

// Menukaarten (beheer UI, draait ook onder POS-shell)
import MenusPage from "./pages/core/menus/MenusPage";
import MenuDetailPage from "./pages/core/menus/MenuDetailPage";

// Loyalty
import LoyaltyPage from "./pages/loyalty/LoyaltyPage";

// Customer management
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Global layout */}
      <Route element={<MainShell />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* POS layout: hier zit bootstrap + hamburger etc. */}
        <Route path="/pos" element={<PosLayout />}>
          {/* default: /pos → direct naar kassa */}
          <Route index element={<Navigate to="kassa" replace />} />

          {/* Kassascherm zelf */}
          <Route path="kassa" element={<PosPage />} />

          {/* POS beheer / submodules */}
          <Route path="products" element={<PosProductsPage />} />
          <Route path="categories" element={<PosCategoriesPage />} />
          <Route path="revenue-groups" element={<PosRevenueGroupsPage />} />
          <Route path="stock" element={<PosStockPage />} />
          <Route path="reports" element={<PosReportsPage />} />
          <Route path="customers" element={<PosCustomersPage />} />
          <Route path="giftcards" element={<PosGiftcardsPage />} />
          <Route path="planning" element={<PosPlanningPage />} />
          <Route path="tables" element={<PosTablesPage />} />
          <Route path="kds" element={<KdsPage />} />

          {/* 🔥 Modifiers UI onder POS */}
          <Route path="modifiers" element={<ModifiersPage />} />

          {/* Menukaarten beheer (lijst + detail) */}
          <Route path="menus" element={<MenusPage />} />
          <Route path="menus/:id" element={<MenuDetailPage />} />
        </Route>

        {/* Loyalty */}
        <Route path="/loyalty" element={<LoyaltyPage />} />

        {/* Customer management */}
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
      </Route>

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default AppRoutes;
