import { useEffect, useState } from "react";
import { fetchCustomers, type Customer } from "../../services/loyaltyClient";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchCustomers();
        setCustomers(list);
      } catch (e: any) {
        setError(e.message || "Onbekende fout");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Bezig met laden…</div>;
  }

  if (error) {
    return <div>Fout: {error}</div>;
  }

  return (
    <div>
      <h1>Customers</h1>
      {customers.length === 0 ? (
        <p>Nog geen klanten gevonden.</p>
      ) : (
        <ul>
          {customers.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>{" "}
              {c.phone && <span>({c.phone})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
