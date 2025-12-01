// src/pages/dashboard/DashboardPage.tsx
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-grid">
      <div className="tile" onClick={() => navigate("products")}>
        <h2>Producten</h2>
        <p>Beheer alle producten, prijzen en btw.</p>
      </div>
      <div className="tile" onClick={() => navigate("categories")}>
        <h2>Categorieën</h2>
        <p>Structuur van je kassa en menukaarten.</p>
      </div>
      <div className="tile" onClick={() => navigate("stock")}>
        <h2>Voorraad</h2>
        <p>Voorraadstanden en derving bijwerken.</p>
      </div>
      <div className="tile" onClick={() => navigate("customers")}>
        <h2>Klanten / Loyalty</h2>
        <p>Klanten, wallets en punten inzien.</p>
      </div>
      <div className="tile" onClick={() => navigate("kds")}>
        <h2>KDS-status</h2>
        <p>Orders in de keuken volgen.</p>
      </div>
      <div className="tile" onClick={() => navigate("settings")}>
        <h2>Instellingen</h2>
        <p>POS, koppelingen en algemene instellingen.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
