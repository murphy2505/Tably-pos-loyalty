import React from 'react';
import { Customer } from '../../types/customers';

interface CustomersListProps {
  customers: Customer[];
  selectedCustomerId?: string;
  onSelectCustomer: (id: string) => void;
}

export const CustomersList: React.FC<CustomersListProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer
}) => {
  return (
    <div className="flex flex-col h-full border-r border-gray-200">
      <div className="p-3 border-b bg-gray-50">
        <input
          type="text"
          placeholder="Zoek klant..."
            className="w-full px-2 py-1 text-sm border rounded"
          disabled
        />
      </div>
      <div className="overflow-y-auto">
        {customers.map(c => {
          const active = c.id === selectedCustomerId;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCustomer(c.id)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 focus:outline-none ${
                active ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-600">{c.phone}</div>
              <div className="mt-1 inline-block text-[10px] px-2 py-1 rounded bg-gray-200 text-gray-700">
                {c.totalPoints} punten
              </div>
            </button>
          );
        })}
        {customers.length === 0 && (
          <div className="p-4 text-sm text-gray-500">Geen klanten</div>
        )}
      </div>
    </div>
  );
};
