import { useNavigate, useLocation } from "react-router-dom";
import type { MenuItem } from "./menuConfig";
import { useState } from "react";

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
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <aside className={"pos-sidebar" + (open ? " open" : "")}>
      <div className="pos-sidebar-header">
        <div className="pos-sidebar-title">POS Menu</div>
        <button className="pos-sidebar-close" type="button" onClick={onClose}>✕</button>
      </div>
      <nav className="pos-sidebar-nav">
        {items.map((item) => {
          if ("children" in item) {
            const isOpen = !!expanded[item.key];
            return (
              <div key={item.key}>
                <button
                  type="button"
                  className="pos-menu-item"
                  onClick={() => toggleGroup(item.key)}
                >
                  {item.label} {isOpen ? "▾" : "▸"}
                </button>
                {isOpen && (
                  <div style={{ paddingLeft: 12 }}>
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        className={
                          "pos-menu-item" +
                          (location.pathname === child.to ? " is-active" : "")
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
          return (
            <button
              key={item.key}
              type="button"
              className={
                "pos-menu-item" +
                ("to" in item && location.pathname === item.to ? " is-active" : "")
              }
              onClick={() => "to" in item && handleItemClick(item.to)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
