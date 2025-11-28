import { Link } from "react-router-dom";

export function DashboardGiftcardsOverviewPage() {
  return (
    <div className="giftcards-page">
      <h1>Giftcards</h1>
      <p>Beheer cadeaubonnen: uitgifte, saldo en transacties.</p>
      <p style={{ marginTop: 16 }}>
        Ga naar <Link to="/dashboard/giftcards/redeem">Verzilveren of uitgeven</Link>.
      </p>
    </div>
  );
}
