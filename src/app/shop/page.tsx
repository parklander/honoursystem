'use client';

import { useEffect, useState } from 'react';
import { createClientClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';
import { ConsumableCategory } from '@/lib/database.types';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

type Consumable = Database['public']['Tables']['consumables']['Row'];

export default function ShopPage() {
  const [consumables, setConsables] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ConsumableCategory | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const supabase = createClientClient();

  useEffect(() => {
    fetchConsumables();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchConsumables = async () => {
    try {
      const { data, error } = await supabase
        .from('consumables')
        .select('*')
        .order('category');

      if (error) throw error;
      setConsables(data || []);
    } catch (error) {
      console.error('Error fetching consumables:', error);
      toast.error('Failed to load shop items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (consumableId: string) => {
    setCart(prev => ({
      ...prev,
      [consumableId]: (prev[consumableId] || 0) + 1
    }));
    toast.success('Added to cart');
  };

  const removeFromCart = (consumableId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[consumableId] > 1) {
        newCart[consumableId] -= 1;
      } else {
        delete newCart[consumableId];
      }
      return newCart;
    });
    toast.success('Removed from cart');
  };

  const filteredConsumables = selectedCategory
    ? consumables.filter(item => item.category === selectedCategory)
    : consumables;

  const categories = Array.from(new Set(consumables.map(item => item.category)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-xl">Loading shop...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Makerspace Shop</h1>
        
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg ${
                !selectedCategory ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              All Items
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  selectedCategory === category ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsumables.map(item => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-300 mb-4">{item.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                <span className="text-sm text-gray-400">
                  {item.stock_quantity} {item.unit}{item.stock_quantity !== 1 ? 's' : ''} in stock
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(item.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
                {cart[item.id] > 0 && (
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {Object.keys(cart).length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <span className="text-lg font-semibold">Cart Items: </span>
                {Object.entries(cart).map(([id, quantity]) => {
                  const item = consumables.find(c => c.id === id);
                  return (
                    <span key={id} className="mr-4">
                      {item?.name}: {quantity}
                    </span>
                  );
                })}
              </div>
              <Link
                href="/shop/checkout"
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 