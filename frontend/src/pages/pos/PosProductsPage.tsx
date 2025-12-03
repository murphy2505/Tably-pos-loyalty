import React, { useEffect, useMemo, useState } from "react";
import "../../styles/pos-products.css";

type PosVariant = {
  id: string;
  name: string;
  price: number;
  costPrice?: number | null;
  sku?: string | null;
  pluCode?: string | null;
  active: boolean;
};

type PosProduct = {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  shortLabel?: string | null;
  description?: string | null;
  vatRate: number;
  tileColor?: string | null;
  tileIcon?: string | null;
  imageUrl?: string | null;
  active: boolean;
  variants: PosVariant[];
};

type PosCategory = {
  id: string;
  name: string;
  color?: string | null;
  parentId?: string | null;
  order: number;
};

const TENANT_ID = "demo-tenant";
const DEV_TOKEN = "DUMMY_DEV_TOKEN";

const PosProductsPage: React.FC = () => {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [categories, setCategories] = useState<PosCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/pos/products", {
            headers: {
              "Content-Type": "application/json",
              "x-tenant-id": TENANT_ID,
              Authorization: `Bearer ${DEV_TOKEN}`,
            },
          }),
          fetch("/pos/core/categories", {
            headers: {
              "Content-Type": "application/json",
              "x-tenant-id": TENANT_ID,
              Authorization: `Bearer ${DEV_TOKEN}`,
            },
          }),
        ]);

        if (!productsRes.ok) {
          throw new Error(`Products HTTP ${productsRes.status}`);
        }
        if (!categoriesRes.ok) {
          throw new Error(`Categories HTTP ${categoriesRes.status}`);
        }

        const productsData = (await productsRes.json()) as PosProduct[];
        const categoriesData = (await categoriesRes.json()) as PosCategory[];

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (e: any) {
        console.error("Failed to load POS products/categories", e);
        setError("Kon producten niet laden");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categoriesById = useMemo(() => {
    const map: Record<string, PosCategory> = {};
    for (const c of categories) map[c.id] = c;
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        categoryFilter === "all" || p.categoryId === categoryFilter;

      if (!matchesCategory) return false;

      if (!search.trim()) return true;

      const needle = search.toLowerCase();
      const text =
        [
          p.name,
          p.shortLabel ?? "",
          p.description ?? "",
          p.variants.map((v) => v.name).join(" "),
          p.variants.map((v) => v.sku ?? "").join(" "),
        ]
          .join(" ")
          .toLowerCase() || "";

      return text.includes(needle);
    });
  }, [products, search, categoryFilter]);

  const formatPrice = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "-";
    return `€ ${value.toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="pos-products-page">
      {/* Header */}
      <header className="pos-products-header">
        <div>
          <h1>Producten</h1>
          <p>
            Beheer van kassa-items en varianten. Demo: Friet (Klein / Groot /
            Super).
          </p>
        </div>
        <div className="pos-products-header-meta">
          {products.length} product{products.length !== 1 ? "en" : ""}
        </div>
      </header>

      {/* Filters */}
      <div className="pos-products-filters">
        <div className="pos-products-search">
          <input
            type="text"
            placeholder="Zoeken op naam, variant of SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="pos-products-filter-group">
          <label className="pos-products-filter-label">Categorie</label>
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value === "all" ? "all" : e.target.value
              )
            }
          >
            <option value="all">Alle categorieën</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="pos-products-status">Laden…</div>
      )}

      {error && !loading && (
        <div className="pos-products-error">{error}</div>
      )}

      {!loading && !error && (
        <div className="pos-products-table-card">
          {filteredProducts.length === 0 ? (
            <div className="pos-products-empty">
              Geen producten gevonden voor deze filter.
            </div>
          ) : (
            <table className="pos-products-table">
              <thead>
                <tr>
                  <th style={{ width: "28%" }}>Product</th>
                  <th style={{ width: "18%" }}>Categorie</th>
                  <th style={{ width: "34%" }}>Varianten</th>
                  <th style={{ width: "8%" }}>BTW</th>
                  <th style={{ width: "12%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const cat = categoriesById[p.categoryId];
                  return (
                    <tr key={p.id}>
                      {/* Product */}
                      <td>
                        <div className="pos-products-product-cell">
                          <div className="pos-products-product-avatar">
                            {p.tileIcon
                              ? p.tileIcon
                              : p.name.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="pos-products-product-text">
                            <div className="pos-products-product-name">
                              {p.name}
                            </div>
                            {p.shortLabel &&
                              p.shortLabel !== p.name && (
                                <div className="pos-products-product-short">
                                  {p.shortLabel}
                                </div>
                              )}
                            {p.description && (
                              <div className="pos-products-product-desc">
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Categorie */}
                      <td>
                        <div className="pos-products-category">
                          {cat ? cat.name : "–"}
                        </div>
                      </td>

                      {/* Varianten */}
                      <td>
                        <div className="pos-products-variants">
                          {p.variants.map((v) => (
                            <span
                              key={v.id}
                              className="pos-products-variant-chip"
                            >
                              <span className="pos-products-variant-name">
                                {v.name}
                              </span>
                              <span className="pos-products-variant-price">
                                {formatPrice(v.price)}
                              </span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* BTW */}
                      <td>
                        <span className="pos-products-btw">
                          {p.vatRate?.toFixed(1).replace(".0", "")}%
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <div className="pos-products-status-toggle">
                          <span className="pos-products-status-label">
                            {p.active ? "Actief" : "Inactief"}
                          </span>
                          <div
                            className={
                              "pos-products-switch" +
                              (p.active ? " is-on" : "")
                            }
                          >
                            <div className="pos-products-switch-knob" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PosProductsPage;
