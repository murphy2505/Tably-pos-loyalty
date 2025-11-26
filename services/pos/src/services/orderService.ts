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
