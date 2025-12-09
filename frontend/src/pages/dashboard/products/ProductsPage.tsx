import React, { useEffect, useState } from "react";
import { apiListProducts, type Product } from "../../../api/pos/products";
import EditProductModal from "./EditProductModal";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);

  const load = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const list = await apiListProducts();
      setProducts(Array.isArray(list) ? list : []);
    } catch (e: unknown) {
      console.error("Failed to load products", e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Kon producten niet laden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Producten</h3>
        <button onClick={() => { setEditId(undefined); setOpen(true); }}>+ Nieuw product</button>
      </div>
      {error && <div style={{ color: "#fca5a5" }}>{error}</div>}
      {loading ? (
        <div>Laden…</div>
      ) : products.length === 0 ? (
        <div>Geen producten gevonden.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Categorie</th>
              <th>Prijs</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category?.name ?? "-"}</td>
                <td>{String(p.priceIncl ?? p.price ?? "-")}</td>
                <td>
                  <button onClick={() => { setEditId(p.id); setOpen(true); }}>Bewerken</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <EditProductModal open={open} productId={editId} onClose={() => setOpen(false)} onSaved={load} />
    </div>
  );
};

export default ProductsPage;
