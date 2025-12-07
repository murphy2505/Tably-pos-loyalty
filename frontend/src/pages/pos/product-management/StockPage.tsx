import React from "react";
import "./../../../styles/pos/pos-management.css";

const StockPage: React.FC = () => {
  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Voorraadbeheer</div>
      </div>

      <div className="pm-table">
        <div className="pm-list">
          <div className="pm-item">Voorraad item voorbeeld…</div>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
