export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastVisit?: string;
  totalVisits: number;
  totalPoints: number;
};

export type Wallet = {
  id: string;
  customerId: string;
  type: "loyalty" | "giftcard" | "group";
  balance: number;
  qrCode: string;
  lastUsedAt?: string;
};

export type HistoryEvent = {
  id: string;
  customerId: string;
  walletId?: string;
  type: "POS_ORDER" | "LOYALTY_ADD" | "LOYALTY_REDEEM" | "GIFTCARD_USE" | "CALL" | "NOTE";
  amount?: number;
  description: string;
  timestamp: string;
};
