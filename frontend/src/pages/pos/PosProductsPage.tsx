import React, { useEffect, useMemo, useState } from "react";
import "../../styles/pos/pos.css";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type ProductVariant,
} from "../../api/pos/products";
import {
  getCategories,
  type Category,
} from "../../api/pos/categories";

type EditMode = "create" | "edit";

type ProductFormState = {
  id?: string;
  name: string;
  shortLabel: string;
  description: string;
  categoryId: string;
  vatRate: number;
  tileColor: string;
  tileIcon: string;
  active: boolean;
  variants: ProductVariant[];
};

const DEFAULT_VAT = 9;

const emptyForm = (categories: Category[]): ProductFormState => ({
  id: undefined,
  name: "",
  shortLabel: "",
  description: "",
  categoryId: categories[0]?.id ?? "",
  vatRate: DEFAULT_VAT,
  tileColor: "",
  tileIcon: "",
  active: true,
  variants: [
    {
      name: "Standaard",
      price: 0,
      costPrice: null,
      sku: "",
      pluCode: null,
      active: true,
    },
  ],
});

const PosProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("create");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductFormState | null>(null);

  const loadInitial = async () => {
    try {
      setLoading(true);
      setError(null);

      // categorieën eerst ophalen voor dropdown
      setLoadingCats(true);
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);
      setCategories(cats ?? []);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (e: any) {
      console.error("Failed to load POS products or categories", e);
      setError(e.message || "Kon producten/categorieën niet laden");
    } finally {
      setLoading(false);
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const categoryMap = useMemo(
    () =>
      new Map<string, string>(
        categories.map((c) => [c.id, c.name] as [string, string])
      ),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "ALL" && p.categoryId !== categoryFilter) {
        return false;
      }

      if (!search.trim()) return true;

      const q = search.trim().toLowerCase();
      const text =
        (p.name || "").toLowerCase() +
        " " +
        (p.shortLabel || "").toLowerCase() +
        " " +
        (categoryMap.get(p.categoryId) || "").toLowerCase();

      return text.includes(q);
    });
  }, [products, search, categoryFilter, categoryMap]);

  const openCreate = () => {
    if (!categories.length) {
      alert("Maak eerst een categorie aan.");
      return;
    }
    setEditMode("create");
    setForm(emptyForm(categories));
    setEditOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditMode("edit");
    setForm({
      id: p.id,
      name: p.name,
      shortLabel: p.shortLabel ?? "",
      description: p.description ?? "",
      categoryId: p.categoryId,
      vatRate: p.vatRate ?? DEFAULT_VAT,
      tileColor: p.tileColor ?? "",
      tileIcon: p.tileIcon ?? "",
      active: p.active,
      variants:
        p.variants && p.variants.length
          ? p.variants.map((v) => ({
              id: v.id,
              name: v.name,
              price: v.price,
              costPrice: v.costPrice ?? null,
              sku: v.sku ?? "",
              pluCode: v.pluCode ?? null,
              active: v.active,
            }))
          : [
              {
                name: "Standaard",
                price: 0,
                costPrice: null,
                sku: "",
                pluCode: null,
                active: true,
              },
            ],
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditOpen(false);
    setForm(null);
  };

  const updateForm = (patch: Partial<ProductFormState>) => {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const updateVariant = (index: number, patch: Partial<ProductVariant>) => {
    setForm((prev) => {
      if (!prev) return prev;
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], ...patch };
      return { ...prev, variants };
    });
  };

  const addVariantRow = () => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        variants: [
          ...prev.variants,
          {
            name: "",
            price: 0,
            costPrice: null,
            sku: "",
            pluCode: null,
            active: true,
          },
        ],
      };
    });
  };

  const removeVariantRow = (index: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const variants = prev.variants.filter((_, i) => i !== index);
      return { ...prev, variants };
    });
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!confirm(`Product "${p.name}" verwijderen?`)) return;

    try {
      await deleteProduct(p.id);
      await loadInitial();
    } catch (e: any) {
      alert(e.message || "Kon product niet verwijderen");
    }
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim()) {
      alert("Naam is verplicht");
      return;
    }
    if (!form.categoryId) {
      alert("Categorie is verplicht");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        shortLabel: form.shortLabel.trim() || form.name.trim(),
        description: form.description.trim() || null,
        categoryId: form.categoryId,
        vatRate: form.vatRate,
        tileColor: form.tileColor || null,
        tileIcon: form.tileIcon || null,
        active: form.active,
        // nested varianten – de backend stub kan dit later gaan gebruiken
        variants: form.variants.map((v) => ({
          name: v.name.trim() || "Variant",
          price: Number.isFinite(v.price) ? v.price : 0,
          costPrice:
            v.costPrice === undefined || v.costPrice === null
              ? null
              : v.costPrice,
          sku: v.sku || null,
          pluCode: v.pluCode || null,
          active: v.active,
        })),
      };

      if (editMode === "create") {
        await createProduct(payload);
      } else if (form.id) {
        await updateProduct(form.id, payload);
      }

      await loadInitial();
      setEditOpen(false);
      setForm(null);
    } catch (e: any) {
      console.error("Save product failed", e);
      alert(e.message || "Kon product niet opslaan");
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (value: number) =>
    `€ ${value.toFixed(2).replace(".", ",")}`;

  return (
    <div className="pos-page pos-page-admin">
      <div className="pos-main">
        <section className="pos-left">
          <div className="mint-card" style={{ marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>Producten</h3>
                <p style={{ marginTop: 4, opacity: 0.8, fontSize: 12 }}>
                  Beheer hier alle artikelen en varianten voor de kassa, webshop
                  en menukaarten.
                </p>
              </div>
              <button
                type="button"
                className="pos-pay-confirm"
                onClick={openCreate}
              >
                + Nieuw product
              </button>
            </div>
          </div>

          <div className="mint-card" style={{ marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                style={{ flex: "0 0 200px" }}
                placeholder="Zoeken op naam…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                style={{ flex: "0 0 200px" }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">Alle categorieën</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
                {loading
                  ? "Laden…"
                  : `${filteredProducts.length} product${
                      filteredProducts.length === 1 ? "" : "en"
                    }`}
              </div>
            </div>
          </div>

          <div className="pos-products">
            {error && (
              <div style={{ padding: 8, color: "#fca5a5" }}>{error}</div>
            )}

            {!error && (
              <div className="pos-products-list">
                {loading && (
                  <div style={{ padding: 8, color: "#e5e7eb" }}>Laden…</div>
                )}

                {!loading && filteredProducts.length === 0 && (
                  <div style={{ padding: 8, color: "#e5e7eb" }}>
                    Geen producten gevonden.
                  </div>
                )}

                {!loading &&
                  filteredProducts.map((p) => (
                    <div key={p.id} className="pos-product-row">
                      <div className="pos-product-thumb">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} />
                        ) : p.tileIcon ? (
                          <span>{p.tileIcon}</span>
                        ) : (
                          <span>{p.name.charAt(0)}</span>
                        )}
                      </div>

                      <div className="pos-product-main">
                        <div className="pos-product-name">{p.name}</div>
                        {p.shortLabel && p.shortLabel !== p.name && (
                          <div className="pos-product-short">
                            {p.shortLabel}
                          </div>
                        )}
                      </div>

                      <div className="pos-product-category">
                        {categoryMap.get(p.categoryId) || "Geen categorie"}
                      </div>

                      <div className="pos-product-variants">
                        {p.variants.map((v) => (
                          <div key={v.id ?? v.name}>
                            {v.name} — {formatPrice(v.price)}
                          </div>
                        ))}
                      </div>

                      <div className="pos-product-vat">
                        {p.vatRate.toFixed(1).replace(".0", "")}% btw
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div className="pos-product-active-toggle">
                          <div
                            className={
                              "pos-switch " + (p.active ? "pos-switch--on" : "")
                            }
                          >
                            <div className="pos-switch-knob" />
                          </div>
                          <span>{p.active ? "Actief" : "Inactief"}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            className="pos-product-edit-btn"
                            type="button"
                            onClick={() => openEdit(p)}
                          >
                            Bewerken
                          </button>
                          <button
                            className="pos-remove-button"
                            type="button"
                            onClick={() => handleDeleteProduct(p)}
                          >
                            Verwijderen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* Rechterkolom: uitleg / koppelingen */}
        <aside className="pos-right pos-order">
          <div className="pos-order-header">
            <div className="pos-order-title">Productbeheer</div>
            <span className="pos-order-status">Info</span>
          </div>
          <div className="pos-order-lines">
            <div className="pos-order-line">
              <div className="pos-order-line-left">
                <div className="pos-order-line-name">Menukaarten</div>
                <div className="pos-order-line-meta">
                  Producten die je hier aanmaakt, koppel je later aan menukaarten
                  voor POS, kiosk en webshop.
                </div>
              </div>
            </div>
            <div className="pos-order-line">
              <div className="pos-order-line-left">
                <div className="pos-order-line-name">Rapportage</div>
                <div className="pos-order-line-meta">
                  Omzetgroepen en categorieën bepalen hoe producten in de
                  rapportage worden gegroepeerd.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Edit overlay / drawer */}
      {editOpen && form && (
        <div className="pos-pay-overlay">
          <div className="pos-pay-panel" style={{ maxWidth: 520 }}>
            <div className="pos-pay-header">
              <h3 style={{ margin: 0 }}>
                {editMode === "create" ? "Nieuw product" : "Product bewerken"}
              </h3>
              <button
                className="pos-pay-close"
                type="button"
                onClick={closeEdit}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ fontSize: 12 }}>
                Naam
                <input
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </label>

              <label style={{ fontSize: 12 }}>
                Korte naam (voor bon)
                <input
                  value={form.shortLabel}
                  onChange={(e) =>
                    updateForm({ shortLabel: e.target.value })
                  }
                />
              </label>

              <label style={{ fontSize: 12 }}>
                Categorie
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    updateForm({ categoryId: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ display: "flex", gap: 8 }}>
                <label style={{ fontSize: 12, flex: 1 }}>
                  BTW %
                  <input
                    type="number"
                    min={0}
                    max={21}
                    value={form.vatRate}
                    onChange={(e) =>
                      updateForm({ vatRate: Number(e.target.value) || 0 })
                    }
                  />
                </label>
                <label style={{ fontSize: 12, flex: 1 }}>
                  Tegelkleur (hex)
                  <input
                    placeholder="#FFEFAA"
                    value={form.tileColor}
                    onChange={(e) =>
                      updateForm({ tileColor: e.target.value })
                    }
                  />
                </label>
              </div>

              <label style={{ fontSize: 12 }}>
                Icoon (emoji, optioneel)
                <input
                  placeholder="🍟"
                  value={form.tileIcon}
                  onChange={(e) => updateForm({ tileIcon: e.target.value })}
                />
              </label>

              <label style={{ fontSize: 12 }}>
                Omschrijving (optioneel)
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    updateForm({ description: e.target.value })
                  }
                />
              </label>

              <div style={{ marginTop: 4 }}>
                <strong style={{ fontSize: 12 }}>Varianten</strong>
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {form.variants.map((v, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.4fr 1fr auto",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <input
                        placeholder="Naam (bijv. Klein, Groot)"
                        value={v.name}
                        onChange={(e) =>
                          updateVariant(index, { name: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Prijs"
                        value={v.price}
                        onChange={(e) =>
                          updateVariant(index, {
                            price: parseFloat(e.target.value || "0"),
                          })
                        }
                      />
                      <button
                        type="button"
                        className="pos-remove-button"
                        onClick={() => removeVariantRow(index)}
                        disabled={form.variants.length <= 1}
                      >
                        -
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="pos-product-edit-btn"
                    onClick={addVariantRow}
                  >
                    + Variant toevoegen
                  </button>
                </div>
              </div>

              <label style={{ fontSize: 12, display: "inline-flex", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => updateForm({ active: e.target.checked })}
                />
                Actief product
              </label>
            </div>

            <div className="pos-pay-actions" style={{ marginTop: 16 }}>
              <button
                className="pos-secondary-button"
                type="button"
                onClick={closeEdit}
                disabled={saving}
              >
                Annuleer
              </button>
              <button
                className="pos-pay-confirm"
                type="button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Opslaan…"
                  : editMode === "create"
                  ? "Product aanmaken"
                  : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosProductsPage;
