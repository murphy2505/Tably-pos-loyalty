import { useEffect, useState } from "react";
import "../../styles/pos/pos.css";
import type { KdsTicket, KdsStatus } from "../../types/kds";
import {
  getKdsTickets,
  updateKdsStatus,
  deleteKdsTicket,
} from "../../services/kdsService";

export default function KdsPage() {
  const [tickets, setTickets] = useState<KdsTicket[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTickets() {
    setLoading(true);
    try {
      const data = await getKdsTickets();
      setTickets(data ?? []);
    } catch (e) {
      // Geen foutmelding meer in de UI, alleen in console
      console.error("KDS load error:", e);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTickets();
  }, []);

  async function changeStatus(id: string, status: KdsStatus) {
    try {
      await updateKdsStatus(id, status);
      await loadTickets();
    } catch (e) {
      console.error("KDS status error:", e);
    }
  }

  async function removeTicket(id: string) {
    try {
      await deleteKdsTicket(id);
      await loadTickets();
    } catch (e) {
      console.error("KDS delete error:", e);
    }
  }

  return (
    <div className="kds-page">
      <h2 className="kds-title">Kitchen Display</h2>

      {loading && <div className="kds-info">Laden...</div>}
      {!loading && tickets.length === 0 && (
        <div className="kds-info">Geen tickets.</div>
      )}

      {!loading && tickets.length > 0 && (
        <div className="kds-grid">
          {tickets.map((t) => (
            <div key={t.id} className="kds-card">
              <div className="kds-card-header">
                <div className="kds-ticket-number">Bon #{t.ticketNumber}</div>
                <span className={`kds-status kds-status--${t.status}`}>
                  {t.status === "queued"
                    ? "Wachten"
                    : t.status === "preparing"
                    ? "Bezig"
                    : "Klaar"}
                </span>
              </div>

              <ul className="kds-items">
                {t.items.map((item, idx) => (
                  <li key={idx}>
                    <span className="kds-item-qty">{item.qty}×</span>{" "}
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>

              <div className="kds-actions">
                <button
                  type="button"
                  onClick={() => changeStatus(t.id, "preparing")}
                >
                  Markeer bezig
                </button>
                <button
                  type="button"
                  onClick={() => changeStatus(t.id, "ready")}
                >
                  Klaar
                </button>
                <button
                  type="button"
                  onClick={() => removeTicket(t.id)}
                >
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
