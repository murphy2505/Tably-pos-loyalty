import { v4 as uuid } from 'uuid';
import { Table, Order, OrderItem } from '../models/types';

export const tables: Table[] = [];
export const orders: Order[] = [];

export function clearAllData(): void {
  tables.length = 0;
  orders.length = 0;
}

export function addTable(tenantId: string, number: number): Table {
  const table: Table = {
    id: uuid(),
    number,
    tenantId,
    status: 'open',
  };
  tables.push(table);
  return table;
}

export function listTablesByTenant(tenantId: string): Table[] {
  return tables.filter(t => t.tenantId === tenantId);
}

export function findTableById(tenantId: string, tableId: string): Table | undefined {
  return tables.find(t => t.id === tableId && t.tenantId === tenantId);
}

export function addOrder(
  tenantId: string,
  tableId: string,
  items: Omit<OrderItem, 'id'>[],
): Order {
  const order: Order = {
    id: uuid(),
    tableId,
    tenantId,
    items: items.map(item => ({ ...item, id: uuid() })),
    status: 'open',
    createdAt: new Date(),
  };
  orders.push(order);
  return order;
}

export function listOrdersByTenant(tenantId: string): Order[] {
  return orders.filter(o => o.tenantId === tenantId);
}

export function findOrderById(tenantId: string, orderId: string): Order | undefined {
  return orders.find(o => o.id === orderId && o.tenantId === tenantId);
}

export function updateOrderStatus(
  tenantId: string,
  orderId: string,
  status: Order['status'],
): Order | undefined {
  const order = findOrderById(tenantId, orderId);
  if (order) {
    order.status = status;
  }
  return order;
}

export function addOrderItem(
  tenantId: string,
  orderId: string,
  item: Omit<OrderItem, 'id'>,
): Order | undefined {
  const order = findOrderById(tenantId, orderId);
  if (order) {
    order.items.push({ ...item, id: uuid() });
  }
  return order;
}

export function updateTableStatus(
  tenantId: string,
  tableId: string,
  status: Table['status'],
): Table | undefined {
  const table = findTableById(tenantId, tableId);
  if (table) {
    table.status = status;
  }
  return table;
}

export function listOrdersByTable(tenantId: string, tableId: string): Order[] {
  return orders.filter(o => o.tenantId === tenantId && o.tableId === tableId);
}
