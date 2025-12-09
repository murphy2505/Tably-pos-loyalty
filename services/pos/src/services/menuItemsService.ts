export async function getAllMenuItems(tenantId: string) {
  return [];
}

export async function createMenuItem(tenantId: string, data: any) {
  return { id: "temp", ...data };
}

export async function updateMenuItem(tenantId: string, id: string, data: any) {
  return { id, ...data };
}

export async function deleteMenuItem(tenantId: string, id: string) {
  return true;
}
