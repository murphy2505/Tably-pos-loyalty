export async function getStock() {
  const res = await fetch("/pos/core/stock");
  if (!res.ok) throw new Error("Failed to load stock");
  return res.json();
}

export async function getStockHistory() {
  const res = await fetch("/pos/core/stock/history");
  if (!res.ok) throw new Error("Failed to load stock history");
  return res.json();
}

export async function postDelivery(payload: any) {
  const res = await fetch("/pos/core/stock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to post delivery");
  return res.json();
}

export async function postWaste(payload: any) {
  const res = await fetch("/pos/core/stock/waste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to post waste");
  return res.json();
}

export async function postAdjust(payload: any) {
  const res = await fetch("/pos/core/stock/adjust", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to post adjust");
  return res.json();
}
