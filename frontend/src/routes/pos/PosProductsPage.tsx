import { useOutletContext } from "react-router-dom";
import type { PosBootstrap } from "../../services/posBootstrap";

export default function PosProductsPage() {
  const {
    products,
    variants,
    categories,
    revenueGroups,
  } = useOutletContext<PosBootstrap>();

  const catById = Object.fromEntries(
    categories.map((c: any) => [c.id, c])
  );
  const groupById = Object.fromEntries(
    revenueGroups.map((g: any) => [g.id, g])
  );

  const variantsByProduct: Record<string, any[]> = {};
  for (const v of variants) {
    if (!variantsByProduct[v.productId]) variantsByProduct[v.productId] = [];
    variantsByProduct[v.productId].push(v);
  }

  return (
    <div className="pos-products-page">
      <h2>Producten</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Categorie</th>
            <th>Omzetgroep</th>
            <th>Varianten</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => {
            const cat = catById[p.categoryId];
            const group = p.revenueGroupId
              ? groupById[p.revenueGroupId]
              : null;
            const pv = variantsByProduct[p.id] || [];

            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{cat ? cat.name : "-"}</td>
                <td>{group ? group.name : "-"}</td>
                <td>
                  {pv.length === 0
                    ? "–"
                    : pv
                        .map(
                          (v) =>
                            `${v.name} (€${v.price.toFixed(2).replace(
                              ".",
                              ","
                            )})`
                        )
                        .join(", ")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
