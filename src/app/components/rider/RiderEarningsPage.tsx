import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const weekData = [
  { day: "Mon", earnings: 12.5 },
  { day: "Tue", earnings: 21.0 },
  { day: "Wed", earnings: 18.5 },
  { day: "Thu", earnings: 24.0 },
  { day: "Fri", earnings: 30.5 },
  { day: "Sat", earnings: 38.0 },
  { day: "Sun", earnings: 28.5 },
];

export function RiderEarningsPage() {
  const totalWeek = weekData.reduce((s, d) => s + d.earnings, 0);

  return (
    <div className="pb-4">
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <h1 className="font-black text-lg text-gray-900">My Earnings</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Earnings Summary */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white">
          <div className="text-sm opacity-80 mb-1">Total Earnings (All Time)</div>
          <div className="text-4xl font-black">$1,240</div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/20 rounded-xl p-2.5 text-center">
              <div className="font-black text-lg">$18.50</div>
              <div className="text-xs opacity-80">Today</div>
            </div>
            <div className="bg-white/20 rounded-xl p-2.5 text-center">
              <div className="font-black text-lg">${totalWeek.toFixed(0)}</div>
              <div className="text-xs opacity-80">This Week</div>
            </div>
            <div className="bg-white/20 rounded-xl p-2.5 text-center">
              <div className="font-black text-lg">$342</div>
              <div className="text-xs opacity-80">This Month</div>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Weekly Earnings</h3>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> This week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weekData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                formatter={(v: number) => [`$${v}`, "Earnings"]}
              />
              <Bar dataKey="earnings" fill="url(#riderGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="riderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">Performance</h3>
          <div className="space-y-3">
            {[
              { label: "Acceptance Rate", value: "92%", color: "bg-green-500" },
              { label: "Completion Rate", value: "95%", color: "bg-blue-500" },
              { label: "On-Time Delivery", value: "88%", color: "bg-orange-500" },
            ].map((perf) => (
              <div key={perf.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{perf.label}</span>
                  <span className="font-bold text-gray-900">{perf.value}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className={`${perf.color} rounded-full h-2`}
                    style={{ width: perf.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
