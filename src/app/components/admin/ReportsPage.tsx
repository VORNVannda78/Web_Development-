import { DollarSign, ShoppingBag, Store, TrendingUp, Calendar, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const dailySales = [
  { date: "May 7", orders: 320, revenue: 4240 },
  { date: "May 8", orders: 415, revenue: 5580 },
  { date: "May 9", orders: 380, revenue: 4920 },
  { date: "May 10", orders: 490, revenue: 6890 },
  { date: "May 11", orders: 520, revenue: 7100 },
  { date: "May 12", orders: 445, revenue: 5750 },
  { date: "May 13", orders: 580, revenue: 8340 },
];

const categoryData = [
  { name: "Khmer Food", value: 38, color: "#ef4444" },
  { name: "Fast Food", value: 28, color: "#f97316" },
  { name: "Noodles", value: 15, color: "#eab308" },
  { name: "BBQ", value: 12, color: "#22c55e" },
  { name: "Others", value: 7, color: "#6366f1" },
];

const topRestaurants = [
  { name: "KFC Cambodia", orders: 3560, revenue: 42000, growth: "+18%" },
  { name: "Malis Restaurant", orders: 1240, revenue: 18500, growth: "+12%" },
  { name: "Pizza Company", orders: 1800, revenue: 28000, growth: "+8%" },
  { name: "Bai Cha House", orders: 890, revenue: 12300, growth: "+22%" },
  { name: "Boeng Kak BBQ", orders: 420, revenue: 15600, growth: "+5%" },
];

export function ReportsPage() {
  const totalRevenue = dailySales.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = dailySales.reduce((s, d) => s + d.orders, 0);

  return (
    <div className="pb-4">
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h1 className="font-black text-lg text-gray-900">Reports</h1>
        <button className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Period Selector */}
        <div className="flex gap-2">
          {["Today", "7 Days", "30 Days", "This Year"].map((period, i) => (
            <button
              key={period}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
                i === 1 ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-green-400 to-green-600", growth: "+15%" },
            { label: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingBag, color: "from-red-500 to-red-600", growth: "+12%" },
            { label: "Restaurants", value: "520", icon: Store, color: "from-orange-400 to-orange-600", growth: "+8%" },
            { label: "Avg Order", value: "$18.50", icon: TrendingUp, color: "from-blue-400 to-blue-600", growth: "+3%" },
          ].map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white`}>
              <stat.icon className="w-5 h-5 opacity-80 mb-2" />
              <div className="text-xl font-black">{stat.value}</div>
              <div className="text-xs opacity-80">{stat.label}</div>
              <div className="text-xs opacity-60 mt-1 font-medium">{stat.growth} vs last period</div>
            </div>
          ))}
        </div>

        {/* Daily Sales Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Daily Sales</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              May 7 – 13
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={dailySales} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(1)}K`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                formatter={(v: number) => [`$${v}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="url(#adminGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#111827" />
                  <stop offset="100%" stopColor="#374151" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Sales by Category</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-gray-600 flex-1">{cat.name}</span>
                  <span className="text-xs font-bold text-gray-800">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Restaurants */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">Top Restaurants by Revenue</h3>
          <div className="space-y-3">
            {topRestaurants.map((r, i) => (
              <div key={r.name} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{r.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-gray-700 to-gray-500 h-1.5 rounded-full"
                        style={{ width: `${(r.orders / 3560) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">${(r.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-green-500 font-medium">{r.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
