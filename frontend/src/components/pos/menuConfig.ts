export type MenuItem =
  | { key: string; label: string; to: string }
  | { key: string; label: string; children: { key: string; label: string; to: string }[] };

export const posMenu: MenuItem[] = [
  { key: "cashier", label: "Kassa", to: "/pos/kassa" },
  {
    key: "products-group",
    label: "Producten",
    children: [
      { key: "products", label: "Producten", to: "/pos/products" },
      { key: "categories", label: "Categorieën", to: "/pos/categories" },
      { key: "revenue-groups", label: "Omzetgroepen", to: "/pos/revenue-groups" },
      { key: "menus", label: "Menukaarten", to: "/pos/menus" },
    ],
  },
  { key: "kds", label: "KDS", to: "/pos/kds" },
  { key: "reports", label: "Rapportage", to: "/pos/reports" },
  { key: "planning", label: "Planning", to: "/pos/planning" },
  { key: "customers", label: "Klanten", to: "/pos/customers" },
  { key: "giftcards", label: "Kadokaarten", to: "/pos/giftcards" },
  { key: "settings", label: "Instellingen", to: "/pos/settings" },
];
