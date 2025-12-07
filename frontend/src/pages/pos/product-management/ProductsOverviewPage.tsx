import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../../styles/pos/pos-management.css";
import { fetchProducts, type PosProduct } from "@/api/pos/products";

const ProductsOverviewPage: React.FC = () => {
  const nav = useNavigate();
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message ?? "Kon producten niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Producten</div>
        <button className="pm-btn-green" onClick={() => nav("/pos/products/new")}>
          + Nieuw product
        </button>
      </div>

      <div className="pm-table">
        {loading && <div className="pm-item">Producten laden…</div>}
        {error && !loading && <div className="pm-item">Fout: {error}</div>}
        {!loading && !error && (
          <div className="pm-list">
            {products.length === 0 && <div className="pm-item">Nog geen producten</div>}
            {products.map((p) => (
              <div key={p.id} className="pm-item">
                <span>{p.name}</span>
                <button className="pm-btn-green" onClick={() => nav(`/pos/products/${p.id}`)}>
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsOverviewPage;
