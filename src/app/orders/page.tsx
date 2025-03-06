'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';
import { fetchUserOrders } from '@/app/lib/supabase/server-actions';

type Tables = Database['public']['Tables'];
type ConsumablePurchaseRow = Tables['consumable_purchases']['Row'];
type ConsumableRow = Tables['consumables']['Row'];

interface Order {
  id: string;
  user_id: string;
  total_price: number;
  quantity: number;
  status: 'paid' | 'unpaid';
  updated_at: string;
  consumables: {
    name: string;
    unit: string;
  } | null;
}

export default async function OrderHistoryPage() {
  try {
    const orders = await fetchUserOrders()
    
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Order History</h1>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow">
          <div className="p-6">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order: Order) => (
                  <div key={order.id} className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 font-medium">
                          Order #{order.id.slice(0, 8)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          order.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(order.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {order.consumables && (
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">
                            {order.quantity} {order.consumables.unit}
                          </span>
                          {' '}of{' '}
                          <span className="text-gray-100">
                            {order.consumables.name}
                          </span>
                        </div>
                        <div className="font-medium">
                          ${order.total_price.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error fetching orders:', error)
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Order History</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-500">
            Error loading orders. Please try again later.
            {error instanceof Error ? ` (${error.message})` : ''}
          </p>
        </div>
      </main>
    )
  }
} 