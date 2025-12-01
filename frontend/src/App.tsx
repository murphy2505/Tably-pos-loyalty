import { Routes, Route, Navigate } from "react-router-dom";

import "./dashboard.css";
import DashboardLayout from "./css/layouts/DashboardLayout";

import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import PosPage from "./pages/pos/PosPage";
import LoyaltyPage from "./pages/loyalty/LoyaltyPage";
import SettingsPage from "./pages/settings/SettingsPage";
import KdsPage from "./pages/kds/KdsPage";
import ProductsPage from "./pages/dashboard/products/ProductsPage";
import CategoriesPage from "./pages/dashboard/products/CategoriesPage";
import StockPage from "./pages/dashboard/products/StockPage";

export default function App() {
  return (
    <div className="dashboard-page">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/customers" replace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<CustomersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="pos" element={<PosPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="kds" element={<KdsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="stock" element={<StockPage />} />
        </Route>
        <Route path="*" element={<div>404 – Not found</div>} />
      </Routes>
    </div>
  );
}
