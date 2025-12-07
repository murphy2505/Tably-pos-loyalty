import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../../../styles/pos/pos-management.css";
import { fetchProductById, updateProduct, type PosProduct } from "@/api/pos/products";
import { fetchCategories, type PosCategory } from "@/api/pos/categories";
import { fetchRevenueGroups, type PosRevenueGroup } from "@/api/pos/revenueGroups";

const ProductEditPage: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<PosCategory[]>([]);
  const [groups, setGroups] = useState<PosRevenueGroup[]>([]);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<string | "">("");
  const [revenueGroupId, setRevenueGroupId] = useState<string | "">("");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cats, grps] = await Promise.all([fetchCategories(), fetchRevenueGroups()]);
        setCategories(Array.isArray(cats) ? cats : []);
        setGroups(Array.isArray(grps) ? grps : []);
        if (id) {
          const prod: PosProduct | null = await fetchProductById(id);
          if (prod) {
            setName(prod.name ?? "");
            setPrice(prod.price ?? "");
            setCategoryId(prod.categoryId ?? "");
            setRevenueGroupId(prod.revenueGroupId ?? "");
            setIsActive(prod.isActive ?? true);
          }
        }
      } catch (e: any) {
        setError(e?.message ?? "Kon gegevens niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleSave() {
    if (!id) {
      setError("Geen product-id in URL");
      return;
    }
    try {
      setSaving(true);
      await updateProduct(id, {
        name: name || undefined,
        price: typeof price === "number" ? price : undefined,
        categoryId: categoryId || null,
        revenueGroupId: revenueGroupId || null,
        isActive,
      });
      nav(`/pos/products/${id}`);
    } catch (e: any) {
      setError(e?.message ?? "Opslaan nog niet beschikbaar (backend?)");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Product bewerken – {id}</div>
        <button className="pm-btn-green" onClick={handleSave} disabled={saving || loading}>
          Opslaan
        </button>
      </div>

      <div className="pm-table">
        {loading && <div className="pm-item">Laden…</div>}
        {error && !loading && <div className="pm-item">Fout: {error}</div>}
        {!loading && !error && (
          <div className="pm-list">
            <div className="pm-item">
              <label style={{ display: "grid", gap: 6, width: "100%" }}>
                <span>Naam</span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
            </div>

            <div className="pm-item">
              <label style={{ display: "grid", gap: 6, width: "100%" }}>
                <span>Prijs (€)</span>
                <input
                  type="number"
                  step="0.01"
                  value={price === "" ? "" : String(price)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPrice(v === "" ? "" : parseFloat(v));
                  }}
                />
              </label>
            </div>

            <div className="pm-item">
              <label style={{ display: "grid", gap: 6, width: "100%" }}>
                <span>Categorie</span>
                <select value={categoryId || ""} onChange={(e) => setCategoryId(e.target.value || "")}>
                  <option value="">(geen)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="pm-item">
              <label style={{ display: "grid", gap: 6, width: "100%" }}>
                <span>Omzetgroep</span>
                <select value={revenueGroupId || ""} onChange={(e) => setRevenueGroupId(e.target.value || "")}>
                  <option value="">(geen)</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="pm-item" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <span>Actief</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductEditPage;
