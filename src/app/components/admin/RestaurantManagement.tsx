import { useState } from "react";
import { Ban, CheckCircle, Search, Store, XCircle } from "lucide-react";
import { restaurants as initialRestaurants, type Restaurant } from "../../data/mockData";

const pendingRestaurants: Restaurant[] = [
  {
    id: "r7",
    name: "Kroeung Kitchen",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop",
    category: "Khmer Food",
    rating: 0,
    reviews: 0,
    deliveryTime: "30-40 min",
    deliveryFee: 1.5,
    minOrder: 5,
    address: "Street 105, Phnom Penh",
    phone: "012 999 888",
    isOpen: false,
    isApproved: false,
    isBlocked: false,
    totalOrders: 0,
    totalEarnings: 0,
  },
  {
    id: "r8",
    name: "Sunset Sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=250&fit=crop",
    category: "Fast Food",
    rating: 0,
    reviews: 0,
    deliveryTime: "25-35 min",
    deliveryFee: 2.0,
    minOrder: 8,
    address: "Riverside, Phnom Penh",
    phone: "012 777 666",
    isOpen: false,
    isApproved: false,
    isBlocked: false,
    totalOrders: 0,
    totalEarnings: 0,
  },
];

const merchantOwners: Record<string, string> = {
  r1: "Sokha Lim",
  r2: "Chan Dara",
  r3: "Mey Vann",
  r4: "Vicheka Sao",
  r5: "Sopheap Kim",
  r6: "Rithy Long",
  r7: "Kosal Chea",
  r8: "Nita Hor",
};

type TabType = "All" | "Pending" | "Approved" | "Blocked";

function statusFor(restaurant: Restaurant) {
  if (restaurant.isBlocked) return "Blocked";
  if (!restaurant.isApproved) return "Pending";
  return restaurant.isOpen ? "Active" : "Approved";
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Active" || status === "Approved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Pending"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";

  return <span className={`rounded-md border px-2 py-1 text-xs font-black ${tone}`}>{status}</span>;
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([...initialRestaurants, ...pendingRestaurants]);
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [search, setSearch] = useState("");

  const filtered = restaurants.filter((restaurant) => {
    const status = statusFor(restaurant);
    const matchesSearch = `${restaurant.name} ${merchantOwners[restaurant.id]} ${restaurant.phone} ${restaurant.category}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Pending" && status === "Pending") ||
      (activeTab === "Approved" && (status === "Active" || status === "Approved")) ||
      (activeTab === "Blocked" && status === "Blocked");

    return matchesSearch && matchesTab;
  });

  const approve = (id: string) => {
    setRestaurants((prev) => prev.map((restaurant) => (restaurant.id === id ? { ...restaurant, isApproved: true, isBlocked: false } : restaurant)));
  };

  const reject = (id: string) => {
    setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== id));
  };

  const toggleBlock = (id: string) => {
    setRestaurants((prev) => prev.map((restaurant) => (restaurant.id === id ? { ...restaurant, isBlocked: !restaurant.isBlocked } : restaurant)));
  };

  const tabCounts = {
    All: restaurants.length,
    Pending: restaurants.filter((restaurant) => statusFor(restaurant) === "Pending").length,
    Approved: restaurants.filter((restaurant) => ["Active", "Approved"].includes(statusFor(restaurant))).length,
    Blocked: restaurants.filter((restaurant) => statusFor(restaurant) === "Blocked").length,
  };

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-950">Merchant Management</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">Review approvals, monitor performance, and control merchant access.</p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchant, owner, phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {(Object.keys(tabCounts) as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-black ${
                activeTab === tab ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
              <span className={activeTab === tab ? "text-white/70" : "text-slate-400"}>{tabCounts[tab]}</span>
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((restaurant) => {
                  const status = statusFor(restaurant);
                  return (
                    <tr key={restaurant.id} className={restaurant.isBlocked ? "bg-red-50/40" : "hover:bg-slate-50/70"}>
                      <td className="px-4 py-4">
                        <div className="font-black text-slate-950">{restaurant.name}</div>
                        <div className="mt-1 text-xs font-semibold text-slate-500">{restaurant.category} / {restaurant.address}</div>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-700">{merchantOwners[restaurant.id]}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-600">{restaurant.phone}</td>
                      <td className="px-4 py-4 text-sm font-black text-slate-950">{restaurant.totalOrders.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm font-black text-slate-950">{money(restaurant.totalEarnings)}</td>
                      <td className="px-4 py-4"><StatusBadge status={status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          {!restaurant.isApproved && !restaurant.isBlocked && (
                            <>
                              <button
                                onClick={() => approve(restaurant.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-100"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => reject(restaurant.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            </>
                          )}
                          {restaurant.isApproved && (
                            <button
                              onClick={() => toggleBlock(restaurant.id)}
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-black ${
                                restaurant.isBlocked
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-700 hover:bg-red-100"
                              }`}
                            >
                              {restaurant.isBlocked ? <CheckCircle className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                              {restaurant.isBlocked ? "Unblock" : "Block"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
