// src/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainShell from "./layouts/MainShell";

// Dashboard
import DashboardPage from "./pages/dashboard/DashboardPage";

// POS
import PosPage from "./pages/pos/PosPage";
import PosProductsPage from "./pages/pos/PosProductsPage";
import PosCategoriesPage from "./pages/pos/PosCategoriesPage";
import PosStockPage from "./pages/pos/PosStockPage";
import PosReportsPage from "./pages/pos/PosReportsPage";
import PosCustomersPage from "./pages/pos/PosCustomersPage";
import PosGiftcardsPage from "./pages/pos/PosGiftcardsPage";
import PosPlanningPage from "./pages/pos/PosPlanningPage";
import PosTablesPage from "./pages/pos/PosTablesPage";
import KdsPage from "./pages/kds/KdsPage";

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

        {/* POS modules */}
        <Route path="/pos" element={<PosPage />} />
        <Route path="/pos/products" element={<PosProductsPage />} />
        <Route path="/pos/categories" element={<PosCategoriesPage />} />
        <Route path="/pos/stock" element={<PosStockPage />} />
        <Route path="/pos/reports" element={<PosReportsPage />} />
        <Route path="/pos/customers" element={<PosCustomersPage />} />
        <Route path="/pos/giftcards" element={<PosGiftcardsPage />} />
        <Route path="/pos/planning" element={<PosPlanningPage />} />
        <Route path="/pos/tables" element={<PosTablesPage />} />
        <Route path="/pos/kds" element={<KdsPage />} />

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
