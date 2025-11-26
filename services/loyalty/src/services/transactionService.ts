import { v4 as uuid } from 'uuid';
import { transactions, POINT_RATE } from '../db/memory.js';
import { Transaction } from '../models/types.js';
import { findCustomer } from './customerService.js';

export function recordTransaction(customerId: string, amount: number): Transaction {
  const customer = findCustomer(customerId);
  if (!customer) throw new Error('Customer not found');
  if (amount <= 0) throw new Error('Amount must be positive');
  const pointsEarned = Math.floor(amount * POINT_RATE);
  customer.points += pointsEarned;
  const tx: Transaction = { id: uuid(), customerId, amount, pointsEarned, createdAt: new Date() };
  transactions.push(tx);
  return tx;
}

export function listTransactions(customerId?: string): Transaction[] {
  if (!customerId) return transactions;
  return transactions.filter(t => t.customerId === customerId);
}
