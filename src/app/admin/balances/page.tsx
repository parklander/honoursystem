// Server Component - handles data fetching
import { fetchUnpaidOrders } from '@/app/lib/supabase/server-actions'
import BalancesDisplay from './BalancesDisplay'

export default async function BalancesPage() {
  // Server-side data fetching
  const orders = await fetchUnpaidOrders()
  
  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Outstanding Balances</h1>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <BalancesDisplay orders={orders} />
      </div>
    </main>
  )
} 