import React from "react";

export default function POSSidebarOverlay({ visible, onClick }: { visible: boolean; onClick(): void }) {
  if (!visible) return null;
  return <div className="pos-overlay" onClick={onClick} />;
}
