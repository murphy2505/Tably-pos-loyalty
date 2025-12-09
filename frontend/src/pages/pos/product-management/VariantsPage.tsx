// frontend/src/pages/pos/product-management/VariantsPage.tsx
import React, { useEffect, useState } from "react";
import "../../../styles/pos/pos-management.css";

import {
  apiListProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiGetProduct,
} from "../../../api/pos/products";
import type { Product as PosProduct } from "../../../api/pos/products";
void [apiListProducts, apiCreateProduct, apiUpdateProduct, apiDeleteProduct];

import { useParams } from "react-router-dom";

const VariantsPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<PosProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const p = await apiGetProduct(id);
        setProduct(p);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="pm-wrapper">Laden…</div>;
  }

  if (!product) {
    return <div className="pm-wrapper">Product niet gevonden</div>;
  }

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Porties voor {product.name}</div>
        <button className="pm-btn-green">+ Nieuwe portie</button>
      </div>

      <div className="pm-list">
        {product.variants?.length ? (
          product.variants.map((v) => (
            <div key={v.id} className="pm-item">
              <span>{v.name}</span>
              <span>€{v.price.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <div className="pm-item">Nog geen porties</div>
        )}
      </div>
    </div>
  );
};

export default VariantsPage;
