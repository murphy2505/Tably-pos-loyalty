import { useEffect, useState } from "react";
import "../../styles/pos/pos.css";
import {
  getRevenueGroups,
  createRevenueGroup,
  updateRevenueGroup,
  deleteRevenueGroup,
  type RevenueGroup,
} from "../../api/pos/revenueGroups";

export default function PosRevenueGroupsPage() {
  const [items, setItems] = useState<RevenueGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // nieuw
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");

  // edit
  const [editing, setEditing] = useState<RevenueGroup | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getRevenueGroups();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Kon omzetgroepen niet laden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addGroup() {
    if (!newName.trim()) return;
    try {
      await createRevenueGroup({
        name: newName.trim(),
        color: newColor || undefined,
      });
      setNewName("");
      setNewColor("");
      await load();
    } catch (e: any) {
      alert(e.message || "Kon omzetgroep niet toevoegen");
    }
  }

  function openEdit(g: RevenueGroup) {
    setEditing(g);
    setEditName(g.name);
    setEditColor(g.color ?? "");
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      await updateRevenueGroup(editing.id, {
        name: editName.trim() || editing.name,
        color: editColor || undefined,
      });
      setEditing(null);
      await load();
    } catch (e: any) {
      alert(e.message || "Kon omzetgroep niet opslaan");
    }
  }

  async function remove(g: RevenueGroup) {
    if (!confirm(`Omzetgroep "${g.name}" verwijderen?`)) return;
    try {
      await deleteRevenueGroup(g.id);
      await load();
    } catch (e: any) {
      alert(e.message || "Kon omzetgroep niet verwijderen");
    }
  }

  return (
    <div className="pos-page pos-page-admin">
      <div className="pos-main">
        {/* LINKERKOLOM */}
        <section className="pos-left">
          <div className="mint-card" style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Omzetgroepen</h3>
            <p style={{ marginTop: 4, opacity: 0.7 }}>
              Maak groepen voor rapportage (bijv. Friet, Snacks, Dranken).
            </p>
          </div>

          <div className="mint-card" style={{ marginBottom: 12 }}>
            <h4 style={{ margin: 0 }}>Nieuwe omzetgroep</h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px auto",
                gap: 8,
                marginTop: 10,
              }}
            >
              <input
                placeholder="Naam (bijv. Friet)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                placeholder="Kleur (optioneel)"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <button
                type="button"
                className="pos-pay-confirm"
                disabled={!newName.trim()}
                onClick={addGroup}
              >
                Toevoegen
              </button>
            </div>
          </div>

          <div className="pos-products">
            {loading && (
              <div style={{ padding: 8, color: "#6b7280" }}>Laden…</div>
            )}
            {error && !loading && (
              <div style={{ padding: 8, color: "#ef4444" }}>{error}</div>
            )}
            {!loading && !error && items.length === 0 && (
              <div style={{ padding: 8, color: "#6b7280" }}>
                Nog geen omzetgroepen.
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="pos-category-list">
                {items.map((g) => (
                  <div key={g.id} className="pos-category-row">
                    <div className="pos-category-main">
                      <div className="pos-category-name">{g.name}</div>
                      <div className="pos-category-meta">
                        {g.color
                          ? `Kleur: ${g.color}`
                          : "Geen kleur ingesteld"}
                      </div>
                    </div>
                    <div className="pos-category-actions">
                      <button
                        className="pos-product-edit-btn"
                        type="button"
                        onClick={() => openEdit(g)}
                      >
                        Bewerken
                      </button>
                      <button
                        className="pos-remove-button"
                        type="button"
                        onClick={() => remove(g)}
                      >
                        Verwijderen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RECHTERKOLOM */}
        <aside className="pos-right pos-order">
          <div className="pos-order-header">
            <div className="pos-order-title">Rapportage</div>
            <span className="pos-order-status">Tip</span>
          </div>
          <div className="pos-order-lines">
            <div className="pos-order-line">
              <div className="pos-order-line-left">
                <div className="pos-order-line-name">Omzet per groep</div>
                <div className="pos-order-line-meta">
                  Koppel producten aan omzetgroepen om straks rapporten te
                  draaien op niveau Friet / Snacks / Dranken / IJs, etc.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* BEWERK MODAL */}
      {editing && (
        <div className="pos-pay-overlay">
          <div className="pos-pay-panel" style={{ maxWidth: 420 }}>
            <div className="pos-pay-header">
              <h3 style={{ margin: 0 }}>Omzetgroep bewerken</h3>
              <button
                type="button"
                className="pos-pay-close"
                onClick={() => setEditing(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <label>
                Naam
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </label>
              <label>
                Kleur
                <input
                  placeholder="#FFAA00"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                />
              </label>
            </div>

            <div className="pos-pay-actions" style={{ marginTop: 14 }}>
              <button
                type="button"
                className="pos-secondary-button"
                onClick={() => setEditing(null)}
              >
                Annuleer
              </button>
              <button
                type="button"
                className="pos-pay-confirm"
                disabled={!editName.trim()}
                onClick={saveEdit}
              >
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
