import { useState } from "react";

export function DashboardGiftcardsRedeemPage() {
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: hier later call naar backend
    // eslint-disable-next-line no-console
    console.log("Redeem giftcard code:", code);
  }

  return (
    <div className="giftcards-page">
      <div className="giftcards-card">
        <h1 className="giftcards-title">Verzilveren of uitgeven</h1>
        <p className="giftcards-subtitle">
          Vul de code in die achterop de cadeaubon staat om deze te verzilveren of uit te geven.
        </p>

        <form onSubmit={handleSubmit} className="giftcards-input-row">
          <input
            className="giftcards-input"
            placeholder="Cadeaubon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="giftcards-button" type="submit" disabled={!code.trim()}>
            Verzilveren
          </button>
        </form>
      </div>
    </div>
  );
}
