import React, { useEffect, useState } from "react";
import {
  listModifierGroups,
  createModifierGroup,
  updateModifierGroup,
  deleteModifierGroup,
  createModifierOption,
  updateModifierOption,
  deleteModifierOption,
} from "../../services/posApi";

export default function ModifiersPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [groupForm, setGroupForm] = useState({
    name: "",
    sortOrder: 0,
  });

  const load = async () => {
    setLoading(true);
    const result = await listModifierGroups();
    setGroups(result);
    if (result.length > 0 && !selectedGroup) {
      setSelectedGroup(result[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupForm.name.trim()) return;
    await createModifierGroup(groupForm);
    setGroupForm({ name: "", sortOrder: 0 });
    load();
  };

  const handleSelectGroup = async (g: any) => {
    setSelectedGroup(g);
  };

  const handleUpdateGroup = async (field: string, value: any) => {
    if (!selectedGroup) return;
    await updateModifierGroup(selectedGroup.id, { [field]: value });
    load();
  };

  const handleDeleteGroup = async (id: string) => {
    if (!window.confirm("Weet je zeker dat je deze modifiergroep wilt verwijderen?")) return;
    await deleteModifierGroup(id);
    setSelectedGroup(null);
    load();
  };

  // ------- OPTIONS -------
  const handleCreateOption = async () => {
    if (!selectedGroup) return;

    await createModifierOption(selectedGroup.id, {
      name: "Nieuwe optie",
      priceDelta: "0",
      sortOrder: (selectedGroup.options?.length || 0) + 1,
    });
    load();
  };

  const handleUpdateOption = async (optId: string, field: string, value: any) => {
    await updateModifierOption(optId, { [field]: value });
    load();
  };

  const handleDeleteOption = async (optId: string) => {
    if (!window.confirm("Optie verwijderen?")) return;
    await deleteModifierOption(optId);
    load();
  };

  if (loading) return <div className="p-4">Laden...</div>;

  return (
    <div className="flex h-full gap-4 p-4">

      {/* ============= LEFT: GROUPS LIST ============= */}
      <div className="w-64 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
        <h2 className="text-lg font-bold mb-3">Modifiergroepen</h2>

        <div className="flex flex-col gap-1">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => handleSelectGroup(g)}
              className={`p-2 rounded-lg text-left ${
                selectedGroup?.id === g.id ? "bg-mint-500/40" : "bg-white/5"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Add group */}
        <div className="mt-4 border-t border-white/20 pt-3">
          <input
            type="text"
            placeholder="Nieuwe groep"
            className="w-full p-2 rounded bg-white/10"
            value={groupForm.name}
            onChange={(e) =>
              setGroupForm({ ...groupForm, name: e.target.value })
            }
          />
          <button
            onClick={handleCreateGroup}
            className="w-full mt-2 bg-mint-500 hover:bg-mint-600 p-2 rounded-lg text-black font-medium"
          >
            + Toevoegen
          </button>
        </div>
      </div>

      {/* ============= RIGHT: OPTIONS ============= */}
      <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        {!selectedGroup ? (
          <div>Kies een modifiergroep...</div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
              <button
                onClick={() => handleDeleteGroup(selectedGroup.id)}
                className="bg-red-500/70 hover:bg-red-600 px-3 py-1 rounded-lg"
              >
                Verwijder groep
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <label className="block">
                Naam:
                <input
                  type="text"
                  className="w-full p-2 rounded bg-white/10 mt-1"
                  value={selectedGroup.name}
                  onChange={(e) =>
                    handleUpdateGroup("name", e.target.value)
                  }
                />
              </label>
            </div>

            {/* OPTIONS */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Opties</h3>

            <button
              onClick={handleCreateOption}
              className="bg-mint-500 hover:bg-mint-600 text-black px-3 py-1 rounded-lg"
            >
              + Nieuwe optie
            </button>

            <div className="mt-3 space-y-3">
              {(selectedGroup.options || []).map((opt: any) => (
                <div
                  key={opt.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex justify-between">
                    <input
                      type="text"
                      className="bg-white/10 p-2 rounded w-2/3"
                      value={opt.name}
                      onChange={(e) =>
                        handleUpdateOption(opt.id, "name", e.target.value)
                      }
                    />

                    <button
                      onClick={() => handleDeleteOption(opt.id)}
                      className="bg-red-500/70 hover:bg-red-600 px-3 py-1 rounded-lg"
                    >
                      ❌
                    </button>
                  </div>

                  <div className="flex gap-4 mt-2">
                    <label className="flex flex-col text-sm">
                      Prijs Δ:
                      <input
                        type="number"
                        step="0.01"
                        className="bg-white/10 p-2 rounded"
                        value={opt.priceDelta}
                        onChange={(e) =>
                          handleUpdateOption(opt.id, "priceDelta", e.target.value)
                        }
                      />
                    </label>

                    <label className="flex flex-col text-sm">
                      Sort:
                      <input
                        type="number"
                        className="bg-white/10 p-2 rounded"
                        value={opt.sortOrder}
                        onChange={(e) =>
                          handleUpdateOption(opt.id, "sortOrder", Number(e.target.value))
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
