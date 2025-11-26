import { v4 as uuid } from 'uuid';
import { redemptions } from '../db/memory';
import { RewardRedemption } from '../models/types';
import { findCustomer } from './customerService';

export function redeemPoints(customerId: string, points: number): RewardRedemption {
  const customer = findCustomer(customerId);
  if (!customer) throw new Error('Customer not found');
  if (points <= 0) throw new Error('Points must be positive');
  if (customer.points < points) throw new Error('Insufficient points');
  customer.points -= points;
  const redemption: RewardRedemption = { id: uuid(), customerId, pointsRedeemed: points, createdAt: new Date() };
  redemptions.push(redemption);
  return redemption;
}

export function listRedemptions(customerId?: string): RewardRedemption[] {
  if (!customerId) return redemptions;
  return redemptions.filter(r => r.customerId === customerId);
}
