'use client';

import { useEffect, useState } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { Database } from '@/lib/database.types'

type Tables = Database['public']['Tables']
type UserProfileRow = Tables['user_profiles']['Row']
type ConsumableRow = Tables['consumables']['Row']

interface UserProfile {
  full_name: string;
  roles: string[];
  id: string;
}

interface Consumable {
  name: string;
  unit: string;
}

type UserBalance = {
  user_id: string;
  full_name: string;
  total_owed: number;
  unpaid_orders: Array<{
    id: string;
    consumable_name: string;
    quantity: number;
    total_price: number;
    purchase_date: string;
    unit: string;
  }>;
};

export default function AdminBalancesPage() {
  const [userBalances, setUserBalances] = useState<UserBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      // Check admin status
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('roles')
        .eq('id', user.id)
        .single();

      if (!profile?.roles?.includes('admin')) {
        throw new Error('Not authorized as admin');
      }

      await fetchBalanceData();
    } catch (error) {
      console.error('Admin check error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Access denied');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBalanceData = async () => {
    try {
      console.log('Fetching unpaid balances...');

      // Fetch user profiles with proper typing
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('full_name, roles, id')
        .returns<UserProfile[]>();

      // Fetch consumables with proper typing
      const { data: consumables } = await supabase
        .from('consumables')
        .select('name, unit')
        .returns<Consumable[]>();

      // Access the arrays safely
      const userProfiles = profiles || [];
      const consumableItems = consumables || [];

      // Get only unpaid purchases with consumable details
      const { data: purchases, error: purchasesError } = await supabase
        .from('consumable_purchases')
        .select(`
          id,
          user_id,
          quantity,
          total_price,
          purchase_date,
          consumables (
            name,
            unit
          ),
          user_profiles (
            full_name
          )
        `)
        .eq('status', 'unpaid') // Only get unpaid items
        .order('purchase_date', { ascending: false });

      if (purchasesError) {
        console.error('Purchases error:', purchasesError);
        throw purchasesError;
      }

      if (!purchases || purchases.length === 0) {
        setUserBalances([]);
        return;
      }

      // Group purchases by user
      const userPurchases = new Map<string, {
        full_name: string;
        total: number;
        orders: Array<{
          id: string;
          consumable_name: string;
          quantity: number;
          total_price: number;
          purchase_date: string;
          unit: string;
        }>;
      }>();

      purchases.forEach(purchase => {
        const userId = purchase.user_id;
        const fullName = purchase.user_profiles?.full_name || 'Unknown User';
        
        if (!userPurchases.has(userId)) {
          userPurchases.set(userId, {
            full_name: fullName,
            total: 0,
            orders: []
          });
        }

        const userRecord = userPurchases.get(userId)!;
        userRecord.total += Number(purchase.total_price);
        userRecord.orders.push({
          id: purchase.id,
          consumable_name: purchase.consumables?.name || 'Unknown Item',
          quantity: purchase.quantity,
          total_price: Number(purchase.total_price),
          purchase_date: purchase.purchase_date,
          unit: purchase.consumables?.unit || 'unit'
        });
      });

      // Convert to array and sort by total amount owed
      const balances = Array.from(userPurchases.entries())
        .map(([userId, data]) => ({
          user_id: userId,
          full_name: data.full_name,
          total_owed: data.total,
          unpaid_orders: data.orders
        }))
        .sort((a, b) => b.total_owed - a.total_owed);

      console.log('Loaded unpaid balances:', balances);
      setUserBalances(balances);

    } catch (error) {
      console.error('Data fetching error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load balance data');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpanded = (userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const markAsPaid = async (orderId: string) => {
    try {
      setLoading(true);
      console.log('Starting markAsPaid for order:', orderId);

      // 1. Check admin status - modified to handle multiple profiles
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('full_name, roles, id')
        .returns<UserProfile[]>();

      if (profileError) {
        console.error('Failed to verify admin status:', profileError);
        throw new Error('Failed to verify admin status');
      }

      // Check if any of the user's profiles has admin role
      const isAdmin = profiles?.some(profile => 
        Array.isArray(profile.roles) && profile.roles.includes('admin')
      );

      if (!isAdmin) {
        throw new Error('Only admins can mark orders as paid');
      }

      console.log('Admin status verified');

      // 2. Verify the order exists and is unpaid
      const { data: orderCheck, error: checkError } = await supabase
        .from('consumable_purchases')
        .select('id, status')
        .eq('id', orderId)
        .single();

      if (checkError || !orderCheck) {
        console.error('Failed to find order:', checkError);
        throw new Error('Order not found');
      }

      console.log('Initial order status:', orderCheck.status);

      if (orderCheck.status === 'paid') {
        throw new Error('Order is already marked as paid');
      }

      // 3. Perform the update
      const { data: updateData, error: updateError } = await supabase
        .from('consumable_purchases')
        .update({ status: 'paid' })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) {
        console.error('Update failed:', updateError);
        throw new Error(`Failed to update order status: ${updateError.message}`);
      }

      console.log('Update successful:', updateData);

      // 4. Update local state
      setUserBalances(prevBalances => {
        const updatedBalances = prevBalances.map(userBalance => {
          const remainingOrders = userBalance.unpaid_orders.filter(
            order => order.id !== orderId
          );

          if (remainingOrders.length === 0) {
            return null;
          }

          return {
            ...userBalance,
            unpaid_orders: remainingOrders,
            total_owed: remainingOrders.reduce(
              (sum, order) => sum + order.total_price,
              0
            )
          };
        }).filter((balance): balance is UserBalance => balance !== null);

        return updatedBalances;
      });

      toast.success('Order marked as paid');
      await fetchBalanceData();

    } catch (error) {
      console.error('Error in markAsPaid:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to mark order as paid');
      }
      await fetchBalanceData();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-xl">Loading balances...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Balances</h1>

        {userBalances.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No unpaid balances found.
          </div>
        ) : (
          <div className="space-y-6">
            {userBalances.map(({ user_id, full_name, total_owed, unpaid_orders }) => (
              <div key={user_id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => toggleUserExpanded(user_id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">{full_name}</h2>
                      <p className="text-gray-400 mt-1">
                        {unpaid_orders.length} unpaid order{unpaid_orders.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-red-400">
                      ${total_owed.toFixed(2)}
                    </div>
                  </div>
                </div>

                {expandedUsers.has(user_id) && (
                  <div className="border-t border-gray-700">
                    {unpaid_orders.map(order => (
                      <div 
                        key={order.id} 
                        className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-750"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{order.consumable_name}</h3>
                            <p className="text-sm text-gray-400">
                              {order.quantity} {order.unit}{order.quantity !== 1 ? 's' : ''} - {formatDate(order.purchase_date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">${order.total_price.toFixed(2)}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsPaid(order.id);
                              }}
                              disabled={loading}
                              className={`px-3 py-1 rounded text-sm transition-colors ${
                                loading 
                                  ? 'bg-gray-600 cursor-not-allowed' 
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {loading ? 'Processing...' : 'Mark Paid'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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