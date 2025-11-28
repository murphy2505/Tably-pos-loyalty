import { Routes, Route, Navigate } from "react-router-dom";
import { CustomersPage } from "./pages/customers/CustomersPage";
import { DashboardLayout } from "./layouts/DashboardLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/customers" replace />} />
      <Route
        path="/dashboard/customers"
        element={
          <DashboardLayout>
            <CustomersPage />
          </DashboardLayout>
        }
      />
      {/* ...existing routes if any... */}
    </Routes>
  );
}
