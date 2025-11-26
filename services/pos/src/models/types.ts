export interface Table {
  id: string;
  number: number;
  tenantId: string;
  status: 'open' | 'occupied' | 'closed';
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tenantId: string;
  items: OrderItem[];
  status: 'open' | 'in_kitchen' | 'ready' | 'completed';
  createdAt: Date;
}
