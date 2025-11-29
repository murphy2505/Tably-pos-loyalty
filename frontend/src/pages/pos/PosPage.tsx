import React from "react";
import "../../styles/pos/pos.css";

const dummyProducts = [
  { id: 1, name: "Friet groot", price: 3.8, badge: "Meest verkocht" },
  { id: 2, name: "Friet speciaal", price: 4.5 },
  { id: 3, name: "Kroket", price: 2.3 },
  { id: 4, name: "Frikandel speciaal", price: 3.1 },
  { id: 5, name: "Bamischijf", price: 2.7 },
  { id: 6, name: "Cola 33cl", price: 2.6 },
  { id: 7, name: "Fanta 33cl", price: 2.6 },
  { id: 8, name: "Milkshake aardbei", price: 4.2 },
];

const dummyLines = [
  { id: 1, name: "Friet groot", qty: 2, price: 3.8 },
  { id: 2, name: "Frikandel speciaal", qty: 1, price: 3.1 },
  { id: 3, name: "Cola 33cl", qty: 2, price: 2.6 },
];

export default function PosPage() {
  const subtotal = dummyLines.reduce((sum, l) => sum + l.qty * l.price, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="pos-page">
      <div className="pos-main">
        {/* LINKERKANT – producten */}
        <section className="pos-left">
          <div className="pos-category-bar">
            <button className="pos-category-button is-active">Populair</button>
            <button className="pos-category-button">Friet</button>
            <button className="pos-category-button">Snacks</button>
            <button className="pos-category-button">Menu&apos;s</button>
            <button className="pos-category-button">Drinken</button>
          </div>

          <div className="pos-products">
            <div className="pos-products-grid">
              {dummyProducts.map((p) => (
                <button key={p.id} className="pos-product-card">
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
            <div className="pos-order-title">Bon #123</div>
            <span className="pos-order-status">Actief</span>
          </div>

          <div className="pos-order-lines">
            {dummyLines.map((l) => (
              <div key={l.id} className="pos-order-line">
                <div>
                  <div>{l.name}</div>
                  <div className="pos-order-line-sub">
                    {l.qty} × € {l.price.toFixed(2)}
                  </div>
                </div>
                <div className="pos-order-line-total">
                  € {(l.qty * l.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="pos-order-summary">
            <div className="pos-order-summary-row">
              <span>Subtotaal</span>
              <span>€ {subtotal.toFixed(2)}</span>
            </div>
            <div className="pos-order-summary-row">
              <span>Korting</span>
              <span>€ {discount.toFixed(2)}</span>
            </div>
            <div className="pos-order-summary-row total">
              <span>Totaal (incl. btw)</span>
              <span>€ {total.toFixed(2)}</span>
            </div>
          </div>

          <button className="pos-pay-button">Afrekenen</button>
        </aside>
      </div>

      {/* ONDERBALK */}
      <div className="pos-bottom-bar">
        <button className="pos-bottom-button">Bestellingen</button>
        <button className="pos-bottom-button">Tafelbonnen</button>
        <button className="pos-bottom-button">Planning</button>
        <button className="pos-bottom-button">Cadeaukaart</button>
        <button className="pos-bottom-button">Print laatste bon</button>
      </div>
    </div>
  );
}
