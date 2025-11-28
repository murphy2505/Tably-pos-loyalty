import { v4 as uuid } from 'uuid';
import type { HistoryEvent, HistoryType } from '../models/history';

// In-memory history store
export const historyStore: HistoryEvent[] = [];

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
