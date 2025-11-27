import type { Customer, HistoryEvent, Wallet } from "../types/customers";

const API_HOST = window.location.hostname || "localhost";
const BASE_URL = `http://${API_HOST}:3000`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(`${BASE_URL}/customers`);
  return handleResponse<Customer[]>(res);
}

export async function getCustomerDetail(id: string): Promise<{ customer: Customer; wallets: Wallet[]; history: HistoryEvent[] }> {
  const res = await fetch(`${BASE_URL}/customers/${id}`);
  return handleResponse<{ customer: Customer; wallets: Wallet[]; history: HistoryEvent[] }>(res);
}

export async function getCustomerHistory(id: string): Promise<HistoryEvent[]> {
  const res = await fetch(`${BASE_URL}/history/customer/${id}`);
  return handleResponse<HistoryEvent[]>(res);
}
