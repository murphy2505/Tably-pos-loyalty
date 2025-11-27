import React, { useState, useMemo } from 'react';
import { Customer, Wallet, HistoryEvent } from '../../types/customers';
import { CustomersList } from '../../components/customers/CustomersList';
import { CustomerDetailPanel } from '../../components/customers/CustomerDetailPanel';

const mockCustomers: Customer[] = [
  {
    id: 'cust-jan',
    name: 'Jan Jansen',
    phone: '0612345678',
    email: 'jan@example.com',
    lastVisit: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    totalVisits: 12,
    totalPoints: 240
  },
  {
    id: 'cust-petra',
    name: 'Petra de Vries',
    phone: '0622334455',
    email: 'petra@example.com',
    lastVisit: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    totalVisits: 5,
    totalPoints: 120
  },
  {
    id: 'cust-ali',
    name: 'Ali K.',
    phone: '0611122233',
    email: 'ali@example.com',
    lastVisit: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    totalVisits: 1,
    totalPoints: 0
  }
];

const mockWallets: Wallet[] = [
  { id: 'wal-jan-loyalty', customerId: 'cust-jan', type: 'loyalty', balance: 240, qrCode: 'QR-JAN', lastUsedAt: new Date().toISOString() },
  { id: 'wal-petra-loyalty', customerId: 'cust-petra', type: 'loyalty', balance: 120, qrCode: 'QR-PETRA', lastUsedAt: new Date().toISOString() },
  { id: 'wal-ali-loyalty', customerId: 'cust-ali', type: 'loyalty', balance: 0, qrCode: 'QR-ALI', lastUsedAt: new Date().toISOString() }
];

const mockHistory: HistoryEvent[] = [
  { id: 'hist-jan-1', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'POS_ORDER', amount: 35.5, description: 'POS order #1001', timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-jan-2', customerId: 'cust-jan', walletId: 'wal-jan-loyalty', type: 'LOYALTY_ADD', amount: 40, description: 'Recent points add', timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-petra-1', customerId: 'cust-petra', walletId: 'wal-petra-loyalty', type: 'POS_ORDER', amount: 20, description: 'POS order #2001', timestamp: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString() },
  { id: 'hist-ali-1', customerId: 'cust-ali', walletId: 'wal-ali-loyalty', type: 'POS_ORDER', amount: 12, description: 'First order', timestamp: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString() }
];

export const CustomersPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>(mockCustomers[0]?.id);

  const selectedCustomer = useMemo(
    () => mockCustomers.find(c => c.id === selectedId),
    [selectedId]
  );

  const selectedWallets = useMemo(
    () => mockWallets.filter(w => w.customerId === selectedId),
    [selectedId]
  );

  const selectedHistory = useMemo(
    () =>
      mockHistory
        .filter(h => h.customerId === selectedId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [selectedId]
  );

  return (
    <div className="h-full flex">
      <div className="w-72 bg-white">
        <CustomersList
          customers={mockCustomers}
          selectedCustomerId={selectedId}
          onSelectCustomer={setSelectedId}
        />
      </div>
      <div className="flex-1 bg-white">
        <CustomerDetailPanel
          customer={selectedCustomer}
          wallets={selectedWallets}
          history={selectedHistory}
        />
      </div>
    </div>
  );
};
