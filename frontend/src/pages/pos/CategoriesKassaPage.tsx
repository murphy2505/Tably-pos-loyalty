import { useEffect, useState } from "react";
import "../../styles/pos/pos.css";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "../../api/pos/categories";

export default function CategoriesKassaPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nieuwe categorie
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");

  // Bewerken
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Kon categorieën niet laden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addCategory() {
    if (!newName.trim()) return;

    try {
      await createCategory({ name: newName.trim(), color: newColor || undefined });
      setNewName("");
      setNewColor("");
      await load();
    } catch (e: any) {
      alert(e.message || "Kon categorie niet toevoegen");
    }
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setEditName(cat.name);
    setEditColor(cat.color ?? "");
  }

  async function saveEdit() {
    if (!editing) return;

    try {
      await updateCategory(editing.id, {
        name: editName.trim() || editing.name,
        color: editColor || undefined,
      });
      setEditing(null);
      await load();
    } catch (e: any) {
      alert(e.message || "Kon categorie niet opslaan");
    }
  }

  async function remove(cat: Category) {
    if (!confirm(`Categorie "${cat.name}" verwijderen?`)) return;
    try {
      await deleteCategory(cat.id);
      await load();
    } catch (e: any) {
      alert(e.message || "Kon categorie niet verwijderen");
    }
  }

  return (
    <div className="pos-page pos-page-admin">
      <div className="pos-main">
        {/* =======================
            LINKERKOLOM
        ======================== */}
        <section className="pos-left">
          <div className="mint-card" style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Categorieën</h3>
            <p style={{ marginTop: 4, opacity: 0.7 }}>
              Overzicht en beheer in moderne kassa-stijl.
            </p>
          </div>

          {/* Nieuwe categorie */}
          <div className="mint-card" style={{ marginBottom: 12 }}>
            <h4 style={{ margin: 0 }}>Nieuwe categorie</h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px auto",
                gap: 8,
                marginTop: 10,
              }}
            >
              <input
                placeholder="Naam"
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
                onClick={addCategory}
              >
                Toevoegen
              </button>
            </div>
          </div>

          {/* Categorie-overzicht */}
          <div className="pos-products">
            {loading && (
              <div style={{ padding: 8, color: "#6b7280" }}>Laden…</div>
            )}

            {error && !loading && (
              <div style={{ padding: 8, color: "#ef4444" }}>{error}</div>
            )}

            {!loading && !error && items.length === 0 && (
              <div style={{ padding: 8, color: "#6b7280" }}>
                Geen categorieën gevonden.
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="pos-category-list">
                {items.map((c) => (
                  <div key={c.id} className="pos-category-row">
                    <div className="pos-category-main">
                      <div className="pos-category-name">{c.name}</div>
                      <div className="pos-category-meta">
                        {c.color ? `Kleur: ${c.color}` : "Geen kleur ingesteld"}
                      </div>
                    </div>

                    <div className="pos-category-actions">
                      <button
                        className="pos-product-edit-btn"
                        type="button"
                        onClick={() => openEdit(c)}
                      >
                        Bewerken
                      </button>
                      <button
                        className="pos-remove-button"
                        type="button"
                        onClick={() => remove(c)}
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

        {/* =======================
            RECHTERKOLOM (INFO)
        ======================== */}
        <aside className="pos-right pos-order">
          <div className="pos-order-header">
            <div className="pos-order-title">Koppelingen</div>
            <span className="pos-order-status">Info</span>
          </div>

          <div className="pos-order-lines">
            <div className="pos-order-line">
              <div className="pos-order-line-left">
                <div className="pos-order-line-name">Producten</div>
                <div className="pos-order-line-meta">
                  Categorieën worden gebruikt om producten te groeperen in de
                  kassa en rapportages.
                </div>
              </div>
            </div>

            <div className="pos-order-line">
              <div className="pos-order-line-left">
                <div className="pos-order-line-name">Menukaarten</div>
                <div className="pos-order-line-meta">
                  Je kunt categorieën koppelen aan menukaarten voor POS,
                  webshop, kiosk en tijdslots.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* =======================
          BEWERK MODAL
      ======================== */}
      {editing && (
        <div className="pos-pay-overlay">
          <div className="pos-pay-panel" style={{ maxWidth: 420 }}>
            <div className="pos-pay-header">
              <h3 style={{ margin: 0 }}>Categorie bewerken</h3>
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
