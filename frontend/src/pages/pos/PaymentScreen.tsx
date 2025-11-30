export default function PaymentScreen({ amount, onCancel, onConfirm }: { amount: number; onCancel: () => void; onConfirm: (method: "CASH" | "PIN" | "OTHER") => void }) {
  return (
    <div className="pos-pay-overlay">
      <div className="pos-pay-panel">
        <div className="pos-pay-header">
          <h3>Betaling</h3>
          <button className="pos-pay-close" type="button" onClick={onCancel}>✕</button>
        </div>
        <div className="pos-pay-amount">Te betalen: <strong>€ {amount.toFixed(2)}</strong></div>
        <div className="pos-pay-methods">
          <button type="button" className="pos-pay-method" onClick={() => onConfirm("CASH")}>Contant</button>
          <button type="button" className="pos-pay-method" onClick={() => onConfirm("PIN")}>Pin / Bankkaart</button>
          <button type="button" className="pos-pay-method" onClick={() => onConfirm("OTHER")}>Overig</button>
        </div>
        <div className="pos-pay-actions">
          <button type="button" className="pos-secondary-button" onClick={onCancel}>Annuleer</button>
        </div>
      </div>
    </div>
  );
}
