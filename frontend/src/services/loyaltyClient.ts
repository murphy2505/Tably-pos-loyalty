export type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

export type CustomerDetail = {
  customer: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    totalPoints?: number;
    totalVisits?: number;
  };
  wallets: Array<{
    id: string;
    type: string;
    balance: number;
  }>;
  history: Array<{
    id: string;
    type: string;
    amount?: number;
    timestamp: string;
    description?: string;
  }>;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch("/loyalty-api/customers");
  const data = await handleResponse<any>(res);
  if (!Array.isArray(data)) {
    throw new Error("Unexpected customers payload");
  }
  return data.map((c: any) => ({
    id: String(c.id),
    name: String(c.name ?? ""),
    phone: c.phone ? String(c.phone) : undefined,
    email: c.email ? String(c.email) : undefined,
  }));
}

export async function fetchCustomerDetail(id: string): Promise<CustomerDetail> {
  const res = await fetch(`/loyalty-api/customers/${id}`);
  return handleResponse<CustomerDetail>(res);
}
