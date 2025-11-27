import type { Customer, Wallet, HistoryEvent } from "../../types/customers";

type Props = {
  customer?: Customer;
  wallets?: Wallet[];
  history?: HistoryEvent[];
};

export function CustomerDetailPanel({ customer, wallets = [], history = [] }: Props) {
  if (!customer) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 12, color: "#666" }}>
        Selecteer een klant links…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: 16, borderBottom: "1px solid #eee", background: "#fff", position: "sticky", top: 0 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 96, height: 96, background: "#e5e7eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#666" }}>
            QR
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{customer.name}</h2>
            <div style={{ fontSize: 14, color: "#333" }}>{customer.phone}</div>
            {customer.email && <div style={{ fontSize: 12, color: "#666" }}>{customer.email}</div>}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, borderBottom: "1px solid #eee" }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Klantinfo</h3>
          <ul style={{ fontSize: 12, listStyle: "none", padding: 0, margin: 0 }}>
            <li>Last visit: {customer.lastVisit ?? "—"}</li>
            <li>Total visits: {customer.totalVisits}</li>
            <li>Total points: {customer.totalPoints}</li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Wallets</h3>
          {wallets.length === 0 && <div style={{ fontSize: 12, color: "#666" }}>Geen wallets</div>}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {wallets.map((w) => (
              <li key={w.id} style={{ fontSize: 12, padding: 8, border: "1px solid #eee", borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa", marginBottom: 8 }}>
                <span>{w.type}</span>
                <span style={{ fontFamily: "monospace" }}>{w.balance}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Laatste activiteiten</h3>
        {history.length === 0 && <div style={{ fontSize: 12, color: "#666" }}>Nog geen activiteiten</div>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {history.map((ev) => (
            <li key={ev.id} style={{ fontSize: 12, padding: 8, border: "1px solid #eee", borderRadius: 6, background: "#fff", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>{ev.type}</span>
                <span style={{ color: "#666" }}>
                  {new Date(ev.timestamp).toLocaleDateString()}{" "}
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div style={{ color: "#333" }}>{ev.description}</div>
              {ev.amount !== undefined && <div style={{ fontSize: 10, color: "#666" }}>Amount: {ev.amount}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
