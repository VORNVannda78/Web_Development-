import { useNavigate } from "react-router";
import { TrendingUp, ShoppingBag, Clock, Star, ChevronRight, CheckCircle, XCircle, ChefHat } from "lucide-react";
import { orders } from "../../data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const weeklyData = [
  { day: "Mon", orders: 32, revenue: 185 },
  { day: "Tue", orders: 45, revenue: 240 },
  { day: "Wed", orders: 38, revenue: 210 },
  { day: "Thu", orders: 52, revenue: 290 },
  { day: "Fri", orders: 67, revenue: 380 },
  { day: "Sat", orders: 78, revenue: 445 },
  { day: "Sun", orders: 61, revenue: 340 },
];

const pendingOrders = orders.filter((o) => o.restaurantId === "r1" && o.status !== "Completed");

export function RestaurantDashboard() {
  const navigate = useNavigate();

  return (
    <div className="pb-4 px-4 pt-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: "Today's Orders", value: "34", icon: ShoppingBag, color: "from-red-500 to-red-600", sub: "+12% vs yesterday" },
          { label: "Today's Earnings", value: "$185", icon: TrendingUp, color: "from-orange-400 to-orange-600", sub: "+8% vs yesterday" },
          { label: "Pending Orders", value: "5", icon: Clock, color: "from-amber-400 to-amber-600", sub: "Needs attention" },
          { label: "Rating", value: "4.8 ⭐", icon: Star, color: "from-green-400 to-green-600", sub: "From 324 reviews" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white`}>
            <stat.icon className="w-5 h-5 opacity-80 mb-2" />
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-xs font-medium opacity-80 mt-0.5">{stat.label}</div>
            <div className="text-xs opacity-60 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Weekly Revenue</h3>
          <span className="text-xs text-gray-400">This week</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              formatter={(v: number) => [`$${v}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="url(#grad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pending Orders */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">New Orders</h3>
          <button onClick={() => navigate("/restaurant/orders")} className="text-xs text-red-500 font-medium flex items-center gap-1">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {pendingOrders.map((order) => (
            <div key={order.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">#{order.id}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {order.items.map((i) => `${i.foodName} ×${i.quantity}`).join(", ")}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "Cooking" ? "bg-orange-100 text-orange-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>{order.status}</span>
                  <span className="text-xs text-gray-400">${order.totalAmount}</span>
                </div>
              </div>
              {order.status === "Pending" && (
                <div className="flex gap-1">
                  <button className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </button>
                  <button className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              )}
              {order.status === "Cooking" && (
                <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <ChefHat className="w-3 h-3" />
                  Ready
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Foods */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3">Top Selling Foods</h3>
        <div className="space-y-3">
          {[
            { name: "Amok Fish", sold: 145, revenue: 942.5 },
            { name: "Lok Lak", sold: 98, revenue: 686 },
            { name: "Bai Sach Chrouk", sold: 213, revenue: 745.5 },
          ].map((food, i) => (
            <div key={food.name} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">{food.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-400 h-1.5 rounded-full"
                      style={{ width: `${(food.sold / 213) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-gray-800">{food.sold} sold</div>
                <div className="text-xs text-orange-500">${food.revenue}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
