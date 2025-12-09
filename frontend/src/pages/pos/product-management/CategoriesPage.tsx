import React, { useEffect, useState } from "react";
import "./../../../styles/pos/pos-management.css";

// ❌ GEEN @/
// ✅ Relatief pad naar API
import {
  apiListCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
} from "../../../api/pos/categories";
import type { Category as PosCategory } from "../../../api/pos/categories";
void [apiCreateCategory, apiUpdateCategory, apiDeleteCategory];

type EditMode = "create" | "edit";

const CategoriesPage: React.FC = () => {
  const [items, setItems] = useState<PosCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("create");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ id?: string; name: string; color: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apiListCategories();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message ?? "Kon categorieën niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const reload = async () => {
    try {
      setLoading(true);
      const data = await apiListCategories();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditMode("create");
    setForm({ id: undefined, name: "", color: "" });
    setEditOpen(true);
  };

  const openEdit = (c: PosCategory) => {
    setEditMode("edit");
    setForm({ id: c.id, name: c.name, color: c.color ?? "" });
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditOpen(false);
    setForm(null);
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim()) return alert("Naam is verplicht");
    try {
      setSaving(true);
      const payload: any = { name: form.name.trim(), color: form.color || null };
      if (editMode === "create") {
        await apiCreateCategory(payload);
      } else if (form.id) {
        await apiUpdateCategory(form.id, payload);
      }
      await reload();
      closeEdit();
    } catch (e: any) {
      alert(e?.message ?? "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Categorieën</div>
        <button className="pm-btn-green" onClick={openCreate}>+ Nieuwe categorie</button>
      </div>

      {editOpen && form && (
        <div className="pm-table" style={{ border: "1px dashed rgba(0,0,0,0.1)" }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 200px auto", alignItems: "end" }}>
            <label style={{ fontSize: 12 }}>
              Naam
              <input value={form.name} onChange={(e) => setForm({ ...(form as any), name: e.target.value })} />
            </label>
            <label style={{ fontSize: 12 }}>
              Kleur (optioneel)
              <input value={form.color} onChange={(e) => setForm({ ...(form as any), color: e.target.value })} placeholder="#FFEFAA" />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="pm-btn-green" onClick={handleSave} disabled={saving}>
                {saving ? "Opslaan…" : editMode === "create" ? "Aanmaken" : "Opslaan"}
              </button>
              <button onClick={closeEdit} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.1)", background: "white" }}>
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pm-table">
        {loading && <div className="pm-item">Laden…</div>}
        {error && !loading && <div className="pm-item">Fout: {error}</div>}

        {!loading && !error && (
          <div className="pm-list">
            {items.length === 0 && (
              <div className="pm-item">Nog geen categorieën</div>
            )}

            {items.map((c) => (
              <div key={c.id} className="pm-item">
                <span>{c.name}</span>
                <span style={{ opacity: 0.7 }}>{c.color ?? ""}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(c)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "white" }}>
                    Bewerken
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
