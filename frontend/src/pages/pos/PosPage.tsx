import { useEffect, useState } from "react";
import "../../styles/pos/pos.css";
import type { PosProduct, PosOrderLine, PosOrderTotals } from "../../types/pos";
import { fetchPosProducts, calculateTotals } from "../../services/posService";

const categories = ["Populair", "Friet", "Snacks", "Menu's", "Drinken"];

export default function PosPage() {
  // State
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [orderLines, setOrderLines] = useState<PosOrderLine[]>([]);
  const [totals, setTotals] = useState<PosOrderTotals>({
    subtotal: 0,
    discount: 0,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Populair");

  // NEW payment state
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "sumup" | "qr" | null>(null);

  const [parkedOrders, setParkedOrders] = useState<ParkedOrder[]>([]);
  const [currentTicketNumber, setCurrentTicketNumber] = useState<number>(123);

  // Effects
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPosProducts();
        setProducts(data);
      } catch {
        setError("Kon producten niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Afgeleide data
  const filteredProducts =
    activeCategory === "Populair"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Handlers
  function onProductClick(product: PosProduct) {
    setOrderLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === product.id);
      let next: PosOrderLine[];

      if (idx >= 0) {
        next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
      } else {
        next = [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
          },
        ];
      }

      setTotals(calculateTotals(next));
      return next;
    });
  }

  function handleClearOrder() {
    setOrderLines([]);
    setTotals({ subtotal: 0, discount: 0, total: 0 });
  }

  function handleParkOrder() {
    if (orderLines.length === 0) return;

    const id = `T${currentTicketNumber}`;
    const label = `Bon ${currentTicketNumber}`;

    const parked: ParkedOrder = {
      id,
      label,
      lines: orderLines,
      totals,
    };

    setParkedOrders((prev) => [...prev, parked]);

    // huidige bon leegmaken, maar ticketnummer alvast omhoog
    setCurrentTicketNumber((prev) => prev + 1);
    handleClearOrder();
  }

  function handleRestoreParkedOrder(orderId: string) {
    setParkedOrders((prev) => {
      const found = prev.find((p) => p.id === orderId);
      if (!found) return prev;

      setOrderLines(found.lines);
      setTotals(found.totals);

      // ticketnummer zetten op id (optioneel, hier doen we het wel)
      const parsed = parseInt(found.id.replace("T", ""), 10);
      if (!Number.isNaN(parsed)) {
        setCurrentTicketNumber(parsed);
      }

      return prev.filter((p) => p.id !== orderId);
    });
  }

  return (
    <div className="pos-page">
      <div className="pos-main">
        {/* LINKERKANT – producten */}
        <section className="pos-left">
          <div className="pos-category-bar">
            {categories.map((c) => (
              <button
                key={c}
                className={
                  "pos-category-button" +
                  (activeCategory === c ? " is-active" : "")
                }
                type="button"
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="pos-products">
            <div className="pos-products-grid">
              {loading && (
                <div style={{ padding: 8, color: "#e5e7eb" }}>
                  Producten laden...
                </div>
              )}
              {error && !loading && (
                <div style={{ padding: 8, color: "#e5e7eb" }}>{error}</div>
              )}
              {!loading &&
                !error &&
                filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    className="pos-product-card"
                    type="button"
                    onClick={() => onProductClick(p)}
                  >
                    <div>
                      <div className="pos-product-name">{p.name}</div>
                      <div className="pos-product-price">
                        € {p.price.toFixed(2)}
                      </div>
                      {p.badge && (
                        <span className="pos-product-badge">{p.badge}</span>
                      )}
                    </div>
                    <span className="pos-product-add-button">Toevoegen</span>
                  </button>
                ))}
            </div>
          </div>
        </section>

        {/* RECHTERKANT – bon */}
        <aside className="pos-right pos-order">
          <div className="pos-order-header">
            <div className="pos-order-title">
              Bon #{currentTicketNumber}
            </div>
            <span className="pos-order-status">Actief</span>
          </div>

          {/* Geparkeerde bonnen */}
          <div className="pos-parked-orders">
            <span className="pos-parked-title">Geparkeerde bonnen</span>
            <div className="pos-parked-list">
              {parkedOrders.length === 0 ? (
                <span className="pos-parked-empty">Geen</span>
              ) : (
                parkedOrders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="pos-parked-chip"
                    onClick={() => handleRestoreParkedOrder(o.id)}
                  >
                    {o.label} · € {o.totals.total.toFixed(2)}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="pos-order-lines">
            {orderLines.length === 0 ? (
              <div className="pos-order-empty">
                (Nog geen items op de bon)
              </div>
            ) : (
              orderLines.map((l) => (
                <div key={l.productId} className="pos-order-line">
                  <div>
                    <div className="pos-order-line-name">{l.name}</div>
                    <div className="pos-order-line-sub">
                      {l.qty} × € {l.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="pos-order-line-controls">
                    <button className="pos-qty-button" type="button" onClick={() => decreaseQty(l.productId)}>-</button>
                    <span className="pos-qty-value">{l.qty}</span>
                    <button className="pos-qty-button" type="button" onClick={() => increaseQty(l.productId)}>+</button>
                    <button className="pos-remove-button" type="button" onClick={() => removeLine(l.productId)}>🗑️</button>
                    <div className="pos-order-line-total">
                      € {(l.qty * l.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pos-order-summary">
            <div className="pos-order-summary-row">
              <span>Subtotaal</span>
              <span>€ {totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="pos-order-summary-row">
              <span>Korting</span>
              <span>€ {totals.discount.toFixed(2)}</span>
            </div>
            <div className="pos-order-summary-row total">
              <span>Totaal (incl. btw)</span>
              <span>€ {totals.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="pos-secondary-button"
            onClick={handleClearOrder}
            type="button"
          >
            Leeg bon
          </button>
          <button
            className="pos-pay-button"
            type="button"
            onClick={() => setIsPaying(true)}
            disabled={orderLines.length === 0}
          >
            Afrekenen
          </button>
        </aside>
      </div>

      {/* ONDERBALK */}
      <div className="pos-bottom-bar">
        <button className="pos-bottom-button" type="button">
          Bestellingen
        </button>
        <button className="pos-bottom-button" type="button">
          Tafelbonnen
        </button>
        <button className="pos-bottom-button" type="button">
          Planning
        </button>
        <button className="pos-bottom-button" type="button">
          Cadeaukaart
        </button>
        <button className="pos-bottom-button" type="button">
          Print laatste bon
        </button>
      </div>

      {isPaying && (
        <div className="pos-pay-overlay">
          <div className="pos-pay-panel">
            <div className="pos-pay-header">
              <h3>Betaling</h3>
              <button className="pos-pay-close" type="button" onClick={() => setIsPaying(false)}>✕</button>
            </div>
            <div className="pos-pay-amount">
              Te betalen: <strong>€ {totals.total.toFixed(2)}</strong>
            </div>
            <div className="pos-pay-methods">
              <button
                type="button"
                className={"pos-pay-method" + (paymentMethod === "cash" ? " is-selected" : "")}
                onClick={() => setPaymentMethod("cash")}
              >
                Contant
              </button>
              <button
                type="button"
                className={"pos-pay-method" + (paymentMethod === "card" ? " is-selected" : "")}
                onClick={() => setPaymentMethod("card")}
              >
                Pin / Bankkaart
              </button>
              <button
                type="button"
                className={"pos-pay-method" + (paymentMethod === "sumup" ? " is-selected" : "")}
                onClick={() => setPaymentMethod("sumup")}
              >
                SumUp terminal
              </button>
              <button
                type="button"
                className={"pos-pay-method" + (paymentMethod === "qr" ? " is-selected" : "")}
                onClick={() => setPaymentMethod("qr")}
              >
                QR / Wallet
              </button>
            </div>
            <div className="pos-pay-actions">
              <button
                type="button"
                className="pos-secondary-button"
                onClick={() => setIsPaying(false)}
              >
                Annuleer
              </button>
              <button
                type="button"
                className="pos-pay-confirm"
                disabled={!paymentMethod}
                onClick={() => {
                  console.log("Paid with:", paymentMethod, "Amount:", totals.total);
                  setIsPaying(false);
                  setPaymentMethod(null);
                  handleClearOrder();
                }}
              >
                Bevestig betaling
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
