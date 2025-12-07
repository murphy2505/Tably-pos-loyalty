import React from "react";
import "./../../../styles/pos/pos-management.css";

const MenusPage: React.FC = () => {
  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Menukaarten</div>
        <button className="pm-btn-green">+ Nieuwe menukaart</button>
      </div>

      <div className="pm-table">
        <div className="pm-list">
          <div className="pm-item">Menukaart voorbeeld…</div>
        </div>
      </div>
    </div>
  );
};

export default MenusPage;
