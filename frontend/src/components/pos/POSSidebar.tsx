// frontend/src/components/pos/POSSidebar.tsx

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import type { MenuItem } from "../../layout/pos/menuConfig";

type Props = {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
};

export default function POSSidebar({ open, onClose, items }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function handleItemClick(to: string) {
    navigate(to);
    onClose();
  }

  function toggleGroup(key: string) {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function isActivePath(path: string) {
    // Zorgt dat ook /pos/menu-items/123 nog actief is
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }

  return (
    <aside className={"pos-sidebar" + (open ? " open" : "")}>
      <div className="pos-sidebar-header">
        <div className="pos-sidebar-title">POS Menu</div>
        <button
          className="pos-sidebar-close"
          type="button"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <nav className="pos-sidebar-nav">
        {items.map((item) => {
          // Groep met children
          if ("children" in item) {
            const isOpen = !!expanded[item.key];
            // Optioneel: groep actief als één van de children actief is
            const groupActive = item.children.some((child) =>
              isActivePath(child.to)
            );

            return (
              <div key={item.key}>
                <button
                  type="button"
                  className={
                    "pos-menu-item pos-menu-group" +
                    (groupActive ? " is-active-group" : "")
                  }
                  onClick={() => toggleGroup(item.key)}
                >
                  <span>{item.label}</span>
                  <span className="pos-menu-group-caret">
                    {isOpen ? "▾" : "▸"}
                  </span>
                </button>

                {isOpen && (
                  <div className="pos-menu-group-children">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        className={
                          "pos-menu-item" +
                          (isActivePath(child.to) ? " is-active" : "")
                        }
                        onClick={() => handleItemClick(child.to)}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Enkel item (zonder children)
          return (
            <button
              key={item.key}
              type="button"
              className={
                "pos-menu-item" +
                (isActivePath(item.to) ? " is-active" : "")
              }
              onClick={() => handleItemClick(item.to)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
