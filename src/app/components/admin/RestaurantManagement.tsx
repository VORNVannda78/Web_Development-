import { useState } from "react";
import { Search, CheckCircle, XCircle, Ban, Star, Clock } from "lucide-react";
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

type TabType = "All" | "Pending" | "Approved" | "Blocked";

export function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([...initialRestaurants, ...pendingRestaurants]);
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [search, setSearch] = useState("");

  const filtered = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "All" ? true :
      activeTab === "Pending" ? !r.isApproved && !r.isBlocked :
      activeTab === "Approved" ? r.isApproved && !r.isBlocked :
      r.isBlocked;
    return matchesSearch && matchesTab;
  });

  const approve = (id: string) => {
    setRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, isApproved: true, isBlocked: false } : r));
  };

  const reject = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleBlock = (id: string) => {
    setRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, isBlocked: !r.isBlocked } : r));
  };

  const tabCounts = {
    All: restaurants.length,
    Pending: restaurants.filter((r) => !r.isApproved && !r.isBlocked).length,
    Approved: restaurants.filter((r) => r.isApproved && !r.isBlocked).length,
    Blocked: restaurants.filter((r) => r.isBlocked).length,
  };

  return (
    <div className="pb-4">
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <h1 className="font-black text-lg text-gray-900">Restaurants</h1>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-2 mb-4 overflow-x-auto no-scrollbar">
        {(Object.keys(tabCounts) as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
              activeTab === tab ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {tab}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab ? "bg-white/20" : "bg-gray-100"}`}>
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Restaurant List */}
      <div className="px-4 space-y-4">
        {filtered.map((restaurant) => (
          <div key={restaurant.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${restaurant.isBlocked ? "opacity-60" : ""}`}>
            <div className="relative">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-36 object-cover" />
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                restaurant.isBlocked ? "bg-red-500 text-white" :
                restaurant.isApproved ? "bg-green-500 text-white" :
                "bg-yellow-400 text-white"
              }`}>
                {restaurant.isBlocked ? "Blocked" : restaurant.isApproved ? "Approved" : "Pending"}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-gray-900">{restaurant.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{restaurant.address}</div>
                </div>
                {restaurant.reviews > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-700">{restaurant.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span>{restaurant.category}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {restaurant.deliveryTime}
                </div>
                {restaurant.totalOrders > 0 && (
                  <>
                    <span>•</span>
                    <span>{restaurant.totalOrders} orders</span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!restaurant.isApproved && !restaurant.isBlocked && (
                  <>
                    <button
                      onClick={() => approve(restaurant.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => reject(restaurant.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold border border-red-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {restaurant.isApproved && (
                  <button
                    onClick={() => toggleBlock(restaurant.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold ${
                      restaurant.isBlocked
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-red-50 text-red-500 border border-red-200"
                    }`}
                  >
                    <Ban className="w-4 h-4" />
                    {restaurant.isBlocked ? "Unblock" : "Block"}
                  </button>
                )}
                {restaurant.isBlocked && (
                  <button
                    onClick={() => toggleBlock(restaurant.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Unblock
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
