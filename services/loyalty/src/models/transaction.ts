export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  description?: string;
  createdAt: string;
}
