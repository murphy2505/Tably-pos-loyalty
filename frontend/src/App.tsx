import { Routes, Route, Navigate } from "react-router-dom";

import "./dashboard.css";
import MainShell from "./layouts/MainShell";
import DashboardLayout from "./css/layouts/DashboardLayout";
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import LoyaltyPage from "./pages/loyalty/LoyaltyPage";
import SettingsPage from "./pages/settings/SettingsPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

// Dashboard beheer (correcte paden)
import DashboardProductsPage from "./pages/dashboard/products/ProductsPage";
import DashboardCategoriesPage from "./pages/dashboard/products/CategoriesPage";
import DashboardStockPage from "./pages/dashboard/products/StockPage";

// POS (alleen bestaande pagina’s)
import PosLayout from "./components/pos/PosLayout";
import PosPage from "./pages/pos/PosPage";

// KDS (gedeeld door dashboard + POS)
import KdsPage from "./pages/kds/KdsPage";

export default function App() {
  return (
    <div className="dashboard-page">
      <MainShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard module */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="loyalty" element={<LoyaltyPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="kds" element={<KdsPage />} />

            {/* Dashboard beheer pagina’s */}
            <Route path="products" element={<DashboardProductsPage />} />
            <Route path="categories" element={<DashboardCategoriesPage />} />
            <Route path="stock" element={<DashboardStockPage />} />
          </Route>

          {/* POS module */}
          <Route path="/pos" element={<PosLayout />}>
            <Route index element={<Navigate to="kassa" replace />} />
            <Route path="kassa" element={<PosPage />} />
            <Route path="kds" element={<KdsPage />} />
          </Route>

          {/* Loyalty module */}
          <Route path="/loyalty" element={<LoyaltyPage />} />

          <Route path="*" element={<div>404 – Not found</div>} />
        </Routes>
      </MainShell>
    </div>
  );
}
