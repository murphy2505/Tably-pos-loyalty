import { v4 as uuid } from 'uuid';
import { customers } from '../db/memory.js';
import { Customer } from '../models/types.js';

export function createCustomer(name: string): Customer {
  const customer: Customer = { id: uuid(), name, points: 0, createdAt: new Date() };
  customers.push(customer);
  return customer;
}

export function listCustomers(): Customer[] {
  return customers;
}

export function findCustomer(id: string): Customer | undefined {
  return customers.find(c => c.id === id);
}
