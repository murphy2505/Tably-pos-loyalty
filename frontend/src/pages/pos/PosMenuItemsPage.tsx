import { useEffect, useState } from "react";
import { fetchMenuItems, type MenuItemDto } from "../../api/pos/menuItems";

const PosMenuItemsPage = () => {
  const [items, setItems] = useState<MenuItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeMenuId] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMenuItems(activeMenuId);

        if (!cancelled) {
          // extra safeguard:
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch menu items", err);
        if (!cancelled) {
          setError("Kon menu items niet laden");
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [activeMenuId]);

  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <div className="pos-admin-page">
      <div className="pos-content">
        <div className="pos-admin-card">
          <div className="pos-admin-header">
            <h1 className="pos-admin-title">Menu Items</h1>
            <button className="pos-admin-chip" type="button">
              + Nieuw menu item
            </button>
          </div>

          {loading && <p style={{ fontSize: 13 }}>Menu items laden...</p>}

          {error && (
            <p style={{ fontSize: 13, color: "#b91c1c" }}>{error}</p>
          )}

          {!loading && !error && !hasItems && (
            <p style={{ fontSize: 13 }}>
              Nog geen menu items gevonden. Voeg straks een nieuw menu item toe
              om producten aan menukaarten te koppelen.
            </p>
          )}

          {!loading && !error && hasItems && (
            <div className="pos-admin-list">
              {items.map((item) => (
                <div key={item.id} className="pos-admin-row">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {item.label ||
                        item.product?.name ||
                        "Onbekend product"}
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                      {item.menu?.name && `Menukaart: ${item.menu.name}`}
                      {item.variant?.name &&
                        ` · Variant: ${item.variant.name}`}
                    </div>
                  </div>

                  <div className="pos-admin-row-actions">
                    <button
                      type="button"
                      className="pos-admin-chip"
                      style={{ fontSize: 11 }}
                    >
                      Bewerken
                    </button>
                    <button
                      type="button"
                      className="pos-admin-chip"
                      style={{
                        fontSize: 11,
                        background: "#fee2e2",
                        color: "#b91c1c",
                      }}
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosMenuItemsPage;
