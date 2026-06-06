import { Calendar, DollarSign, Download, ShoppingBag, Store, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
  { name: "Khmer Food", value: 38, color: "#e11d48" },
  { name: "Fast Food", value: 28, color: "#f97316" },
  { name: "Noodles", value: 15, color: "#eab308" },
  { name: "BBQ", value: 12, color: "#22c55e" },
  { name: "Others", value: 7, color: "#64748b" },
];

const topRestaurants = [
  { name: "KFC Cambodia", orders: 3560, revenue: 42000, growth: "+18%" },
  { name: "Malis Restaurant", orders: 1240, revenue: 18500, growth: "+12%" },
  { name: "Pizza Company", orders: 1800, revenue: 28000, growth: "+8%" },
  { name: "Bai Cha House", orders: 890, revenue: 12300, growth: "+22%" },
  { name: "Boeng Kak BBQ", orders: 420, revenue: 15600, growth: "+5%" },
];

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function ReportsPage() {
  const totalRevenue = dailySales.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = dailySales.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-950">Reports</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">Platform revenue, order volume, category mix, and merchant ranking.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {["Today", "7 Days", "30 Days", "This Year"].map((period, index) => (
            <button
              key={period}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-black ${
                index === 1 ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Revenue", value: money(totalRevenue), icon: DollarSign, tone: "bg-emerald-50 text-emerald-600", growth: "+15%" },
            { label: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingBag, tone: "bg-rose-50 text-rose-600", growth: "+12%" },
            { label: "Restaurants", value: "520", icon: Store, tone: "bg-amber-50 text-amber-600", growth: "+8%" },
            { label: "Avg Order", value: "$18.50", icon: TrendingUp, tone: "bg-blue-50 text-blue-600", growth: "+3%" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-500">{stat.label}</div>
                  <div className="mt-1 text-2xl font-black text-slate-950">{stat.value}</div>
                  <div className="mt-2 text-xs font-black text-emerald-600">{stat.growth} vs last period</div>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.tone}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Daily Sales</h2>
                <p className="text-sm font-semibold text-slate-500">Revenue trend for the selected period.</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                May 7-13
              </div>
            </div>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={dailySales} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)" }}
                  formatter={(value: number) => [money(value), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#e11d48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-black text-slate-950">Sales by Category</h2>
            <p className="text-sm font-semibold text-slate-500">Share of GMV by food category.</p>
            <div className="mt-4 flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="min-w-0 flex-1 space-y-2">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="flex-1 truncate text-sm font-semibold text-slate-600">{category.name}</span>
                    <span className="text-sm font-black text-slate-900">{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-black text-slate-950">Top Restaurants by Revenue</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topRestaurants.map((restaurant, index) => (
                  <tr key={restaurant.name} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4 text-sm font-black text-slate-400">#{index + 1}</td>
                    <td className="px-4 py-4 font-black text-slate-950">{restaurant.name}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-600">{restaurant.orders.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm font-black text-slate-950">{money(restaurant.revenue)}</td>
                    <td className="px-4 py-4 text-sm font-black text-emerald-600">{restaurant.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
