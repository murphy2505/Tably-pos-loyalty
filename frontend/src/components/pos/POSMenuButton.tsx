import React from "react";

interface POSMenuButtonProps {
  onClick(): void;
  open?: boolean;
}

export default function POSMenuButton({ onClick, open }: POSMenuButtonProps) {
  return (
    <button
      type="button"
      aria-label="Menu"
      className={"pos-menu-button" + (open ? " is-open" : "")}
      onClick={onClick}
    >
      <span className="pos-menu-bar" />
      <span className="pos-menu-bar" />
      <span className="pos-menu-bar" />
    </button>
  );
}
