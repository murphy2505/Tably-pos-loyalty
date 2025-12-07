import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./../../../styles/pos/pos-management.css";
import { fetchVariants } from "@/api/pos/variants";
import type { PosProductVariant } from "@/api/pos/products";

const VariantsPage: React.FC = () => {
  const { id } = useParams();
  const [variants, setVariants] = useState<PosProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) {
        setError("Geen product-id in URL");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchVariants(id);
        setVariants(Array.isArray(data) ? data : []);
      } catch {
        setVariants([]); // fallback
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Varianten voor product {id}</div>
        <button className="pm-btn-green">+ Nieuwe variant</button>
      </div>

      <div className="pm-table">
        {loading && <div className="pm-item">Varianten laden…</div>}
        {error && !loading && <div className="pm-item">Fout: {error}</div>}
        {!loading && !error && (
          <div className="pm-list">
            {variants.length === 0 && (
              <div className="pm-item">Nog geen varianten beschikbaar (backend endpoint ontbreekt nog).</div>
            )}
            {variants.map((v) => (
              <div key={v.id} className="pm-item">
                <span>{v.name}</span>
                <span>€ {v.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantsPage;
