import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Star, Clock, Filter } from "lucide-react";
import { restaurants } from "../../data/mockData";

const categories = ["All", "Khmer Food", "Fast Food", "Noodles", "BBQ", "Drinks", "Dessert"];
const sortOptions = ["Recommended", "Rating", "Delivery Time", "Delivery Fee"];

export function RestaurantsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilter, setShowFilter] = useState(false);

  let filtered = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === "Rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === "Delivery Time") filtered = [...filtered].sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
  if (sortBy === "Delivery Fee") filtered = [...filtered].sort((a, b) => a.deliveryFee - b.deliveryFee);

  return (
    <div className="pb-4">
      {/* Search + Filter */}
      <div className="px-4 pt-4 pb-3 bg-white border-b border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`px-3 py-2.5 rounded-xl border flex items-center gap-1 text-sm font-medium ${
              showFilter ? "bg-red-50 border-red-300 text-red-600" : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {showFilter && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2">Sort by</p>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    sortBy === opt ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-4">
        <p className="text-xs text-gray-400 mb-3">{filtered.length} restaurants found</p>
        <div className="space-y-4">
          {filtered.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() => navigate(`/customer/restaurants/${restaurant.id}`)}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-44 object-cover"
                />
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-700 rounded-full px-4 py-1.5 font-bold text-sm">
                      Closed
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700">
                    {restaurant.category}
                  </div>
                  <div className="bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    {restaurant.rating}
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-gray-900">{restaurant.name}</div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <span>•</span>
                  <span>Delivery: ${restaurant.deliveryFee.toFixed(2)}</span>
                  <span>•</span>
                  <span>Min: ${restaurant.minOrder}</span>
                  <span>•</span>
                  <span>{restaurant.reviews} reviews</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
