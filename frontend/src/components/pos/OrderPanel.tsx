import OrderItemRow from "./OrderItemRow";

export default function OrderPanel({ items, totals, onClear, onPay }: { items: { id: string; name: string; qty: number; price: number }[]; totals: { subtotal: number; discount: number; total: number }; onClear: () => void; onPay: () => void }) {
  return (
    <aside className="pos-right pos-order">
      <div className="pos-order-header">
        <div className="pos-order-title">Bon</div>
        <span className="pos-order-status">Actief</span>
      </div>
      <div className="pos-order-lines">
        {items.length === 0 ? (
          <div className="pos-order-empty">(Nog geen items op de bon)</div>
        ) : (
          items.map((it) => (
            <OrderItemRow key={it.id} item={it} onIncrease={() => {}} onDecrease={() => {}} onRemove={() => {}} />
          ))
        )}
      </div>
      <div className="pos-order-summary">
        <div className="pos-order-summary-row"><span>Subtotaal</span><span>€ {totals.subtotal.toFixed(2)}</span></div>
        <div className="pos-order-summary-row"><span>Korting</span><span>€ {totals.discount.toFixed(2)}</span></div>
        <div className="pos-order-summary-row total"><span>Totaal (incl. btw)</span><span>€ {totals.total.toFixed(2)}</span></div>
      </div>
      <button className="pos-secondary-button" type="button" onClick={onClear}>Leeg bon</button>
      <button className="pos-pay-button" type="button" onClick={onPay}>Afrekenen</button>
    </aside>
  );
}
