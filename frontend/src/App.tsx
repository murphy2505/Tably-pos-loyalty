import { Routes, Route, Navigate } from "react-router-dom";

import "./dashboard.css";
import DashboardLayout from "./css/layouts/DashboardLayout";

import CustomersPage from "./pages/customers/CustomersPage";
import PosPage from "./pages/pos/PosPage";
import LoyaltyPage from "./pages/loyalty/LoyaltyPage";
import SettingsPage from "./pages/settings/SettingsPage";

export default function App() {
  return (
    <div className="dashboard-page">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/customers" replace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<CustomersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="pos" element={<PosPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<div>404 – Not found</div>} />
      </Routes>
    </div>
  );
}
