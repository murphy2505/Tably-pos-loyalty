// frontend/src/services/posService.ts
import type { PosProduct, PosOrderLine, PosOrderTotals } from "../types/pos";

export async function fetchPosProducts(): Promise<PosProduct[]> {
  // kleine “fake” delay zodat het lijkt op API
  await new Promise((resolve) => setTimeout(resolve, 150));

  return [
    { id: 1, name: "Friet klein", price: 2.9, category: "Friet", badge: "Populair" },
    { id: 2, name: "Friet groot", price: 3.8, category: "Friet", badge: "Meest verkocht" },
    { id: 3, name: "Frikandel", price: 2.5, category: "Snacks" },
    { id: 4, name: "Frikandel speciaal", price: 3.1, category: "Snacks" },
    { id: 5, name: "Kroket", price: 2.5, category: "Snacks" },
    { id: 6, name: "Bamischijf", price: 2.7, category: "Snacks" },
    { id: 7, name: "Menu saté", price: 11.5, category: "Menu's", badge: "Nieuw" },
    { id: 8, name: "Cola 33cl", price: 2.6, category: "Drinken" },
    { id: 9, name: "Fanta 33cl", price: 2.6, category: "Drinken" },
    { id: 10, name: "Milkshake aardbei", price: 4.2, category: "Drinken" },
  ];
}

export function calculateTotals(lines: PosOrderLine[]): PosOrderTotals {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.qty * line.price,
    0
  );
  const discount = 0;
  const total = subtotal - discount;

  return { subtotal, discount, total };
}
