import { useState } from "react";
import { Ban, Bike, CheckCircle, Edit3, Search, Store, User as UserIcon, Users } from "lucide-react";
import { users as initialUsers, riders, type User } from "../../data/mockData";

type RoleFilter = "All" | "customer" | "rider" | "restaurant" | "admin";
type EditableUser = User & {
  location: string;
  notes: string;
};

const roleIcons: Record<User["role"], typeof UserIcon> = {
  customer: UserIcon,
  rider: Bike,
  restaurant: Store,
  admin: Users,
};

const roleTones: Record<User["role"], string> = {
  customer: "bg-blue-50 text-blue-700 border-blue-200",
  rider: "bg-amber-50 text-amber-700 border-amber-200",
  restaurant: "bg-rose-50 text-rose-700 border-rose-200",
  admin: "bg-slate-100 text-slate-700 border-slate-200",
};

const seededUsers: EditableUser[] = initialUsers.map((user) => ({
  ...user,
  location:
    user.role === "restaurant"
      ? "Phnom Penh merchant office"
      : user.role === "rider"
        ? "Phnom Penh delivery zone"
        : "Customer address on file",
  notes: user.role === "rider" ? "Check rider rating monthly." : "No active support flags.",
}));

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`rounded-md border px-2 py-1 text-xs font-black ${active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
      {active ? "Active" : "Blocked"}
    </span>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState<EditableUser[]>(seededUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);

  const filtered = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email} ${user.phone} ${user.location} ${user.role}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleActive = (id: string) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, isActive: !user.isActive } : user)));
  };

  const saveUser = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? editingUser : user)));
    setEditingUser(null);
  };

  const roleCounts: Record<RoleFilter, number> = {
    All: users.length,
    customer: users.filter((user) => user.role === "customer").length,
    rider: users.filter((user) => user.role === "rider").length,
    restaurant: users.filter((user) => user.role === "restaurant").length,
    admin: users.filter((user) => user.role === "admin").length,
  };

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-950">User Management</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">Edit profiles, update contact data, and control access across all roles.</p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, phone, email, location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {[
            { label: "Customers", value: "48,240", icon: UserIcon, tone: "text-blue-600 bg-blue-50" },
            { label: "Riders", value: "312", icon: Bike, tone: "text-amber-600 bg-amber-50" },
            { label: "Merchants", value: "520", icon: Store, tone: "text-rose-600 bg-rose-50" },
            { label: "Total Users", value: "52K+", icon: Users, tone: "text-slate-700 bg-slate-100" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-500">{stat.label}</div>
                  <div className="mt-1 text-2xl font-black text-slate-950">{stat.value}</div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.tone}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {(Object.keys(roleCounts) as RoleFilter[]).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-black capitalize ${
                roleFilter === role ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {role} <span className={roleFilter === role ? "text-white/70" : "text-slate-400"}>{roleCounts[role]}</span>
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => {
                  const RoleIcon = roleIcons[user.role];
                  return (
                    <tr key={user.id} className={!user.isActive ? "bg-red-50/40" : "hover:bg-slate-50/70"}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-600">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-black text-slate-950">{user.name}</div>
                            <div className="text-xs font-semibold text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-700">{user.phone}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-black capitalize ${roleTones[user.role]}`}>
                          <RoleIcon className="h-3.5 w-3.5" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-600">{user.location}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-600">{user.joinedAt}</td>
                      <td className="px-4 py-4"><StatusBadge active={user.isActive} /></td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(user.id)}
                            className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-black ${
                              user.isActive ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {user.isActive ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                            {user.isActive ? "Block" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-black text-slate-950">Active Riders</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {riders.map((rider) => (
              <div key={rider.id} className={`rounded-lg border border-slate-200 p-4 ${!rider.isOnline ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-black text-slate-950">{rider.name}</div>
                    <div className="text-xs font-semibold text-slate-500">{rider.phone}</div>
                  </div>
                  <StatusBadge active={rider.isOnline} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-slate-500">
                  <div className="rounded-md bg-slate-50 p-2">Rating {rider.rating}</div>
                  <div className="rounded-md bg-slate-50 p-2">{rider.totalDeliveries} deliveries</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">Edit User</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Update profile, role, contact, location, and admin notes.</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-black text-slate-600">Close</button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Phone", key: "phone", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Location", key: "location", type: "text" },
              ].map((field) => (
                <label key={field.key} className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">{field.label}</span>
                  <input
                    type={field.type}
                    value={String(editingUser[field.key as keyof EditableUser])}
                    onChange={(event) => setEditingUser({ ...editingUser, [field.key]: event.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
                  />
                </label>
              ))}

              <label className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Role</span>
                <select
                  value={editingUser.role}
                  onChange={(event) => setEditingUser({ ...editingUser, role: event.target.value as User["role"] })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
                >
                  <option value="customer">Customer</option>
                  <option value="rider">Rider</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Status</span>
                <select
                  value={editingUser.isActive ? "active" : "blocked"}
                  onChange={(event) => setEditingUser({ ...editingUser, isActive: event.target.value === "active" })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block space-y-1">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Admin Notes</span>
              <textarea
                value={editingUser.notes}
                onChange={(event) => setEditingUser({ ...editingUser, notes: event.target.value })}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
              />
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditingUser(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600">Cancel</button>
              <button onClick={saveUser} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-black text-white hover:bg-rose-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
