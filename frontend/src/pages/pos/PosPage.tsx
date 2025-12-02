// src/pages/pos/PosPage.tsx
import { useEffect, useState } from "react";
import "../../styles/pos/pos.css";

import type {
  PosProduct,
  PosOrderLine,
  PosOrderTotals,
} from "../../types/pos";

import {
  fetchPosProducts,
  calculateTotals,
} from "../../services/posService";

import {
  createPosOrder,
  type PaymentMethod,
} from "../../services/ordersService";

import {
  createKdsTicket,
  type KdsStatus,
} from "../../services/kdsService";

// --------------------------------------------------------
// Config & types
// --------------------------------------------------------

const categories = ["Populair", "Friet", "Snacks", "Menu's", "Drinken"];

type ParkedOrder = {
  id: string;
  label: string;
  lines: PosOrderLine[];
  totals: PosOrderTotals;
};

// --------------------------------------------------------
// Component
// --------------------------------------------------------

export default function PosPage() {
  // Producten & order
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [orderLines, setOrderLines] = useState<PosOrderLine[]>([]);
  const [totals, setTotals] = useState<PosOrderTotals>({
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  // UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Populair");

  // Betaling
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null);

  // Parkeren
  const [parkedOrders, setParkedOrders] = useState<ParkedOrder[]>([]);
  const [currentTicketNumber, setCurrentTicketNumber] = useState(123);

  // --------------------------------------------------------
  // Producten laden
  // --------------------------------------------------------

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

  // --------------------------------------------------------
  // Afgeleide data
  // --------------------------------------------------------

  const filteredProducts =
    activeCategory === "Populair"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // --------------------------------------------------------
  // Handlers – orderregels
  // --------------------------------------------------------

  function onProductClick(product: PosProduct) {
    setOrderLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      let next: PosOrderLine[];

      if (existing) {
        next = prev.map((l) =>
          l.productId === product.id ? { ...l, qty: l.qty + 1 } : l
        );
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

  function increaseQty(productId: number) {
    setOrderLines((prev) => {
      const next = prev.map((l) =>
        l.productId === productId ? { ...l, qty: l.qty + 1 } : l
      );
      setTotals(calculateTotals(next));
      return next;
    });
  }

  function decreaseQty(productId: number) {
    setOrderLines((prev) => {
      const next = prev
        .map((l) =>
          l.productId === productId ? { ...l, qty: l.qty - 1 } : l
        )
        .filter((l) => l.qty > 0);

      setTotals(calculateTotals(next));
      return next;
    });
  }

  function removeLine(productId: number) {
    setOrderLines((prev) => {
      const next = prev.filter((l) => l.productId !== productId);
      setTotals(calculateTotals(next));
      return next;
    });
  }

  function handleClearOrder() {
    setOrderLines([]);
    setTotals({ subtotal: 0, discount: 0, total: 0 });
  }

  // --------------------------------------------------------
  // Parkeren
  // --------------------------------------------------------

  function handleParkOrder() {
    if (orderLines.length === 0) return;

    const id = `T${currentTicketNumber}`;

    const parked: ParkedOrder = {
      id,
      label: `Bon ${currentTicketNumber}`,
      lines: orderLines,
      totals,
    };

    setParkedOrders((prev) => [...prev, parked]);
    setCurrentTicketNumber((n) => n + 1);
    handleClearOrder();
  }

  function handleRestoreParkedOrder(orderId: string) {
    setParkedOrders((prev) => {
      const found = prev.find((p) => p.id === orderId);
      if (!found) return prev;

      setOrderLines(found.lines);
      setTotals(found.totals);

      const parsed = parseInt(orderId.replace("T", ""), 10);
      if (!Number.isNaN(parsed)) setCurrentTicketNumber(parsed);

      return prev.filter((p) => p.id !== orderId);
    });
  }

  // --------------------------------------------------------
  // Betalen
  // --------------------------------------------------------

  async function handleConfirmPayment() {
    if (!paymentMethod) return;

    try {
      const result = await createPosOrder({
        lines: orderLines,
        totals,
        paymentMethod,
        source: "counter",
      });

      await createKdsTicket({
        id: result.orderId,
        items: orderLines.map((l) => ({
          id: `${result.orderId}-${l.productId}`,
          productId: String(l.productId),
          name: l.name,
          quantity: l.qty,
        })),
        status: "open" as KdsStatus,
      });
    } catch (e) {
      console.error("Failed to process order", e);
    } finally {
      setIsPaying(false);
      setPaymentMethod(null);
      handleClearOrder();
    }
  }

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------

  return (
    <div className="pos-page mint-glass-card">
      {/* MAIN GRID (producten links / bon rechts) */}
      <div className="pos-main">
        {/* LINKERKANT – producten */}
        <section className="pos-left">
          <div className="pos-category-bar">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={
                  "pos-category-button" +
                  (activeCategory === c ? " is-active" : "")
                }
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="pos-products">
            <div className="pos-products-grid">
              {loading && (
                <div className="pos-loading">Producten laden...</div>
              )}
              {error && <div className="pos-error">{error}</div>}

              {!loading &&
                !error &&
                filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="pos-product-card"
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
            <div className="pos-order-title">Bon #{currentTicketNumber}</div>
            <span className="pos-order-status">Actief</span>
          </div>

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
                    <button
                      type="button"
                      className="pos-qty-button"
                      onClick={() => decreaseQty(l.productId)}
                    >
                      -
                    </button>
                    <span className="pos-qty-value">{l.qty}</span>
                    <button
                      type="button"
                      className="pos-qty-button"
                      onClick={() => increaseQty(l.productId)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="pos-remove-button"
                      onClick={() => removeLine(l.productId)}
                    >
                      🗑️
                    </button>
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

          <div className="pos-order-actions">
            <button
              type="button"
              className="pos-secondary-button"
              onClick={handleParkOrder}
            >
              Parkeer bon
            </button>
            <button
              type="button"
              className="pos-secondary-button"
              onClick={handleClearOrder}
            >
              Leeg bon
            </button>
            <button
              type="button"
              className="pos-pay-button"
              onClick={() => setIsPaying(true)}
              disabled={orderLines.length === 0}
            >
              Afrekenen
            </button>
          </div>
        </aside>
      </div>

      {/* ONDERBALK */}
      <div className="pos-bottom-bar">
        <button type="button" className="pos-bottom-button">
          Bestellingen
        </button>
        <button type="button" className="pos-bottom-button">
          Tafelbonnen
        </button>
        <button type="button" className="pos-bottom-button">
          Planning
        </button>
        <button type="button" className="pos-bottom-button">
          Cadeaukaart
        </button>
        <button type="button" className="pos-bottom-button">
          Print laatste bon
        </button>
      </div>

      {/* BETALING OVERLAY */}
      {isPaying && (
        <div className="pos-pay-overlay">
          <div className="pos-pay-panel">
            <div className="pos-pay-header">
              <h3>Betaling</h3>
              <button
                type="button"
                className="pos-pay-close"
                onClick={() => setIsPaying(false)}
              >
                ✕
              </button>
            </div>

            <div className="pos-pay-amount">
              Te betalen: <strong>€ {totals.total.toFixed(2)}</strong>
            </div>

            <div className="pos-pay-methods">
              {["cash", "card", "sumup", "qr"].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={
                    "pos-pay-method" +
                    (paymentMethod === m ? " is-selected" : "")
                  }
                  onClick={() => setPaymentMethod(m as PaymentMethod)}
                >
                  {m === "cash" && "Contant"}
                  {m === "card" && "Pin / Bankkaart"}
                  {m === "sumup" && "SumUp terminal"}
                  {m === "qr" && "QR / Wallet"}
                </button>
              ))}
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
                onClick={handleConfirmPayment}
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
