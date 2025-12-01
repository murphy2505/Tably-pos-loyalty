import { useState } from "react";

export default function EditProductModal({
  initial,
  onCancel,
  onSave,
}: {
  initial?: { name: string; categoryId?: string };
  onCancel: () => void;
  onSave: (data: { name: string; categoryId?: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");

  return (
    <div className="pos-pay-overlay">
      <div className="pos-pay-panel">
        <div className="pos-pay-header">
          <h3>{initial ? "Product bewerken" : "Nieuw product"}</h3>
          <button className="pos-pay-close" type="button" onClick={onCancel}>✕</button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            Naam
            <input
              style={{ width: "100%" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Categorie-id (optioneel)
            <input
              style={{ width: "100%" }}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
          </label>
        </div>
        <div className="pos-pay-actions" style={{ marginTop: 12 }}>
          <button className="pos-secondary-button" type="button" onClick={onCancel}>Annuleer</button>
          <button
            className="pos-pay-confirm"
            type="button"
            onClick={() => onSave({ name, categoryId: categoryId || undefined })}
            disabled={!name.trim()}
          >
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}
