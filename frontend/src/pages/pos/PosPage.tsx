// frontend/src/pages/pos/PosPage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type PosProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  popular?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
};

const categories = ["Populair", "Friet", "Snacks", "Menu's", "Drinken"];

// TODO: vervang dit door je echte producten uit backend / context
const demoProducts: PosProduct[] = [
  { id: "1", name: "Friet klein", price: 2.9, category: "Friet", popular: true },
  { id: "2", name: "Friet groot", price: 3.8, category: "Friet", bestSeller: true },
  { id: "3", name: "Frikandel", price: 2.5, category: "Snacks" },
  { id: "4", name: "Frikandel speciaal", price: 3.1, category: "Snacks" },
  { id: "5", name: "Kroket", price: 2.7, category: "Snacks", isNew: true },
  { id: "6", name: "Bamischijf", price: 2.7, category: "Snacks" },
  { id: "7", name: "Menu saté", price: 11.5, category: "Menu's", isNew: true },
  { id: "8", name: "Cola 33cl", price: 2.6, category: "Drinken" },
  { id: "9", name: "Fanta 33cl", price: 2.6, category: "Drinken" },
  { id: "10", name: "Milkshake aardbei", price: 4.2, category: "Drinken" },
];

type PaymentMethod = "cash" | "card" | "ideal";

