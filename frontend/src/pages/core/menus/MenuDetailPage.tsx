import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  apiGetMenu,
  apiUpdateMenu,
  apiListMenuItems,
  apiCreateMenuItem,
  apiDeleteMenuItem,
  apiReorderMenuItems,
} from "@/services/posApi";

interface MenuItem {
  id: string;
  label: string | null;
  shortLabel: string | null;
  badge: string | null;
  color: string | null;
  tileSize: string;
  sortOrder: number;
  isFavorite: boolean;
  isVisible: boolean;
}

interface Menu {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  channel: string;
  layoutType: string;
  columns?: number | null;
  showImages: boolean;
  showPrices: boolean;
}

const MenuDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<Menu | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // nieuw item
  const [newLabel, setNewLabel] = useState("");
  const [newTileSize, setNewTileSize] = useState<"AUTO" | "SMALL" | "MEDIUM" | "LARGE">("AUTO");

  async function loadAll() {
    if (!id) return;
    setLoading(true);
    const m = await apiGetMenu(id);
    setMenu(m);
    const its = await apiListMenuItems(id);
    setItems(its);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSaveMenu() {
    if (!menu || !id) return;
    setSaving(true);
    await apiUpdateMenu(id, {
      name: menu.name,
      slug: menu.slug,
      description: menu.description,
      channel: menu.channel,
      layoutType: menu.layoutType,
      columns: menu.columns,
      showImages: menu.showImages,
      showPrices: menu.showPrices,
    });
    setSaving(false);
  }

  async function handleAddItem() {
    if (!id || !newLabel.trim()) return;
    await apiCreateMenuItem({
      menuId: id,
      label: newLabel.trim(),
      tileSize: newTileSize,
    });
    setNewLabel("");
    setNewTileSize("AUTO");
    loadAll();
  }

  async function handleDeleteItem(itemId: string) {
    if (!confirm("Tegel verwijderen?")) return;
    await apiDeleteMenuItem(itemId);
    loadAll();
  }

  async function handleMoveItem(index: number, direction: "up" | "down") {
    const newItems = [...items];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;

    const tmp = newItems[index];
    newItems[index] = newItems[swapIndex];
    newItems[swapIndex] = tmp;

    setItems(newItems);

    const orderedIds = newItems.map((i) => i.id);
    if (id) {
      await apiReorderMenuItems(id, orderedIds);
      // niet per se opnieuw laden, maar kan:
      // await loadAll();
    }
  }

  if (loading || !menu) {
    return (
      <div className="p-4">
        <div className="mb-2">
          <Link to="/pos/core/menus" className="text-sm text-blue-600">
            ← Terug naar menukaarten
          </Link>
        </div>
        <div>Menu wordt geladen…</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/pos/core/menus" className="text-sm text-blue-600">
            ← Terug naar menukaarten
          </Link>
          <h1 className="text-2xl font-bold mt-1">Menukaart: {menu.name}</h1>
        </div>

        <button
          onClick={() => navigate("/pos/core/menus")}
          className="text-sm px-3 py-1 border rounded"
        >
          Sluiten
        </button>
      </div>

      {/* Basis instellingen */}
      <div className="grid gap-4 md:grid-cols-2 bg-white border rounded-lg p-4 shadow-sm">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Naam</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={menu.name}
              onChange={(e) => setMenu({ ...menu, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              className="border rounded px-3 py-2 w-full text-sm"
              value={menu.slug}
              onChange={(e) => setMenu({ ...menu, slug: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Omschrijving</label>
            <textarea
              className="border rounded px-3 py-2 w-full text-sm"
              rows={2}
              value={menu.description ?? ""}
              onChange={(e) =>
                setMenu({ ...menu, description: e.target.value || null })
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Kanaal</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={menu.channel || "BOTH"}
              onChange={(e) =>
                setMenu({ ...menu, channel: e.target.value || "BOTH" })
              }
            >
              <option value="POS">Alleen POS</option>
              <option value="WEBSHOP">Alleen webshop</option>
              <option value="BOTH">POS + webshop</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Layout</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={menu.layoutType || "GRID"}
              onChange={(e) =>
                setMenu({ ...menu, layoutType: e.target.value || "GRID" })
              }
            >
              <option value="GRID">Grid (tegels)</option>
              <option value="LIST">Lijst</option>
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Kolommen (optioneel)
              </label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={menu.columns ?? ""}
                onChange={(e) =>
                  setMenu({
                    ...menu,
                    columns: e.target.value
                      ? Number(e.target.value)
                      : (null as number | null),
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={menu.showImages}
                onChange={(e) =>
                  setMenu({ ...menu, showImages: e.target.checked })
                }
              />
              Afbeeldingen tonen
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={menu.showPrices}
                onChange={(e) =>
                  setMenu({ ...menu, showPrices: e.target.checked })
                }
              />
              Prijzen tonen
            </label>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={handleSaveMenu}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm"
          disabled={saving}
        >
          {saving ? "Opslaan…" : "Menukaart opslaan"}
        </button>
      </div>

      {/* Tiles / tegels */}
      <div className="bg-white border rounded-lg p-4 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Tegels in deze menukaart</h2>

        {/* Nieuwe tegel */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            className="border rounded px-3 py-2 w-64"
            placeholder="Label op tegel…"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={newTileSize}
            onChange={(e) =>
              setNewTileSize(e.target.value as "AUTO" | "SMALL" | "MEDIUM" | "LARGE")
            }
          >
            <option value="AUTO">AUTO</option>
            <option value="SMALL">Klein</option>
            <option value="MEDIUM">Middel</option>
            <option value="LARGE">Groot</option>
          </select>
          <button
            onClick={handleAddItem}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Tegel toevoegen
          </button>
        </div>

        {/* Lijst tegels */}
        {items.length === 0 ? (
          <div className="text-gray-500 text-sm mt-2">
            Nog geen tegels in deze menukaart.
          </div>
        ) : (
          <div className="space-y-2 mt-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-200 rounded px-3 py-2 bg-gray-50"
              >
                <div>
                  <div className="font-medium">
                    {item.label || item.shortLabel || "(zonder label)"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Tegelgrootte: {item.tileSize || "AUTO"} • sort:{" "}
                    {item.sortOrder}
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    className="text-xs px-2 py-1 border rounded"
                    onClick={() => handleMoveItem(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    className="text-xs px-2 py-1 border rounded"
                    onClick={() => handleMoveItem(index, "down")}
                    disabled={index === items.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded bg-red-600 text-white"
                    onClick={() => handleDeleteItem(item.id)}
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
  );
};

export default MenuDetailPage;
