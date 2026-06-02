import { TrendingUp, Store, Users, ShoppingBag, DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { orders, restaurants, users } from "../../data/mockData";

const revenueData = [
  { date: "May 7", revenue: 1240 },
  { date: "May 8", revenue: 1580 },
  { date: "May 9", revenue: 1320 },
  { date: "May 10", revenue: 1890 },
  { date: "May 11", revenue: 2100 },
  { date: "May 12", revenue: 1750 },
  { date: "May 13", revenue: 2340 },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="pb-4 px-4 pt-4">
      <h1 className="font-black text-xl text-gray-900 mb-4">Platform Overview</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-green-400 to-green-600", sub: "This week" },
          { label: "Total Orders", value: "8,420", icon: ShoppingBag, color: "from-red-500 to-red-600", sub: "+15% this week" },
          { label: "Restaurants", value: restaurants.length.toString(), icon: Store, color: "from-orange-400 to-orange-600", sub: `${restaurants.filter(r=>r.isApproved).length} approved` },
          { label: "Users", value: "52,480", icon: Users, color: "from-blue-400 to-blue-600", sub: "+324 new today" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white`}>
            <stat.icon className="w-5 h-5 opacity-80 mb-2" />
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-xs opacity-80 mt-0.5">{stat.label}</div>
            <div className="text-xs opacity-60 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Platform Revenue</h3>
          <span className="text-xs text-gray-400">Last 7 days</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              formatter={(v: number) => [`$${v}`, "Revenue"]}
            />
            <Line type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: "#ef4444", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => navigate("/admin/restaurants")}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
            <Store className="w-5 h-5 text-orange-600" />
          </div>
          <div className="font-bold text-gray-900 text-sm">Manage Restaurants</div>
          <div className="text-xs text-gray-400 mt-1">2 pending approval</div>
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="font-bold text-gray-900 text-sm">Manage Users</div>
          <div className="text-xs text-gray-400 mt-1">324 new today</div>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <button className="text-xs text-red-500 font-medium flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">#{order.id}</div>
                <div className="text-xs text-gray-400">{order.restaurantName}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">${order.totalAmount}</div>
                <span className={`text-xs font-medium ${
                  order.status === "Completed" ? "text-green-600" :
                  order.status === "Delivering" ? "text-blue-600" :
                  "text-orange-600"
                }`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Restaurants */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3">Top Restaurants</h3>
        <div className="space-y-3">
          {restaurants.slice(0, 4).map((r, i) => (
            <div key={r.id} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">{r.name}</div>
                <div className="text-xs text-gray-400">{r.totalOrders} orders</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">${r.totalEarnings.toLocaleString()}</div>
                <div className="text-xs text-green-500">⭐ {r.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
