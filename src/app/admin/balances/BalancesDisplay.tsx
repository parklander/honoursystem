'use client'

import { useState } from 'react'

interface UnpaidOrder {
  user_id: string;
  total_price: number;
  quantity: number;
  user_profiles: {
    full_name: string;
  };
  consumables: {
    name: string;
    unit: string;
  };
}

interface UserBalance {
  user_id: string;
  full_name: string;
  total_owed: number;
  orders: UnpaidOrder[];
}

interface BalancesDisplayProps {
  orders: UnpaidOrder[];
}

export default function BalancesDisplay({ orders }: BalancesDisplayProps) {
  const [sortBy, setSortBy] = useState<'name' | 'amount'>('name')

  // Group orders by user and calculate totals
  const balances = new Map<string, UserBalance>();
  
  orders?.forEach(order => {
    const userId = order.user_id;
    const userProfile = order.user_profiles;
    const consumable = order.consumables;

    if (!balances.has(userId)) {
      balances.set(userId, {
        user_id: userId,
        full_name: userProfile.full_name,
        total_owed: 0,
        orders: []
      });
    }

    const userBalance = balances.get(userId)!;
    userBalance.total_owed += order.total_price;
    userBalance.orders.push(order);
  });

  const userBalances = Array.from(balances.values());

  const totalUnpaid = userBalances.reduce((total, balance) => total + balance.total_owed, 0);

  const sortedBalances = userBalances.sort((a, b) => {
    if (sortBy === 'name') {
      return a.full_name.localeCompare(b.full_name);
    } else {
      return a.total_owed - b.total_owed;
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold text-green-600">
          Total Outstanding: ${totalUnpaid.toFixed(2)}
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'name' ? 'amount' : 'name')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Sort by {sortBy === 'name' ? 'Amount' : 'Name'}
        </button>
      </div>

      {sortedBalances.length === 0 ? (
        <p className="text-gray-500">No unpaid balances found.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {sortedBalances.map((balance: any) => (
            <div key={balance.user_id} className="py-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{balance.full_name}</h2>
                <div className="text-lg font-bold text-green-600">
                  ${balance.total_owed.toFixed(2)}
                </div>
              </div>
              
              <div className="space-y-2">
                {balance.orders.map((order: UnpaidOrder) => (
                  <div key={order.id} className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      <span className="font-medium">
                        {order.quantity} {order.consumables.unit}
                      </span>
                      {' '}of{' '}
                      <span>
                        {order.consumables.name}
                      </span>
                    </div>
                    <div>
                      ${order.total_price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 