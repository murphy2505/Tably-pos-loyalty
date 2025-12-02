import { useNavigate, useLocation } from "react-router-dom";
import type { MenuItem } from "./PosLayout";

type Props = {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
};

export default function POSSidebar({ open, onClose, items }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleItemClick(to: string) {
    navigate(to);
    onClose();
  }

  return (
    <aside className={"pos-sidebar" + (open ? " open" : "")}>
      <div className="pos-sidebar-header">
        <div className="pos-sidebar-title">POS Menu</div>
        <button className="pos-sidebar-close" type="button" onClick={onClose}>✕</button>
      </div>
      <nav className="pos-sidebar-nav">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={"pos-menu-item" + (location.pathname === item.to ? " is-active" : "")}
            onClick={() => handleItemClick(item.to)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
