import { RevenueChart } from '@/components/layout/dashboard/revenue-chart'
import { StatCard } from '@/components/layout/dashboard/stat-card'
import { TransactionTable } from '@/components/layout/dashboard/transaction-table'
import { DollarSign, TicketPercent, TrendingUp, WalletCards } from "lucide-react";

function AdminDashbard() {
  return (
    <>
    {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard  title="Gross Revenue" value="$487,500" change="+14.2%" icon={DollarSign} />
        <StatCard title="Net Profit" value="$213,100" change="+28.7%" icon={TrendingUp} />
        <StatCard title="Refund Rate" value="3.1%" change="+26.2%" icon={TicketPercent} />
        <StatCard title="Avg Transaction" value="$74.20" change="+8.5%" icon={WalletCards} />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RevenueChart  />
        {/* আপনি চাইলে এখানে CostsChart ও যোগ করতে পারেন */}
      </div>

      {/* Recent Transactions */}
      <TransactionTable />
      </>
  )
}

export default AdminDashbard
