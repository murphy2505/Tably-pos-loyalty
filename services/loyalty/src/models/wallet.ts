export type WalletType = "loyalty" | "giftcard" | "group";

export interface Wallet {
  id: string;
  customerId: string;
  type: WalletType;
  balance: number;
  qrCode: string;
  lastUsedAt?: string;
}
