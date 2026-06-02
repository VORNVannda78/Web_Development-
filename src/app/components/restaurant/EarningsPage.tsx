import { TrendingUp, DollarSign, ShoppingBag, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const monthlyData = [
  { month: "Dec", revenue: 3200 },
  { month: "Jan", revenue: 4100 },
  { month: "Feb", revenue: 3800 },
  { month: "Mar", revenue: 5200 },
  { month: "Apr", revenue: 4900 },
  { month: "May", revenue: 6100 },
];

const transactions = [
  { id: "ORD001", amount: 22.5, date: "2026-05-13", status: "Settled" },
  { id: "ORD003", amount: 12.0, date: "2026-05-13", status: "Pending" },
  { id: "ORD002", amount: 24.0, date: "2026-05-12", status: "Settled" },
  { id: "ORD008", amount: 35.5, date: "2026-05-12", status: "Settled" },
  { id: "ORD011", amount: 18.0, date: "2026-05-11", status: "Settled" },
];

export function EarningsPage() {
  return (
    <div className="pb-4">
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <h1 className="font-black text-lg text-gray-900">Earnings</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Total Earnings Card */}
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="text-sm opacity-80 mb-1">Total Earnings</div>
          <div className="text-4xl font-black mb-1">$18,500</div>
          <div className="text-sm opacity-70">All time revenue</div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/20 rounded-xl p-3">
              <div className="text-xs opacity-80">This Month</div>
              <div className="text-lg font-black">$6,100</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="text-xs opacity-80">Today</div>
              <div className="text-lg font-black">$185</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Orders", value: "1,240", icon: ShoppingBag, color: "text-red-500 bg-red-50" },
            { label: "Avg Order", value: "$14.9", icon: DollarSign, color: "text-orange-500 bg-orange-50" },
            { label: "This Week", value: "$2,090", icon: TrendingUp, color: "text-green-500 bg-green-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
              <div className={`w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="font-bold text-gray-900 text-sm">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Revenue Trend</h3>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Last 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="earningGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                formatter={(v: number) => [`$${v}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} fill="url(#earningGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">#{tx.id}</div>
                  <div className="text-xs text-gray-400">{tx.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">${tx.amount.toFixed(2)}</div>
                  <span className={`text-xs font-medium ${tx.status === "Settled" ? "text-green-600" : "text-orange-500"}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
