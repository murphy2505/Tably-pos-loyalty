// frontend/src/pages/pos/product-management/ProductDetailPage.tsx
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

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<PosProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const p = await apiGetProduct(id);
      setProduct(p);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="pm-wrapper">Laden…</div>;
  if (!product) return <div className="pm-wrapper">Product niet gevonden</div>;

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">{product.name}</div>
      </div>

      <div className="pm-table">
        Variants:
        <div className="pm-list">
          {product.variants?.map((v: any) => (
            <div key={v.id} className="pm-item">
              {v.name} — €{v.price.toFixed(2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
