export type PosBootstrap = {
  categories: any[];
  revenueGroups: any[];
  products: any[];
  variants: any[];
  stockItems: any[];
  modifierGroups: any[];
  productModifierGroups: any[];
  menuCards: any[];
  menuItems: any[];
  priceRules: any[];
};

export async function fetchPosBootstrap(): Promise<PosBootstrap> {
  const res = await fetch("/pos/bootstrap");
  if (!res.ok) {
    throw new Error("Failed to load POS bootstrap");
  }
  return res.json();
}
