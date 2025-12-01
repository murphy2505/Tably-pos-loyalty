// frontend/src/pages/kds/KdsPage.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./KdsPage.css";

type KdsStatus = "new" | "preparing" | "ready" | "done";

interface KdsItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

interface KdsTicket {
  id: string;
  orderNumber: string;
  tableName?: string | null;
  channel: "inhouse" | "takeaway" | "delivery";
  status: KdsStatus;
  createdAt: string;
  items: KdsItem[];
}

const KdsPage = () => {
  const [tickets, setTickets] = useState<KdsTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isInPos = location.pathname.startsWith("/pos");

  const loadKds = async () => {
    try {
      const res = await fetch("/pos/kds");
      if (!res.ok) throw new Error("Failed to load KDS");
      const data = (await res.json()) as KdsTicket[];
      setTickets(data);
    } catch (e) {
      console.error(e);
      // fallback dummy data
      setTickets([
        {
          id: "k1",
          orderNumber: "1034",
          tableName: "Tafel 5",
          channel: "inhouse",
          status: "new",
          createdAt: new Date().toISOString(),
          items: [
            { id: "i1", name: "Friet groot", quantity: 2 },
            { id: "i2", name: "Frikandel speciaal", quantity: 1 },
          ],
        },
        {
          id: "k2",
          orderNumber: "1035",
          tableName: "Afhaal",
          channel: "takeaway",
          status: "preparing",
          createdAt: new Date().toISOString(),
          items: [{ id: "i3", name: "Kipcorn", quantity: 3 }],
        },
        {
          id: "k3",
          orderNumber: "1036",
          tableName: "Tafel 2",
          channel: "inhouse",
          status: "ready",
          createdAt: new Date().toISOString(),
          items: [{ id: "i4", name: "Boerenfriet", quantity: 1 }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eerste load
    loadKds();

    // elke 5 seconden verversen
    const interval = setInterval(() => {
      loadKds();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdvance = async (ticketId: string) => {
    try {
      await fetch(`/pos/kds/${ticketId}/advance`, { method: "POST" });
      // daarna gewoon opnieuw laden
      await loadKds();
    } catch (e) {
      console.error("Failed to advance ticket", e);
    }
  };

  const filteredByStatus = (status: KdsStatus) =>
    tickets.filter((t) => t.status === status);

  const renderTicket = (t: KdsTicket) => (
    <div key={t.id} className="kds-ticket">
      <div className="kds-ticket-header">
        <div className="kds-order">
          <span className="kds-order-number">#{t.orderNumber}</span>
          {t.tableName && <span className="kds-table">{t.tableName}</span>}
        </div>
        <span className={`kds-channel ${t.channel}`}>
          {t.channel === "inhouse"
            ? "In huis"
            : t.channel === "takeaway"
            ? "Afhaal"
            : "Bezorging"}
        </span>
      </div>
      <div className="kds-items">
        {t.items.map((i) => (
          <div key={i.id} className="kds-item-row">
            <span className="kds-qty">{i.quantity}×</span>
            <span className="kds-name">{i.name}</span>
            {i.notes && <span className="kds-notes">{i.notes}</span>}
          </div>
        ))}
      </div>
      <div className="kds-footer">
        <button
          className="kds-btn"
          onClick={() => handleAdvance(t.id)}
          disabled={t.status === "done"}
        >
          {t.status === "new"
            ? "Start bereiding"
            : t.status === "preparing"
            ? "Markeer als klaar"
            : t.status === "ready"
            ? "Bon afgerond"
            : "Afgerond"}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`kds-root ${isInPos ? "in-pos" : "in-dashboard"}`}>
      <header className="kds-header">
        <div>
          <h2>KDS</h2>
          <p>
            Overzicht van openstaande keukenbonnen
            {isInPos ? " (POS-weergave)." : " (dashboard-weergave)."}
          </p>
        </div>
      </header>

      {loading ? (
        <div className="kds-loading">Keukenbonnen laden…</div>
      ) : (
        <div className="kds-columns">
          <section className="kds-column">
            <h3>Nieuw</h3>
            <div className="kds-column-body">
              {filteredByStatus("new").map(renderTicket)}
            </div>
          </section>
          <section className="kds-column">
            <h3>In bereiding</h3>
            <div className="kds-column-body">
              {filteredByStatus("preparing").map(renderTicket)}
            </div>
          </section>
          <section className="kds-column">
            <h3>Klaar</h3>
            <div className="kds-column-body">
              {filteredByStatus("ready").map(renderTicket)}
            </div>
          </section>
          <section className="kds-column">
            <h3>Afgerond</h3>
            <div className="kds-column-body">
              {filteredByStatus("done").map(renderTicket)}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default KdsPage;
