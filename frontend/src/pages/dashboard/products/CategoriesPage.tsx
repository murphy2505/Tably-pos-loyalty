import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../../api/pos/categories";

type Category = { id: string; name: string; color?: string; order?: number; parentId?: string | null };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
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

  async function add() {
    if (!newName.trim()) return;
    await createCategory({ name: newName });
    setNewName("");
    await load();
  }

  async function rename(cat: Category) {
    const name = prompt("Nieuwe naam", cat.name);
    if (!name) return;
    await updateCategory(cat.id, { name });
    await load();
  }

  async function remove(cat: Category) {
    if (!confirm("Verwijderen?")) return;
    await deleteCategory(cat.id);
    await load();
  }

  return (
    <div>
      <h1>Categorieën</h1>
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nieuwe categorie" />
          <button className="kds-btn" type="button" onClick={add}>Toevoegen</button>
        </div>
      </div>
      {loading && <div>Bezig met laden…</div>}
      {error && <div style={{ color: "red" }}>Fout: {error}</div>}
      {!loading && !error && (
        <div className="card">
          <ul>
            {items.map((c) => (
              <li key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span>
                  {c.name} {c.color ? <span className="text-muted">({c.color})</span> : null}
                </span>
                <span>
                  <button className="kds-btn" type="button" onClick={() => rename(c)}>Hernoem</button>{" "}
                  <button className="kds-btn kds-btn-danger" type="button" onClick={() => remove(c)}>Verwijder</button>
                </span>
              </li>
            ))}
            {items.length === 0 && <li>Geen categorieën</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
