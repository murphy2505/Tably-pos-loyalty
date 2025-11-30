import { Order, OrderItem } from '../models/types';
import {
  addOrder,
  listOrdersByTenant,
  listOrdersByTable,
  findOrderById,
  updateOrderStatus,
  addOrderItem,
} from '../db/memory';

export function createOrder(
  tenantId: string,
  tableId: string,
  items: Omit<OrderItem, 'id'>[],
): Order {
  return addOrder(tenantId, tableId, items);
}

export function addItem(
  tenantId: string,
  orderId: string,
  item: Omit<OrderItem, 'id'>,
): Order | undefined {
  return addOrderItem(tenantId, orderId, item);
}

export function listOrders(tenantId: string): Order[] {
  return listOrdersByTenant(tenantId);
}

export function listOrdersForTable(tenantId: string, tableId: string): Order[] {
  return listOrdersByTable(tenantId, tableId);
}

export function getOrder(tenantId: string, orderId: string): Order | undefined {
  return findOrderById(tenantId, orderId);
}

export function setOrderStatus(
  tenantId: string,
  orderId: string,
  status: Order['status'],
): Order | undefined {
  return updateOrderStatus(tenantId, orderId, status);
}

export async function createCoreOrder(tenantId: string, locationId: string, tableId?: string) {
  return { id: "order-1" };
}
export async function addCoreOrderItem(tenantId: string, orderId: string, item: { variantId: string; quantity: number; priceEach: number; discount?: number }) {
  // TODO: verwerk ProductIngredient → voorraad SALE afboeken
  return { ok: true };
}
export async function updateCoreOrderItem(tenantId: string, itemId: string, patch: Partial<{ quantity: number; priceEach: number; discount: number }>) {
  return { ok: true };
}
export async function removeCoreOrderItem(tenantId: string, itemId: string) {
  return { ok: true };
}
export async function payOrder(tenantId: string, orderId: string, payment: { method: "CASH" | "PIN" | "OTHER"; amount: number }) {
  // TODO: markeer als PAID; betaling opslaan; tafel op FREE
  return { status: "PAID" };
}
export async function cancelOrder(tenantId: string, orderId: string) {
  return { status: "CANCELLED" };
}
