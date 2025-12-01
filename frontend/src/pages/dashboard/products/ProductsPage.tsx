import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../../api/pos/products";
import EditProductModal from "./EditProductModal";

type Product = {
  id: string;
  name: string;
  categoryId?: string;
  variants?: { id: string; name: string; price: number }[];
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Kon producten niet laden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setOpen(true);
  }

  async function handleSave(data: { name: string; categoryId?: string }) {
    if (editing) {
      await updateProduct(editing.id, data);
    } else {
      await createProduct(data);
    }
    setOpen(false);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Weet je zeker dat je dit product wilt verwijderen?")) return;
    await deleteProduct(id);
    await load();
  }

  return (
    <div>
      <h1>Producten</h1>
      <div style={{ marginBottom: 12 }}>
        <button className="kds-btn" onClick={openNew} type="button">Nieuw product</button>
      </div>
      {loading && <div>Bezig met laden…</div>}
      {error && <div style={{ color: "red" }}>Fout: {error}</div>}
      {!loading && !error && (
        <div className="card">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Naam</th>
                <th style={{ textAlign: "left" }}>Varianten</th>
                <th style={{ textAlign: "right" }}>Acties</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.variants?.length ?? 0}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="kds-btn" onClick={() => openEdit(p)} type="button">Bewerken</button>{" "}
                    <button className="kds-btn kds-btn-danger" onClick={() => handleDelete(p.id)} type="button">Verwijderen</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3}>Nog geen producten</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <EditProductModal
          initial={editing ? { name: editing.name, categoryId: editing.categoryId } : undefined}
          onCancel={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
