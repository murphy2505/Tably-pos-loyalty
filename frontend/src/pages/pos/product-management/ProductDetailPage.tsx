import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../../../styles/pos/pos-management.css";
import { fetchProductById, type PosProduct } from "@/api/pos/products";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState<PosProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) {
        setError("Geen product-id opgegeven");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (e: any) {
        setError(e?.message ?? "Kon product niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const title = product?.name
    ? `Product detail – ${product.name}`
    : id
    ? `Product detail – ${id}`
    : "Product detail";

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">{title}</div>
        {id && (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="pm-btn-green" onClick={() => nav(`/pos/products/${id}/edit`)}>
              Bewerken
            </button>
            <button className="pm-btn-green" onClick={() => nav(`/pos/products/${id}/variants`)}>
              Varianten
            </button>
          </div>
        )}
      </div>

      <div className="pm-table">
        {loading && <div className="pm-item">Product wordt geladen…</div>}
        {error && !loading && <div className="pm-item">Fout: {error}</div>}
        {!loading && !error && (
          <div className="pm-list">
            {product === null ? (
              <div className="pm-item">
                Geen productdetails beschikbaar (backend detail-endpoint ontbreekt nog).
              </div>
            ) : (
              <>
                <div className="pm-item">Naam: {product.name}</div>
                <div className="pm-item">Actief: {product.isActive ? "Ja" : "Nee"}</div>
                <div className="pm-item">Categorie: {product.categoryId ?? "-"}</div>
                <div className="pm-item">Omzetgroep: {product.revenueGroupId ?? "-"}</div>
                <div className="pm-item">Varianten: {product.variants?.length ?? 0}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
