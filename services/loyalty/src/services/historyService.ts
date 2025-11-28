import { v4 as uuid } from 'uuid';
import { HistoryEvent, HistoryType } from '../models/history';

export const historyStore: HistoryEvent[] = [];

export type NewHistoryEventInput = {
  customerId: string;
  walletId?: string;
  type: HistoryType;
  amount?: number;
  description: string;
  timestamp?: string;
};

export async function addHistoryEvent(input: NewHistoryEventInput): Promise<HistoryEvent> {
  const event: HistoryEvent = {
    id: uuid(),
    customerId: input.customerId,
    walletId: input.walletId,
    type: input.type,
    amount: input.amount,
    description: input.description,
    timestamp: input.timestamp ?? new Date().toISOString(),
  };

  historyStore.unshift(event);
  return event;
}

export async function getHistoryForCustomer(customerId: string): Promise<HistoryEvent[]> {
  return historyStore
    .filter(e => e.customerId === customerId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

export async function getHistoryForWallet(walletId: string): Promise<HistoryEvent[]> {
  return historyStore
    .filter(e => e.walletId === walletId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

// 👉 Dit is de alias waar jouw route om vraagt
export async function getCustomerHistory(customerId: string): Promise<HistoryEvent[]> {
  return getHistoryForCustomer(customerId);
}
