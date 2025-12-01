import { useState } from "react";

export default function StockMovementModal({
  item,
  type,
  onCancel,
  onSubmit,
}: {
  item: { id: string; name: string };
  type: "PURCHASE" | "WASTE" | "ADJUSTMENT";
  onCancel: () => void;
  onSubmit: (amount: number, reason?: string) => void;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>("");

  return (
    <div className="pos-pay-overlay">
      <div className="pos-pay-panel">
        <div className="pos-pay-header">
          <h3>
            {type === "PURCHASE" && "Levering boeken"}
            {type === "WASTE" && "Derving boeken"}
            {type === "ADJUSTMENT" && "Correctie boeken"}
          </h3>
          <button className="pos-pay-close" type="button" onClick={onCancel}>✕</button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <div className="text-muted">Item: {item.name}</div>
          <label>
            Hoeveelheid
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
              style={{ width: "100%" }}
            />
          </label>
          <label>
            Reden (optioneel)
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div className="pos-pay-actions" style={{ marginTop: 12 }}>
          <button className="pos-secondary-button" type="button" onClick={onCancel}>Annuleer</button>
          <button
            className="pos-pay-confirm"
            type="button"
            onClick={() => onSubmit(amount, reason || undefined)}
            disabled={amount === 0}
          >
            Bevestig
          </button>
        </div>
      </div>
    </div>
  );
}
