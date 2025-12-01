// frontend/src/pages/pos/PosTablesPage.tsx
import { useEffect, useState } from "react";
import "./PosTablesPage.css";

type TableStatus = "free" | "occupied" | "preparing" | "waiting_payment";

interface PosTable {
  id: string;
  name: string;
  seats?: number;
  status: TableStatus;
  openOrderId?: string | null;
}

const PosTablesPage = () => {
  const [tables, setTables] = useState<PosTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const res = await fetch("/pos/tables");
        if (!res.ok) throw new Error("Failed to load tables");
        const data = (await res.json()) as PosTable[];
        setTables(data);
      } catch (e) {
        console.error(e);
        // fallback dummy data
        setTables([
          { id: "t1", name: "Tafel 1", seats: 2, status: "free" },
          { id: "t2", name: "Tafel 2", seats: 4, status: "occupied" },
          { id: "t3", name: "Tafel 3", seats: 4, status: "waiting_payment" },
          { id: "t4", name: "Tafel 4", seats: 2, status: "preparing" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  const labelForStatus = (status: TableStatus) => {
    switch (status) {
      case "free":
        return "Vrij";
      case "occupied":
        return "Bezet";
      case "preparing":
        return "In keuken";
      case "waiting_payment":
        return "Wacht op betaling";
    }
  };

  return (
    <div className="tables-root">
      <header className="tables-header">
        <div>
          <h2>Tafels</h2>
          <p>Overzicht van alle tafels en statussen.</p>
        </div>
        <div className="tables-legend">
          <span className="legend-pill free">Vrij</span>
          <span className="legend-pill occupied">Bezet</span>
          <span className="legend-pill preparing">In keuken</span>
          <span className="legend-pill waiting_payment">Wacht op betaling</span>
        </div>
      </header>

      {loading ? (
        <div className="tables-loading">Tafels laden…</div>
      ) : (
        <div className="tables-grid">
          {tables.map((t) => (
            <button
              key={t.id}
              className={`table-card ${t.status}`}
              onClick={() => {
                // TODO: hier later: open order / naar kassa met deze tafel
                console.log("Open table", t.id);
              }}
            >
              <div className="table-name">{t.name}</div>
              {t.seats ? (
                <div className="table-seats">{t.seats} pers.</div>
              ) : null}
              <div className="table-status-label">
                {labelForStatus(t.status)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PosTablesPage;
