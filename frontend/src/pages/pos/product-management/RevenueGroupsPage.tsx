// frontend/src/pages/pos/product-management/RevenueGroupsPage.tsx
import React, { useEffect, useState } from "react";
import "../../../styles/pos/pos-management.css";

import {
  fetchRevenueGroups,
  type RevenueGroup,
} from "../../../api/pos/revenueGroups";

const RevenueGroupsPage: React.FC = () => {
  const [items, setItems] = useState<RevenueGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchRevenueGroups();
      setItems(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Omzetgroepen</div>
        <button className="pm-btn-green">+ Nieuwe omzetgroep</button>
      </div>

      {loading && <div className="pm-item">Laden…</div>}

      {!loading && (
        <div className="pm-list">
          {items.map((g) => (
            <div key={g.id} className="pm-item">
              <span>{g.name}</span>
              <span style={{ opacity: 0.7 }}>{g.color ?? ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RevenueGroupsPage;
