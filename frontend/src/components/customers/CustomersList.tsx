import type { Customer } from "../../types/customers";

type Props = {
  customers: Customer[];
  selectedCustomerId?: string;
  onSelectCustomer: (id: string) => void;
};

export function CustomersList({ customers, selectedCustomerId, onSelectCustomer }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", borderRight: "1px solid #eee" }}>
      <div style={{ padding: 8, borderBottom: "1px solid #eee", background: "#f9f9f9", position: "sticky", top: 0 }}>
        <input
          type="text"
          placeholder="Zoek klant..."
          style={{ width: "100%", padding: 6, fontSize: 12, border: "1px solid #ddd", borderRadius: 4 }}
          disabled
        />
      </div>
      <div style={{ overflowY: "auto" }}>
        {customers.map((c) => {
          const active = c.id === selectedCustomerId;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCustomer(c.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                background: active ? "#eef5ff" : "transparent",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{c.phone}</div>
              <div style={{ marginTop: 4, display: "inline-block", fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#eee", color: "#555" }}>
                {c.totalPoints} punten
              </div>
            </button>
          );
        })}
        {customers.length === 0 && <div style={{ padding: 12, fontSize: 12, color: "#777" }}>Geen klanten</div>}
      </div>
    </div>
  );
}
