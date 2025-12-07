import React, { useEffect, useState } from "react";
import "./../../../styles/pos/pos-management.css";
import { fetchCategories, type PosCategory } from "@/api/pos/categories";

const CategoriesPage: React.FC = () => {
  const [items, setItems] = useState<PosCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message ?? "Kon categorieën niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Categorieën</div>
        <button className="pm-btn-green">+ Nieuwe categorie</button>
      </div>

      <div className="pm-table">
        {loading && <div className="pm-item">Laden…</div>}
        {error && !loading && <div className="pm-item">Fout: {error}</div>}
        {!loading && !error && (
          <div className="pm-list">
            {items.length === 0 && <div className="pm-item">Nog geen categorieën</div>}
            {items.map((c) => (
              <div key={c.id} className="pm-item">
                <span>{c.name}</span>
                <span style={{ opacity: 0.7 }}>{c.color ?? ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
