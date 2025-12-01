// frontend/src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import "./dashboard.css";
import MainShell from "./layouts/MainShell";
import DashboardLayout from "./css/layouts/DashboardLayout";
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import LoyaltyPage from "./pages/loyalty/LoyaltyPage";
import SettingsPage from "./pages/settings/SettingsPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

// POS
import PosLayout from "./components/pos/PosLayout";
import PosPage from "./pages/pos/PosPage";
import PosProductsPage from "./pages/pos/PosProductsPage";
import PosCategoriesPage from "./pages/pos/PosCategoriesPage";
import PosStockPage from "./pages/pos/PosStockPage";
import PosReportsPage from "./pages/pos/PosReportsPage";
import PosCustomersPage from "./pages/pos/PosCustomersPage";
import PosGiftcardsPage from "./pages/pos/PosGiftcardsPage";
import PosPlanningPage from "./pages/pos/PosPlanningPage";
import PosTablesPage from "./pages/pos/PosTablesPage";

// KDS (gedeeld)
import KdsPage from "./pages/kds/KdsPage";

export default function App() {
  return (
    <div className="dashboard-page">
      <MainShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="loyalty" element={<LoyaltyPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="kds" element={<KdsPage />} />
            {/* later kun je hier nog /dashboard/products, /dashboard/categories, /dashboard/stock etc. toevoegen */}
          </Route>

          {/* POS */}
          <Route path="/pos" element={<PosLayout />}>
            <Route index element={<Navigate to="kassa" replace />} />
            <Route path="kassa" element={<PosPage />} />
            <Route path="products" element={<PosProductsPage />} />
            <Route path="categories" element={<PosCategoriesPage />} />
            <Route path="stock" element={<PosStockPage />} />
            <Route path="kds" element={<KdsPage />} />
            <Route path="reports" element={<PosReportsPage />} />
            <Route path="customers" element={<PosCustomersPage />} />
            <Route path="giftcards" element={<PosGiftcardsPage />} />
            <Route path="planning" element={<PosPlanningPage />} />
            <Route path="tables" element={<PosTablesPage />} />
          </Route>

          {/* Loyalty los */}
          <Route path="/loyalty" element={<LoyaltyPage />} />

          <Route path="*" element={<div>404 – Not found</div>} />
        </Routes>
      </MainShell>
    </div>
  );
}
