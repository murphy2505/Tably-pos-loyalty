export interface Customer {
  id: string;
  name: string;
  points: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number; // currency units
  pointsEarned: number;
  createdAt: Date;
}

export interface RewardRedemption {
  id: string;
  customerId: string;
  pointsRedeemed: number;
  createdAt: Date;
}
