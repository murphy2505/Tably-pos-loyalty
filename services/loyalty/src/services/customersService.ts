import { v4 as uuid } from 'uuid';
import { Customer } from '../models/customer';
import { Wallet } from '../models/wallet';
import { HistoryEvent } from '../models/history';
import { walletsStore } from './walletsService';
import { historyStore } from './historyService';

// In-memory store
export const customersStore: Customer[] = [
  {
    id: 'cust-jan',
    name: 'Jan Jansen',
    phone: '0612345678',
    email: undefined,
    createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(), // ~60 dagen geleden
    lastVisit: undefined, // wordt dynamisch berekend
    totalVisits: 0,       // wordt dynamisch berekend
    totalPoints: 0        // wordt dynamisch berekend
  },
  {
    id: 'cust-petra',
    name: 'Petra de Vries',
    phone: '0622334455',
    email: undefined,
    createdAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    lastVisit: undefined,
    totalVisits: 0,
    totalPoints: 0
  },
  {
    id: 'cust-ali',
    name: 'Ali K.',
    phone: '0611122233',
    email: undefined,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    lastVisit: undefined,
    totalVisits: 0,
    totalPoints: 0
  }
];

// Helpers
function computeTotalPoints(customerId: string, wallets: Wallet[]): number {
  return wallets.filter(w => w.customerId === customerId).reduce((sum, w) => sum + w.balance, 0);
}

function computeLastVisit(customerId: string, history: HistoryEvent[]): string | undefined {
  const last = history
    .filter(h => h.customerId === customerId && (h.type === 'POS_ORDER' || h.type === 'LOYALTY_ADD'))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  return last?.timestamp;
}

function computeTotalVisits(customerId: string, history: HistoryEvent[]): number {
  return history.filter(h => h.customerId === customerId && h.type === 'POS_ORDER').length;
}

// Service API
export async function createCustomer(name: string, phone: string, email?: string): Promise<Customer> {
  const now = new Date().toISOString();
  const customer: Customer = {
    id: uuid(),
    name,
    phone,
    email,
    createdAt: now,
    lastVisit: undefined,
    totalVisits: 0,
    totalPoints: 0,
  };
  customersStore.push(customer);
  return customer;
}

export async function listCustomers(): Promise<Pick<Customer, 'id' | 'name' | 'phone' | 'lastVisit' | 'totalPoints' | 'totalVisits'>[]> {
  return customersStore.map(c => {
    const totalPoints = computeTotalPoints(c.id, walletsStore);
    const lastVisit = computeLastVisit(c.id, historyStore);
    const totalVisits = computeTotalVisits(c.id, historyStore);
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      lastVisit,
      totalPoints,
      totalVisits,
    };
  });
}

export async function getCustomerDetail(id: string): Promise<{ customer: Customer; wallets: Wallet[]; history: HistoryEvent[] } | null> {
  const customer = customersStore.find(c => c.id === id);
  if (!customer) return null;

  // Recompute derived fields
  customer.totalPoints = computeTotalPoints(id, walletsStore);
  customer.lastVisit = computeLastVisit(id, historyStore);
  customer.totalVisits = computeTotalVisits(id, historyStore);

  const wallets = walletsStore.filter(w => w.customerId === id);
  const history = historyStore
    .filter(h => h.customerId === id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return { customer, wallets, history };
}
