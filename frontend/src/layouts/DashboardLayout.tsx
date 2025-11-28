import React from "react";

type Props = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: Props) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f7fb" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "#0f172a",
          color: "#e2e8f0",
          display: "flex",
          flexDirection: "column",
          padding: 12,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Gifty/Loyalty</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button style={navBtnStyle}>Dashboard</button>
          <button style={navBtnStyle}>Customers</button>
          <button style={navBtnStyle}>POS</button>
          <button style={navBtnStyle}>Marketing</button>
          <button style={navBtnStyle}>Settings</button>
        </nav>
        <div style={{ marginTop: "auto", fontSize: 12, opacity: 0.7 }}>v0.1</div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            height: 56,
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <div style={{ fontWeight: 600 }}>Dashboard</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Tenant: Demo</div>
        </header>

        {/* Content */}
        <section style={{ flex: 1, padding: 16 }}>{children}</section>
      </main>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  textAlign: "left",
  background: "transparent",
  color: "#e2e8f0",
  border: "none",
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
