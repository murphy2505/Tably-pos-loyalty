import { v4 as uuid } from 'uuid';
import { HistoryEvent, HistoryType } from '../models/history';

export const historyStore: HistoryEvent[] = [
  // Jan Jansen: 12 visits, mix van POS_ORDER en LOYALTY_ADD
  { id: 'hist-jan-1', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 35.5, description: 'POS order #1001', timestamp: new Date(Date.now() - 50 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-2', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'LOYALTY_ADD', amount: 20, description: 'Points add', timestamp: new Date(Date.now() - 49 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-3', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 22.0, description: 'POS order #1010', timestamp: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-4', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 18.9, description: 'POS order #1015', timestamp: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-5', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'LOYALTY_ADD', amount: 30, description: 'Promo points', timestamp: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-6', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 40.0, description: 'POS order #1030', timestamp: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-7', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 12.5, description: 'POS order #1041', timestamp: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-8', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 15.0, description: 'POS order #1049', timestamp: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-9', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 19.9, description: 'POS order #1055', timestamp: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-10', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 27.3, description: 'POS order #1061', timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-11', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 33.0, description: 'POS order #1070', timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-12', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'LOYALTY_ADD', amount: 40, description: 'Points add recent', timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },

  // Petra de Vries: 5 visits
  { id: 'hist-petra-1', customerId: 'cust-petra', walletId: 'wal-petra-loyalty', type: 'POS_ORDER', amount: 20.0, description: 'POS order #2001', timestamp: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-petra-2', customerId: 'cust-petra', walletId: 'wal-petra-loyalty', type: 'LOYALTY_ADD', amount: 60, description: 'Points add', timestamp: new Date(Date.now() - 24 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-petra-3', customerId: 'cust-petra', walletId: 'wal-petra-loyalty', type: 'POS_ORDER', amount: 15.0, description: 'POS order #2005', timestamp: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-petra-4', customerId: 'cust-petra', walletId: 'wal-petra-loyalty', type: 'POS_ORDER', amount: 22.0, description: 'POS order #2011', timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-petra-5', customerId: 'cust-petra', walletId: 'wal-petra-loyalty', type: 'POS_ORDER', amount: 18.0, description: 'POS order #2018', timestamp: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString() },

  // Ali K.: 1 visit
  { id: 'hist-ali-1', customerId: 'cust-ali', walletId: 'wal-ali-loyalty', type: 'POS_ORDER', amount: 12.0, description: 'POS order #3001', timestamp: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString() }
];

export interface NewHistoryInput {
  customerId: string;
  walletId?: string;
  type: HistoryType;
  amount?: number;
  description: string;
}

export async function addHistoryEvent(input: NewHistoryInput): Promise<HistoryEvent> {
  const event: HistoryEvent = {
    id: uuid(),
    customerId: input.customerId,
    walletId: input.walletId,
    type: input.type,
    amount: input.amount,
    description: input.description,
    timestamp: new Date().toISOString(),
  };
  historyStore.push(event);
  return event;
}

export async function getCustomerHistory(customerId: string): Promise<HistoryEvent[]> {
  return historyStore
    .filter(h => h.customerId === customerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
