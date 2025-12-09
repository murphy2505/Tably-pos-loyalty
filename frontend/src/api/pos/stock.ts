// frontend/src/api/pos/stock.ts
import {
  fetchStock,
  fetchStockHistory,
  createStockPurchase,
  createStockWaste,
  createStockAdjust,
} from "../../services/posService";
import type { StockItem } from "../../services/posService";

export type { StockItem };

export const apiListStock = fetchStock;
export const apiStockHistory = fetchStockHistory;
export const apiStockPurchase = createStockPurchase;
export const apiStockWaste = createStockWaste;
export const apiStockAdjust = createStockAdjust;
