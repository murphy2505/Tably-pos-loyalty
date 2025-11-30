export default function OrderItemRow({ item, onIncrease, onDecrease, onRemove }: { item: { id: string; name: string; qty: number; price: number }; onIncrease: () => void; onDecrease: () => void; onRemove: () => void }) {
  return (
    <div className="pos-order-line">
      <div>
        <div className="pos-order-line-name">{item.name}</div>
        <div className="pos-order-line-sub">{item.qty} × € {item.price.toFixed(2)}</div>
      </div>
      <div className="pos-order-line-controls">
        <button className="pos-qty-button" type="button" onClick={onDecrease}>-</button>
        <span className="pos-qty-value">{item.qty}</span>
        <button className="pos-qty-button" type="button" onClick={onIncrease}>+</button>
        <button className="pos-remove-button" type="button" onClick={onRemove}>🗑️</button>
        <div className="pos-order-line-total">€ {(item.qty * item.price).toFixed(2)}</div>
      </div>
    </div>
  );
}
