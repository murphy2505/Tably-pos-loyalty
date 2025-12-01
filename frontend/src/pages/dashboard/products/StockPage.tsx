import { useEffect, useState } from "react";
import { getStock, getStockHistory, postDelivery, postWaste, postAdjust } from "../../../api/pos/stock";
import StockMovementModal from "./StockMovementModal";

type StockItem = { id: string; name: string; unit: string; quantity: number; minimum: number };

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movementOpen, setMovementOpen] = useState(false);
  const [movementType, setMovementType] = useState<"PURCHASE" | "WASTE" | "ADJUSTMENT">("PURCHASE");
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getStock();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Kon voorraad niet laden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openMovement(item: StockItem, type: "PURCHASE" | "WASTE" | "ADJUSTMENT") {
    setSelectedItem(item);
    setMovementType(type);
    setMovementOpen(true);
  }

  async function handleSubmit(amount: number, reason?: string) {
    if (!selectedItem) return;
    const payload = { stockItemId: selectedItem.id, amount, reason };
    if (movementType === "PURCHASE") await postDelivery(payload);
    if (movementType === "WASTE") await postWaste(payload);
    if (movementType === "ADJUSTMENT") await postAdjust(payload);
    setMovementOpen(false);
    await load();
  }

  return (
    <div>
      <h1>Voorraad</h1>
      {loading && <div>Bezig met laden…</div>}
      {error && <div style={{ color: "red" }}>Fout: {error}</div>}
      {!loading && !error && (
        <div className="card">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Naam</th>
                <th>Eenheid</th>
                <th>Voorraad</th>
                <th>Minimum</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td style={{ textAlign: "center" }}>{s.unit}</td>
                  <td style={{ textAlign: "center" }}>{s.quantity}</td>
                  <td style={{ textAlign: "center" }}>{s.minimum}</td>
                  <td style={{ textAlign: "center" }}>
                    <button className="kds-btn" type="button" onClick={() => openMovement(s, "PURCHASE")}>Levering</button>{" "}
                    <button className="kds-btn" type="button" onClick={() => openMovement(s, "WASTE")}>Derving</button>{" "}
                    <button className="kds-btn" type="button" onClick={() => openMovement(s, "ADJUSTMENT")}>Correctie</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5}>Geen voorraaditems</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {movementOpen && selectedItem && (
        <StockMovementModal
          item={selectedItem}
          type={movementType}
          onCancel={() => setMovementOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
