import { Table } from '../models/types';
import {
  addTable,
  listTablesByTenant,
  findTableById,
  updateTableStatus,
} from '../db/memory';

export function createTable(tenantId: string, number: number): Table {
  return addTable(tenantId, number);
}

export function listTables(tenantId: string): Table[] {
  return listTablesByTenant(tenantId);
}

export function getTable(tenantId: string, tableId: string): Table | undefined {
  return findTableById(tenantId, tableId);
}

export function setTableStatus(
  tenantId: string,
  tableId: string,
  status: Table['status'],
): Table | undefined {
  return updateTableStatus(tenantId, tableId, status);
}

export async function listTables(tenantId: string, locationId: string) {
  return [];
}

export async function createTableAsync(tenantId: string, locationId: string, data: { name: string }) {
  return { id: "table-1" };
}

export async function setTableState(tenantId: string, tableId: string, state: "FREE" | "SEATED" | "BILL_OPEN") {
  return { ok: true };
}
