// src/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import MainShell from "./layouts/MainShell";
import DashboardPage from "./pages/dashboard/DashboardPage";

// POS
import PosLayout from "./components/pos/PosLayout";
import PosPage from "./pages/pos/PosPage";
import PosReportsPage from "./pages/pos/PosReportsPage";
import PosCustomersPage from "./pages/pos/PosCustomersPage";
import PosGiftcardsPage from "./pages/pos/PosGiftcardsPage";
import PosPlanningPage from "./pages/pos/PosPlanningPage";
import PosTablesPage from "./pages/pos/PosTablesPage";
import KdsPage from "./pages/kds/KdsPage";

// ⭐ Nieuwe POS product-management pages
import ProductsOverviewPage from "./pages/pos/product-management/ProductsOverviewPage";
import ProductDetailPage from "./pages/pos/product-management/ProductDetailPage";
import ProductEditPage from "./pages/pos/product-management/ProductEditPage";
import VariantsPage from "./pages/pos/product-management/VariantsPage";
import PosCategoriesManagementPage from "./pages/pos/product-management/CategoriesPage";
import PosRevenueGroupsManagementPage from "./pages/pos/product-management/RevenueGroupsPage";
import PosStockManagementPage from "./pages/pos/product-management/StockPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* ⭐ Standalone POS */}
      <Route path="/pos" element={<PosLayout />}>
        <Route index element={<Navigate to="kassa" replace />} />

        {/* Kassa */}
        <Route path="kassa" element={<PosPage />} />

        {/* Productbeheer */}
        <Route path="products" element={<ProductsOverviewPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="products/:id/variants" element={<VariantsPage />} />

        {/* Categorieën & Omzetgroepen (POS-beheer) */}
        <Route path="categories" element={<PosCategoriesManagementPage />} />
        <Route
          path="revenue-groups"
          element={<PosRevenueGroupsManagementPage />}
        />

        {/* Voorraad (POS-beheer) */}
        <Route path="stock" element={<PosStockManagementPage />} />

        {/* Overige POS-modules */}
        <Route path="customers" element={<PosCustomersPage />} />
        <Route path="giftcards" element={<PosGiftcardsPage />} />
        <Route path="planning" element={<PosPlanningPage />} />
        <Route path="tables" element={<PosTablesPage />} />
        <Route path="reports" element={<PosReportsPage />} />
        <Route path="kds" element={<KdsPage />} />
      </Route>

      {/* Dashboard + overige dingen */}
      <Route element={<MainShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* ... rest van je dashboard routes ... */}
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;