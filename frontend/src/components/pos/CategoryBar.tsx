import type { ReactNode } from "react";

export default function CategoryBar({ categories, activeId, onSelect }: { categories: { id: string; name: string }[]; activeId?: string; onSelect: (id: string) => void }) {
  return (
    <div className="pos-category-bar">
      {categories.map((c) => (
        <button key={c.id} className={"pos-category-button" + (activeId === c.id ? " is-active" : "")} onClick={() => onSelect(c.id)} type="button">
          {c.name}
        </button>
      ))}
    </div>
  );
}
