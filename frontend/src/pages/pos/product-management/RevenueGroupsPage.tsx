import React, { useEffect, useState } from "react";
import "./../../../styles/pos/pos-management.css";
import { fetchRevenueGroups, type PosRevenueGroup } from "@/api/pos/revenueGroups";

const RevenueGroupsPage: React.FC = () => {
  const [items, setItems] = useState<PosRevenueGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchRevenueGroups();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setItems([]); // fallback indien endpoint ontbreekt
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pm-wrapper">
      <div className="pm-header">
        <div className="pm-title">Omzetgroepen</div>
        <button className="pm-btn-green">+ Nieuwe omzetgroep</button>
      </div>

      <div className="pm-table">
        {loading && <div className="pm-item">Laden…</div>}
        {error && !loading && <div className="pm-item">Fout: {error}</div>}
        {!loading && !error && (
          <div className="pm-list">
            {items.length === 0 && (
              <div className="pm-item">
                Nog geen omzetgroepen beschikbaar (backend endpoint ontbreekt nog).
              </div>
            )}
            {items.map((g) => (
              <div key={g.id} className="pm-item">
                <span>{g.name}</span>
                <span style={{ opacity: 0.7 }}>{g.color ?? ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueGroupsPage;
