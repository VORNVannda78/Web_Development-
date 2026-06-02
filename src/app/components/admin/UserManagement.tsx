import { useState } from "react";
import { Search, Ban, CheckCircle, User as UserIcon, Bike, Store } from "lucide-react";
import { users as initialUsers, riders, type User } from "../../data/mockData";

type RoleFilter = "All" | "customer" | "rider" | "restaurant";

const roleIcons: Record<string, any> = { customer: UserIcon, rider: Bike, restaurant: Store };
const roleColors: Record<string, string> = {
  customer: "bg-blue-100 text-blue-600",
  rider: "bg-amber-100 text-amber-600",
  restaurant: "bg-red-100 text-red-600",
  admin: "bg-purple-100 text-purple-600",
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleActive = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const roleCounts = {
    All: users.length,
    customer: users.filter((u) => u.role === "customer").length,
    rider: users.filter((u) => u.role === "rider").length,
    restaurant: users.filter((u) => u.role === "restaurant").length,
  };

  return (
    <div className="pb-4">
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <h1 className="font-black text-lg text-gray-900">User Management</h1>
      </div>

      {/* Stats */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: "Customers", value: "48,240", color: "bg-blue-50 text-blue-700" },
            { label: "Riders", value: "312", color: "bg-amber-50 text-amber-700" },
            { label: "Restaurants", value: "520", color: "bg-red-50 text-red-700" },
            { label: "Total", value: "52K+", color: "bg-gray-50 text-gray-700" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-2 text-center`}>
              <div className="font-black text-sm">{stat.value}</div>
              <div className="text-xs opacity-70 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none"
          />
        </div>

        {/* Role Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {(Object.keys(roleCounts) as RoleFilter[]).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                roleFilter === role ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {role} ({roleCounts[role]})
            </button>
          ))}
        </div>

        {/* User List */}
        <div className="space-y-3">
          {filtered.map((user) => {
            const RoleIcon = roleIcons[user.role] || User;
            return (
              <div key={user.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 ${!user.isActive ? "opacity-60" : ""}`}>
                <div className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-600 text-sm flex-shrink-0">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">{user.name}</div>
                  <div className="text-xs text-gray-400 truncate">{user.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize flex items-center gap-1 ${roleColors[user.role]}`}>
                      <RoleIcon className="w-2.5 h-2.5" />
                      {user.role}
                    </span>
                    <span className={`text-xs ${user.isActive ? "text-green-500" : "text-gray-400"}`}>
                      {user.isActive ? "● Active" : "○ Inactive"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(user.id)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    user.isActive
                      ? "bg-red-50 text-red-500 border border-red-200"
                      : "bg-green-50 text-green-600 border border-green-200"
                  }`}
                >
                  {user.isActive ? (
                    <><Ban className="w-3 h-3" /> Block</>
                  ) : (
                    <><CheckCircle className="w-3 h-3" /> Activate</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Riders Section */}
        <div className="mt-6">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Bike className="w-5 h-5 text-amber-500" />
            Active Riders
          </h2>
          <div className="space-y-3">
            {riders.map((rider) => (
              <div key={rider.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 ${!rider.isOnline ? "opacity-60" : ""}`}>
                <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center font-bold text-amber-600 text-sm flex-shrink-0">
                  {rider.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{rider.name}</div>
                  <div className="text-xs text-gray-400">{rider.phone}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium ${rider.isOnline ? "text-green-500" : "text-gray-400"}`}>
                      {rider.isOnline ? "● Online" : "○ Offline"}
                    </span>
                    <span className="text-xs text-gray-400">⭐ {rider.rating}</span>
                    <span className="text-xs text-gray-400">{rider.totalDeliveries} deliveries</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">${rider.todayEarnings}</div>
                  <div className="text-xs text-gray-400">Today</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
