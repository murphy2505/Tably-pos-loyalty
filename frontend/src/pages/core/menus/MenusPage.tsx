import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  apiListMenus,
  apiCreateMenu,
  apiDeleteMenu,
} from "@/services/posApi";

interface Menu {
  id: string;
  name: string;
  slug: string;
  channel: string;
  layoutType: string;
  isActive: boolean;
}

const MenusPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  async function load() {
    setLoading(true);
    const data = await apiListMenus();
    setMenus(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    await apiCreateMenu({ name: newName.trim() });
    setNewName("");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Menukaart verwijderen?")) return;
    await apiDeleteMenu(id);
    load();
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menukaarten</h1>
      </div>

      <div className="flex gap-2 items-center">
        <input
          className="border border-gray-300 rounded px-3 py-2 w-64"
          placeholder="Nieuwe menukaart naam…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm"
        >
          Toevoegen
        </button>
      </div>

      {loading ? (
        <div>Menukaarten worden geladen…</div>
      ) : menus.length === 0 ? (
        <div className="text-gray-500">Nog geen menukaarten aangemaakt.</div>
      ) : (
        <div className="space-y-2">
          {menus.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm"
            >
              <div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-gray-500">
                  slug: {m.slug} • kanaal: {m.channel || "BOTH"} • layout:{" "}
                  {m.layoutType || "GRID"}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/pos/core/menus/${m.id}`}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Openen
                </Link>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="px-3 py-1 rounded text-sm bg-red-600 text-white"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenusPage;
