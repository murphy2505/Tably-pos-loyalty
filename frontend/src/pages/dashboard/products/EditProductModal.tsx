import React, { useEffect, useState } from "react";
import { apiListCategories } from "../../../api/pos/categories";
import { apiListRevenueGroups } from "../../../api/pos/revenueGroups";
import { apiListVariants, apiCreateVariant, apiUpdateVariant, apiDeleteVariant, type Variant } from "../../../api/pos/variants";
import { apiCreateProduct, apiUpdateProduct, apiGetProduct, type Product } from "../../../api/pos/products";

type Props = {
  open: boolean;
  productId?: string;
  onClose: () => void;
  onSaved: () => void;
};

type Tab = "general" | "variants" | "stock";

const EditProductModal: React.FC<Props> = ({ open, productId, onClose, onSaved }) => {
  const [tab, setTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [product, setProduct] = useState<Partial<Product>>({});
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [revenueGroups, setRevenueGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const cats = await apiListCategories();
        setCategories(cats.map(c => ({ id: c.id, name: c.name })));
        // Revenue groups: if API exists, load; else empty placeholder
        try {
          const groups = await apiListRevenueGroups?.();
          if (Array.isArray(groups)) setRevenueGroups(groups.map((g: any) => ({ id: g.id, name: g.name })));
        } catch {}
        if (productId) {
          const p = await apiGetProduct(productId);
          setProduct(p);
          const v = await apiListVariants(productId);
          setVariants(v);
        } else {
          setProduct({ name: "", categoryId: cats[0]?.id ?? "", revenueGroupId: null });
          setVariants([]);
        }
      } catch (e: unknown) {
        console.error("Failed to load product modal", e);
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Kon gegevens niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, productId]);

  const saveProduct = async () => {
    if (!product?.name || !String(product.name).trim()) {
      setError("Naam is verplicht");
      return;
    }
    if (!product?.categoryId) {
      setError("Categorie is verplicht");
      return;
    }
    if (!product?.revenueGroupId) {
      setError("Omzetgroep is verplicht");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const payload: any = {
        name: String(product.name).trim(),
        categoryId: product.categoryId,
        revenueGroupId: product.revenueGroupId,
        priceIncl: product.priceIncl ?? 0,
        vatRate: product.vatRate ?? 21,
        isActive: product.isActive ?? true,
      };
      if (productId) {
        await apiUpdateProduct(productId, payload);
      } else {
        await apiCreateProduct(payload);
      }
      onSaved();
      onClose();
    } catch (e: unknown) {
      console.error("Failed to save product", e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Kon product niet opslaan");
    } finally {
      setSaving(false);
    }
  };

  const addVariant = async () => {
    if (!productId) return;
    const name = prompt("Variant naam") || "Variant";
    const priceInclVat = Number(prompt("Prijs (incl. BTW)") || "0");
    const vatRate = Number(prompt("BTW percentage") || "21");
    try {
      const v = await apiCreateVariant(productId, { name, priceInclVat, vatRate, isActive: true });
      setVariants(prev => [...prev, v]);
    } catch (e: unknown) {
      console.error("createVariant error", e);
      const msg = e instanceof Error ? e.message : String(e);
      alert(msg || "Kon variant niet aanmaken");
    }
  };

  const editVariant = async (v: Variant) => {
    const name = prompt("Variant naam", v.name) || v.name;
    const priceInclVat = Number(prompt("Prijs (incl. BTW)", String(v.priceInclVat)) || v.priceInclVat);
    const vatRate = Number(prompt("BTW percentage", String(v.vatRate)) || v.vatRate);
    try {
      const updated = await apiUpdateVariant(v.id, { name, priceInclVat, vatRate });
      setVariants(prev => prev.map(x => (x.id === v.id ? updated : x)));
    } catch (e: unknown) {
      console.error("updateVariant error", e);
      const msg = e instanceof Error ? e.message : String(e);
      alert(msg || "Kon variant niet bijwerken");
    }
  };

  const removeVariant = async (v: Variant) => {
    if (!confirm(`Variant "${v.name}" verwijderen?`)) return;
    try {
      await apiDeleteVariant(v.id);
      setVariants(prev => prev.filter(x => x.id !== v.id));
    } catch (e: unknown) {
      console.error("deleteVariant error", e);
      const msg = e instanceof Error ? e.message : String(e);
      alert(msg || "Kon variant niet verwijderen");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{productId ? "Product bewerken" : "Nieuw product"}</h3>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-tabs">
          <button className={tab === "general" ? "active" : ""} onClick={() => setTab("general")}>Algemeen</button>
          <button className={tab === "variants" ? "active" : ""} onClick={() => setTab("variants")}>Varianten</button>
          <button className={tab === "stock" ? "active" : ""} onClick={() => setTab("stock")}>Voorraad</button>
        </div>
        {error && <div className="modal-error">{error}</div>}
        {loading ? (
          <div style={{ padding: 12 }}>Laden…</div>
        ) : (
          <div className="modal-body">
            {tab === "general" && (
              <div className="form-grid">
                <label>Naam</label>
                <input value={String(product.name ?? "")} onChange={(e) => setProduct(p => ({ ...p, name: e.target.value }))} />

                <label>Categorie</label>
                <select value={String(product.categoryId ?? "")} onChange={(e) => setProduct(p => ({ ...p, categoryId: e.target.value }))}>
                  <option value="">Kies categorie…</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <label>Omzetgroep</label>
                <select value={String(product.revenueGroupId ?? "")} onChange={(e) => setProduct(p => ({ ...p, revenueGroupId: e.target.value }))}>
                  <option value="">Kies omzetgroep…</option>
                  {revenueGroups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>

                <label>Prijs (incl. BTW)</label>
                <input type="number" step="0.01" value={Number(product.priceIncl ?? 0)} onChange={(e) => setProduct(p => ({ ...p, priceIncl: Number(e.target.value) }))} />

                <label>BTW %</label>
                <input type="number" step="1" value={Number(product.vatRate ?? 21)} onChange={(e) => setProduct(p => ({ ...p, vatRate: Number(e.target.value) }))} />
              </div>
            )}

            {tab === "variants" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h4 style={{ margin: 0 }}>Varianten</h4>
                  {productId && <button onClick={addVariant}>+ Variant</button>}
                </div>
                {variants.length === 0 ? (
                  <div>Nog geen varianten</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Naam</th>
                        <th>Prijs</th>
                        <th>BTW</th>
                        <th>Acties</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map(v => (
                        <tr key={v.id}>
                          <td>{v.name}</td>
                          <td>{String(v.priceInclVat)}</td>
                          <td>{String(v.vatRate)}</td>
                          <td>
                            <button onClick={() => editVariant(v)}>Bewerken</button>
                            <button onClick={() => removeVariant(v)}>Verwijderen</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {tab === "stock" && (
              <div>
                <p>
                  Voorraadbeheer is beschikbaar onder ‘Dashboard → Voorraad’. In een volgende sprint koppelen we dit scherm direct aan dit product.
                </p>
                <a href="#/dashboard/stock" className="pos-pay-confirm">Open voorraadbeheer</a>
              </div>
            )}
          </div>
        )}
        <div className="modal-footer">
          <button onClick={onClose} disabled={saving}>Annuleren</button>
          <button onClick={saveProduct} disabled={saving}>Opslaan</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
