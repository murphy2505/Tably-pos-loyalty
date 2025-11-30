export default function ProductGrid({ products, onClick }: { products: { id: string; name: string; price: number; badge?: string }[]; onClick: (id: string) => void }) {
  return (
    <div className="pos-products">
      <div className="pos-products-grid">
        {products.map((p) => (
          <button key={p.id} className="pos-product-card" type="button" onClick={() => onClick(p.id)}>
            <div>
              <div className="pos-product-name">{p.name}</div>
              <div className="pos-product-price">€ {p.price.toFixed(2)}</div>
              {p.badge && <span className="pos-product-badge">{p.badge}</span>}
            </div>
            <span className="pos-product-add-button">Toevoegen</span>
          </button>
        ))}
      </div>
    </div>
  );
}
