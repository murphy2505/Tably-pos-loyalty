import { useEffect, useState } from "react";
import { getProducts } from "../../api/pos/products";

export default function PosProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => setProducts(await getProducts()))();
  }, []);

  return (
    <div className="pos-products-page">
      <h2>Producten</h2>

      <div className="product-list">
        {products.map((p: any) => (
          <div key={p.id} className="product-item mint-card">
            <div className="product-name">{p.name}</div>
            <div className="product-price">€ {p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
