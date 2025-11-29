import { v4 as uuid } from "uuid";
import { Wallet, WalletType } from "../models/wallet";
import { Transaction } from "../models/transaction";

// In-memory stores
export const walletsStore: Wallet[] = [
  {
    id: "wal-jan-loyalty",
    customerId: "cust-jan",
    type: "loyalty",
    balance: 240,
    qrCode: "QR-JAN-LOYALTY",
    lastUsedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "wal-petra-loyalty",
    customerId: "cust-petra",
    type: "loyalty",
    balance: 120,
    qrCode: "QR-PETRA-LOYALTY",
    lastUsedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "wal-ali-loyalty",
    customerId: "cust-ali",
    type: "loyalty",
    balance: 0,
    qrCode: "QR-ALI-LOYALTY",
    lastUsedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
  },
];

export const transactionsStore: Transaction[] = [
  {
    id: "tx-jan-1",
    walletId: "wal-jan-loyalty",
    amount: 200,
    description: "Initial points",
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "tx-jan-2",
    walletId: "wal-jan-loyalty",
    amount: 40,
    description: "Order bonus",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "tx-petra-1",
    walletId: "wal-petra-loyalty",
    amount: 120,
    description: "Initial points",
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
  },
];

// ------------------------------------------------------
// CREATE WALLET
// ------------------------------------------------------
export async function createWallet(
  customerId: string,
  type: WalletType,
  qrCode: string
): Promise<Wallet> {
  const wallet: Wallet = {
    id: uuid(),
    customerId,
    type,
    balance: 0,
    qrCode,
    lastUsedAt: undefined,
  };

  walletsStore.push(wallet);
  return wallet;
}

// ------------------------------------------------------
// GET WALLET BY ID
// ------------------------------------------------------
export async function getWalletById(id: string): Promise<Wallet | null> {
  return walletsStore.find((w) => w.id === id) ?? null;
}

// ------------------------------------------------------
// ADD FUNDS / POINTS TO WALLET
// ------------------------------------------------------
export async function addToWallet(
  walletId: string,
  amount: number,
  description?: string
): Promise<{ wallet: Wallet; transaction: Transaction }> {
  const wallet = walletsStore.find((w) => w.id === walletId);
  if (!wallet) throw new Error("Wallet not found");

  wallet.balance += amount;
  wallet.lastUsedAt = new Date().toISOString();

  const tx: Transaction = {
    id: uuid(),
    walletId,
    amount,
    description: description ?? "Wallet add",
    createdAt: new Date().toISOString(),
  };

  transactionsStore.push(tx);

  return { wallet, transaction: tx };
}

// ------------------------------------------------------
// REDEEM / SUBTRACT FROM WALLET
// ------------------------------------------------------
export async function redeemFromWallet(
  walletId: string,
  amount: number,
  description?: string
): Promise<{ wallet: Wallet; transaction: Transaction }> {
  const wallet = walletsStore.find((w) => w.id === walletId);
  if (!wallet) throw new Error("Wallet not found");

  if (wallet.balance < amount) throw new Error("Insufficient balance");

  wallet.balance -= amount;
  wallet.lastUsedAt = new Date().toISOString();

  const tx: Transaction = {
    id: uuid(),
    walletId,
    amount: -amount,
    description: description ?? "Wallet redeem",
    createdAt: new Date().toISOString(),
  };

  transactionsStore.push(tx);

  return { wallet, transaction: tx };
}