export default function PosPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("Populair");

  // dummy order-totaal
  const [orderTotal] = useState<number>(0);

  // betaalscherm state
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const products = demoProducts;

  // Populair-tab = alle producten met één van de badges
  const visibleProducts = useMemo(
    () =>
      products.filter((p) =>
        activeCategory === "Populair"
          ? p.popular || p.bestSeller || p.isNew
          : p.category === activeCategory
      ),
    [products, activeCategory]
  );

  const handleAddProduct = (product: PosProduct) => {
    // TODO: hier je bon-/order-logica
    console.log("Toevoegen:", product);
  };

  const handleOpenPay = () => {
    setIsPayOpen(true);
  };

  const handleConfirmPay = () => {
    if (!paymentMethod) return;
    // TODO: hier SumUp / betaal-flow starten
    console.log("Bevestig betaling:", paymentMethod);
    setIsPayOpen(false);
    setPaymentMethod(null);
  };

  const handleAbortTicket = () => {
    // TODO: dialoog "Weet je zeker dat je deze bon wilt afbreken?"
    console.log("Bon afbreken (confirm dialoog komt later)");
  };

  const subtotal = orderTotal;
  const discount = 0;
  const total = subtotal - discount;

  return (
    <>
      {/* LINKERKANT – productgrid */}
      <div className="pos-products-area">
        <div className="pos-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={
                "pos-category-tab" +
                (cat === activeCategory ? " pos-category-tab--active" : "")
              }
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="pos-products-grid">
          {visibleProducts.map((p) => (
            <button
              key={p.id}
              className="pos-product-tile"
              onClick={() => handleAddProduct(p)}
              onContextMenu={(e) => {
                e.preventDefault();
                // TODO: long-press / right-click voor details / modifiers
              }}
            >
              <div className="pos-product-main">
                <div className="pos-product-name">{p.name}</div>

                <div className="pos-product-badges">
                  {p.popular && (
                    <span className="pos-product-badge">Populair</span>
                  )}
                  {p.bestSeller && (
                    <span className="pos-product-badge">Meest verkocht</span>
                  )}
                  {p.isNew && <span className="pos-product-badge">Nieuw</span>}
                </div>
              </div>

              <div className="pos-product-footer">
                <span className="pos-product-add">Toevoegen</span>
                <span className="pos-product-price">
                  € {p.price.toFixed(2)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RECHTERKANT – bonpaneel */}
      <aside className="pos-ticket-area">
        <div className="pos-ticket-header">
          <span className="pos-ticket-title">Bon #123</span>
          <span className="pos-ticket-status">Actief</span>
        </div>

        <div className="pos-ticket-lines">
          <p>Geparkeerde bonnen: Geen</p>
          <p>(Nog geen items op de bon)</p>
        </div>

        <div className="pos-ticket-summary">
          <div className="pos-ticket-summary-row">
            <span>Subtotaal</span>
            <span>€ {subtotal.toFixed(2)}</span>
          </div>
          <div className="pos-ticket-summary-row">
            <span>Korting</span>
            <span>€ {discount.toFixed(2)}</span>
          </div>
          <div className="pos-ticket-summary-row total">
            <span>Totaal (incl. btw)</span>
            <span>€ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Acties onder de bon: Bon afbreken + Afrekenen */}
        <div className="pos-ticket-actions">
          <button
            type="button"
            className="pos-ticket-button pos-ticket-button--danger"
            onClick={handleAbortTicket}
          >
            Bon afbreken
          </button>
          <button
            type="button"
            className="pos-ticket-button pos-ticket-button--primary"
            onClick={handleOpenPay}
          >
            Afrekenen
          </button>
        </div>
      </aside>

      {/* ONDERBALK – alleen utility links */}
      <div className="pos-bottom-bar">
        <div className="pos-bottom-left">
          <button
            className="pos-bottom-button"
            onClick={() => navigate("/pos/kassa")}
          >
            Bestellingen
          </button>
          <button
            className="pos-bottom-button"
            onClick={() => navigate("/pos/tables")}
          >
            Tafelbonnen
          </button>
          <button
            className="pos-bottom-button"
            onClick={() => navigate("/pos/planning")}
          >
            Planning
          </button>
          <button
            className="pos-bottom-button"
            onClick={() => {
              // TODO: korting-overlay of /pos/discounts
            }}
          >
            Korting
          </button>
          <button
            className="pos-bottom-button"
            onClick={() => navigate("/pos/giftcards")}
          >
            Cadeaukaart
          </button>
          <button
            className="pos-bottom-button"
            onClick={() => navigate("/pos/customers")}
          >
            Klanten
          </button>
          <button
            className="pos-bottom-button"
            onClick={() => navigate("/pos/reports")}
          >
            Rapporten
          </button>
          <button
            className="pos-bottom-button"
            onClick={() => {
              // TODO: /pos/settings of instellingen-overlay
            }}
          >
            Instellingen
          </button>
          <button
            className="pos-bottom-button"
            onClick={() => {
              // TODO: print laatste bon
            }}
          >
            Print laatste bon
          </button>
        </div>
      </div>

      {/* BETAALSCHERM OVERLAY */}
      {isPayOpen && (
        <div className="pos-pay-overlay">
          <div className="pos-pay-panel">
            <div className="pos-pay-header">
              <h3>Betalen</h3>
              <button
                className="pos-pay-close"
                onClick={() => setIsPayOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="pos-pay-amount">
              Totaal: <strong>€ {total.toFixed(2)}</strong>
            </div>

            <div className="pos-pay-methods">
              <button
                type="button"
                className={
                  "pos-pay-method" +
                  (paymentMethod === "cash" ? " is-selected" : "")
                }
                onClick={() => setPaymentMethod("cash")}
              >
                Contant
              </button>
              <button
                type="button"
                className={
                  "pos-pay-method" +
                  (paymentMethod === "card" ? " is-selected" : "")
                }
                onClick={() => setPaymentMethod("card")}
              >
                Pin / Kaart
              </button>
              <button
                type="button"
                className={
                  "pos-pay-method" +
                  (paymentMethod === "ideal" ? " is-selected" : "")
                }
                onClick={() => setPaymentMethod("ideal")}
              >
                iDEAL
              </button>
            </div>

            <div className="pos-pay-actions">
              <button
                type="button"
                className="pos-pay-cancel"
                onClick={() => {
                  setIsPayOpen(false);
                  setPaymentMethod(null);
                }}
              >
                Annuleren
              </button>
              <button
                type="button"
                className="pos-pay-confirm"
                disabled={!paymentMethod}
                onClick={handleConfirmPay}
              >
                Bevestig betaling
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
