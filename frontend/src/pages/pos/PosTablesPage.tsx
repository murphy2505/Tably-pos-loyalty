import { useEffect, useState } from "react";

type PosTable = {
  id: string;
  tenantId: string;
  locationId: string;
  name: string;
  state: string; // FREE | SEATED | BILL_OPEN
};

const PosTablesPage = () => {
  const [tables, setTables] = useState<PosTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/pos/tables");
        if (!res.ok) {
          throw new Error("Kon tafels niet laden");
        }
        const data = await res.json();
        setTables(data);
      } catch (e: any) {
        setError(e.message || "Onbekende fout");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Tafels laden…</div>;
  if (error) return <div>Fout bij laden tafels: {error}</div>;

  return (
    <div className="pos-tables-page">
      <h2>Tafels</h2>
      {tables.length === 0 ? (
        <p>Er zijn nog geen tafels geconfigureerd.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Locatie</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.locationId}</td>
                <td>{t.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PosTablesPage;
