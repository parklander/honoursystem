'use client';

import { useEffect, useState } from 'react';
import { createClientClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

type Purchase = {
  id: string;
  user_id: string;
  consumable_id: string;
  quantity: number;
  total_price: number;
  purchase_date: string;
  notes: string | null;
  status: 'unpaid' | 'paid';
  consumable?: {
    name: string;
    description: string;
    unit: string;
    price: number;
  };
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOwed, setTotalOwed] = useState(0);
  const supabase = createClientClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: purchases, error } = await supabase
        .from('consumable_purchases')
        .select(`
          *,
          consumable:consumables (
            name,
            description,
            unit,
            price
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'unpaid')
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      setOrders(purchases || []);
      setTotalOwed(purchases?.reduce((sum, p) => sum + Number(p.total_price), 0) || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <div className="text-xl font-semibold">
            Total Balance: <span className="text-red-400">${totalOwed.toFixed(2)}</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No unpaid orders found.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{order.consumable?.name}</h3>
                    <div className="text-sm text-gray-400">
                      {formatDate(order.purchase_date)}
                    </div>
                  </div>
                  <div className="text-xl font-semibold">
                    ${Number(order.total_price).toFixed(2)}
                  </div>
                </div>
                <div className="text-gray-300">
                  <div>{order.consumable?.description}</div>
                  <div className="text-sm text-gray-400">
                    Quantity: {order.quantity} {order.consumable?.unit}
                    {order.quantity !== 1 ? 's' : ''}
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-2 text-sm text-gray-400">
                    Note: {order.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 