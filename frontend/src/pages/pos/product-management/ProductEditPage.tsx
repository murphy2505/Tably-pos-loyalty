// frontend/src/pages/pos/product-management/ProductEditPage.tsx
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
void [apiListProducts, apiCreateProduct, apiDeleteProduct];
import { apiListCategories } from "../../../api/pos/categories";
import { fetchRevenueGroups } from "../../../api/pos/revenueGroups";
import { useParams } from "react-router-dom";

const ProductEditPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<PosProduct | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const [p, cats, grps] = await Promise.all([
        apiGetProduct(id),
        apiListCategories(),
        fetchRevenueGroups(),
      ]);

      setProduct(p);
      setCategories(cats);
      setGroups(grps);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="pm-wrapper">Laden…</div>;
  if (!product) return <div className="pm-wrapper">Product niet gevonden</div>;

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Product bewerken</div>
      </div>

      <div className="pm-table">
        <div className="pm-item">
          <label>Naam</label>
          <input defaultValue={product.name} />
        </div>

        <div className="pm-item">
          <label>Categorie</label>
          <select defaultValue={product.categoryId ?? ""}>
            <option value="">Geen categorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pm-item">
          <label>Omzetgroep</label>
          <select defaultValue={product.revenueGroupId ?? ""}>
            <option value="">Geen omzetgroep</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
