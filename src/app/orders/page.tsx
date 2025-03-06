'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

type ConsumablePurchase = Database['public']['Tables']['consumable_purchases']['Row'] & {
  consumables: Database['public']['Tables']['consumables']['Row'] | null;
};

export default async function OrderHistoryPage() {
  const supabase = createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <div>Please log in to view your order history</div>;
  }

  const { data: orders, error: ordersError } = await supabase
    .from('consumable_purchases')
    .select(`
      id,
      updated_at,
      status,
      total_price,
      quantity,
      consumables!consumable_id(
        name,
        unit
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .returns<ConsumablePurchase[]>();

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    return <div>Error loading order history</div>;
  }

  console.log('Orders with consumables:', orders);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        
        <div className="space-y-6">
          {orders?.map((order) => (
            <div 
              key={order.id} 
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400">
                    Order ID: <span className="text-gray-300">{order.id}</span>
                  </p>
                  <p className="text-gray-400">
                    Date: <span className="text-gray-300">
                      {new Date(order.updated_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'paid'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              
              <div className="mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Quantity</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr>
                      <td className="py-2">{order.consumables?.name || 'Unknown Item'}</td>
                      <td className="py-2">
                        {order.quantity} {order.consumables?.unit || 'units'}
                      </td>
                      <td className="py-2 text-right">
                        ${order.total_price.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="font-medium text-white">
                      <td colSpan={2} className="pt-4 text-right">Total:</td>
                      <td className="pt-4 text-right">
                        ${order.total_price.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          
          {(!orders || orders.length === 0) && (
            <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-lg">
              You haven't placed any orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 