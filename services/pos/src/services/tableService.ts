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
