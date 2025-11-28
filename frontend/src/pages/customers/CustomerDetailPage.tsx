import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { CustomerDetail } from "../../services/loyaltyClient";
import { fetchCustomerDetail } from "../../services/loyaltyClient";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Geen klant-id opgegeven");
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await fetchCustomerDetail(id);
        setData(detail);
      } catch (e: any) {
        setError(e?.message ?? "Onbekende fout");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div>Bezig met laden…</div>;
  }
  if (error) {
    return (
      <div>
        <p>Fout: {error}</p>
        <p>
          <Link to="/dashboard/customers">Terug naar klanten</Link>
        </p>
      </div>
    );
  }
  if (!data) {
    return (
      <div>
        <p>Geen data gevonden.</p>
        <p>
          <Link to="/dashboard/customers">Terug naar klanten</Link>
        </p>
      </div>
    );
  }

  const { customer, wallets, history } = data;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/dashboard/customers">← Terug naar klanten</Link>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2>Klant</h2>
        <div>
          <div><strong>Naam:</strong> {customer.name}</div>
          {customer.phone && <div><strong>Telefoon:</strong> {customer.phone}</div>}
          {customer.email && <div><strong>E-mail:</strong> {customer.email}</div>}
          {typeof customer.totalPoints !== "undefined" && (
            <div><strong>Totaal punten:</strong> {customer.totalPoints}</div>
          )}
          {typeof customer.totalVisits !== "undefined" && (
            <div><strong>Totaal bezoeken:</strong> {customer.totalVisits}</div>
          )}
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Wallets</h2>
        {wallets.length === 0 ? (
          <p>Geen wallets.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {wallets.map((w) => (
              <div key={w.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#fff" }}>
                <div><strong>Type:</strong> {w.type}</div>
                <div><strong>Saldo:</strong> {w.balance}</div>
                <div style={{ fontSize: 12, color: "#666" }}>ID: {w.id}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Historie</h2>
        {history.length === 0 ? (
          <p>Geen historie.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {history.map((h) => (
              <li key={h.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#fff", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{h.type}</strong>
                  <span style={{ color: "#666" }}>
                    {new Date(h.timestamp).toLocaleDateString()}{" "}
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {typeof h.amount !== "undefined" && (
                  <div style={{ fontSize: 12, color: "#444" }}>Amount: {h.amount}</div>
                )}
                {h.description && <div style={{ color: "#333" }}>{h.description}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
