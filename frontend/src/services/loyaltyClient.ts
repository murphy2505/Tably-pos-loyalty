export type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch("/loyalty-api/customers");
  if (!res.ok) {
    throw new Error(`Failed to fetch customers (${res.status})`);
  }
  const data = await res.json();
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
