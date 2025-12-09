// frontend/src/pages/pos/product-management/ProductsOverviewPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import "../../../styles/pos/pos-management.css";

import {
  apiListProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiGetProduct,
} from "../../../api/pos/products";
import type { Product as PosProduct } from "../../../api/pos/products";
import {
  apiListCategories,
} from "../../../api/pos/categories";
import type { Category } from "../../../api/pos/categories";

// keep imports "used" to satisfy noUnusedLocals while aligning interface
void [apiCreateProduct, apiUpdateProduct, apiDeleteProduct, apiGetProduct];

type EditMode = "create" | "edit";

const ProductsOverviewPage: React.FC = () => {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("create");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ id?: string; name: string; price: string; categoryId: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          apiListProducts(),
          apiListCategories(),
        ]);
        setProducts(prods);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err: any) {
        setError(err?.message ?? "Kon producten niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const reload = async () => {
    try {
      setLoading(true);
      const prods = await apiListProducts();
      setProducts(prods);
    } catch (err: any) {
      setError(err?.message ?? "Kon producten niet laden");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    if (!categories.length) {
      alert("Maak eerst een categorie aan.");
      return;
    }
    setEditMode("create");
    setForm({ id: undefined, name: "", price: "0.00", categoryId: categories[0].id });
    setEditOpen(true);
  };

  const openEdit = (p: PosProduct) => {
    setEditMode("edit");
    setForm({ id: p.id, name: p.name, price: String(p.variants?.[0]?.price ?? 0), categoryId: p.categoryId });
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditOpen(false);
    setForm(null);
  };

  const handleSave = async () => {
    if (!form) return;
    const price = parseFloat(form.price.replace(",", "."));
    if (!form.name.trim()) return alert("Naam is verplicht");
    if (!Number.isFinite(price)) return alert("Voer een geldige prijs in");
    if (!form.categoryId) return alert("Kies een categorie");
    try {
      setSaving(true);
      const payload: any = {
        name: form.name.trim(),
        price,
        categoryId: form.categoryId,
      };
      if (editMode === "create") {
        await apiCreateProduct(payload);
      } else if (form.id) {
        await apiUpdateProduct(form.id, payload);
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
        <div className="pm-title">Producten</div>
        <button className="pm-btn-green" onClick={openCreate}>+ Nieuw product</button>
      </div>

      {editOpen && form && (
        <div className="pm-table" style={{ border: "1px dashed rgba(0,0,0,0.1)" }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 160px 200px auto", alignItems: "end" }}>
            <label style={{ fontSize: 12 }}>
              Naam
              <input value={form.name} onChange={(e) => setForm({ ...(form as any), name: e.target.value })} />
            </label>
            <label style={{ fontSize: 12 }}>
              Prijs
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...(form as any), price: e.target.value })}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Categorie
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...(form as any), categoryId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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
        {error && <div className="pm-item">Fout: {error}</div>}

        {!loading && !error && (
          <div className="pm-list">
            {products.length === 0 && (
              <div className="pm-item">Nog geen producten</div>
            )}

            {products.map((p) => (
              <div key={p.id} className="pm-item">
                <span>{p.name}</span>
                <span style={{ opacity: 0.7 }}>
                  {p.variants?.[0]?.price
                    ? `€${p.variants[0].price.toFixed(2)}`
                    : ""}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(p)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "white" }}>
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

export default ProductsOverviewPage;
