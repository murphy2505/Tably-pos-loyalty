export type HistoryType =
  | 'POS_ORDER'
  | 'LOYALTY_ADD'
  | 'LOYALTY_REDEEM'
  | 'GIFTCARD_USE'
  | 'CALL'
  | 'NOTE';

export type HistoryEvent = {
  id: string;
  customerId: string;
  walletId?: string;
  type: HistoryType;
  amount?: number;
  description: string;
  timestamp: string;
};
