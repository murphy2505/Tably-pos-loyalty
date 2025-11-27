import React from 'react';
import { Customer, Wallet, HistoryEvent } from '../../types/customers';

interface CustomerDetailPanelProps {
  customer?: Customer;
  wallets?: Wallet[];
  history?: HistoryEvent[];
}

export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({
  customer,
  wallets = [],
  history = []
}) => {
  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500">
        Selecteer een klant links…
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
            QR
          </div>
          <div>
            <h2 className="text-lg font-semibold">{customer.name}</h2>
            <div className="text-sm text-gray-700">{customer.phone}</div>
            {customer.email && <div className="text-xs text-gray-500">{customer.email}</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 border-b">
        <div>
          <h3 className="text-sm font-semibold mb-2">Klantinfo</h3>
          <ul className="text-xs space-y-1">
            <li>Last visit: {customer.lastVisit ?? '—'}</li>
            <li>Total visits: {customer.totalVisits}</li>
            <li>Total points: {customer.totalPoints}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Wallets</h3>
            {wallets.length === 0 && <div className="text-xs text-gray-500">Geen wallets</div>}
          <ul className="space-y-2">
            {wallets.map(w => (
              <li
                key={w.id}
                className="text-xs p-2 border rounded flex justify-between items-center bg-gray-50"
              >
                <span>{w.type}</span>
                <span className="font-mono">{w.balance}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold mb-2">Laatste activiteiten</h3>
        {history.length === 0 && (
          <div className="text-xs text-gray-500">Nog geen activiteiten</div>
        )}
        <ul className="space-y-2">
          {history.map(ev => (
            <li key={ev.id} className="text-xs p-2 rounded border bg-white">
              <div className="flex justify-between">
                <span className="font-medium">{ev.type}</span>
                <span className="text-gray-500">
                  {new Date(ev.timestamp).toLocaleDateString()} {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-gray-700">{ev.description}</div>
              {ev.amount !== undefined && (
                <div className="text-[10px] text-gray-500">Amount: {ev.amount}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
