'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';
import { toast } from 'react-hot-toast';

type Consumable = Database['public']['Tables']['consumables']['Row'];

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{ item: Consumable; quantity: number }>>([]);
  const supabase = createClientClient();

  useEffect(() => {
    const fetchCartItems = async () => {
      // Get cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '{}');
      
      if (Object.keys(cart).length === 0) {
        toast.error('Your cart is empty');
        router.push('/shop');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('consumables')
          .select('*')
          .in('id', Object.keys(cart));

        if (error) throw error;

        // Check stock availability
        const items = data.map(item => ({
          item,
          quantity: cart[item.id],
          inStock: item.stock_quantity >= cart[item.id]
        }));

        const outOfStock = items.find(item => !item.inStock);
        if (outOfStock) {
          toast.error(`${outOfStock.item.name} is out of stock`);
          router.push('/shop');
          return;
        }

        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to load cart items');
        router.push('/shop');
      }
    };

    fetchCartItems();
  }, [router, supabase]);

  const calculateTotal = () => {
    return cartItems.reduce((total, { item, quantity }) => {
      return total + (item.price * quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create individual purchase records for each item
      const purchases = cartItems.map(({ item, quantity }) => ({
        user_id: user.id,
        consumable_id: item.id,
        quantity: quantity,
        total_price: item.price * quantity,
        purchase_date: new Date().toISOString(),
        status: 'unpaid',
        notes: `Purchased from shop`
      }));

      const { error: purchaseError } = await supabase
        .from('consumable_purchases')
        .insert(purchases);

      if (purchaseError) {
        console.error('Purchase error:', purchaseError);
        throw purchaseError;
      }

      // Update stock quantities
      for (const { item, quantity } of cartItems) {
        const { error: stockError } = await supabase
          .from('consumables')
          .update({ 
            stock_quantity: item.stock_quantity - quantity 
          })
          .eq('id', item.id);

        if (stockError) {
          console.error('Stock update error:', stockError);
          throw stockError;
        }
      }

      // Clear cart
      localStorage.removeItem('cart');
      
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-xl">Loading checkout...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map(({ item, quantity }) => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-400">
                  {quantity} x ${item.price.toFixed(2)}
                </p>
              </div>
              <span className="font-semibold">
                ${(item.price * quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </main>
  );
} 