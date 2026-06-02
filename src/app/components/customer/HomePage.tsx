import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Star, Clock, ChevronRight, Flame, Tag, MapPin } from "lucide-react";
import { restaurants, foods, promotions } from "../../data/mockData";

const categories = [
  { name: "All", emoji: "🍽️" },
  { name: "Khmer Food", emoji: "🍛" },
  { name: "Fast Food", emoji: "🍔" },
  { name: "Noodles", emoji: "🍜" },
  { name: "BBQ", emoji: "🥩" },
  { name: "Drinks", emoji: "🧃" },
  { name: "Dessert", emoji: "🍰" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFoods = foods.slice(0, 4);

  return (
    <div className="pb-4">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-3 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search food or restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      </div>

      {/* Promotions Banner */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-medium opacity-90">LIMITED OFFER</span>
            </div>
            <div className="text-lg font-black mb-1">Get 20% OFF</div>
            <div className="text-xs opacity-80">Use code: <span className="font-bold">NHAM20</span></div>
          </div>
          <div className="text-5xl">🎉</div>
        </div>
      </div>

      {/* Promo Codes */}
      <div className="px-4 mb-5">
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {promotions.map((promo) => (
            <div key={promo.id} className="flex-shrink-0 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
              <div className="text-xs font-bold text-orange-600">{promo.code}</div>
              <div className="text-xs text-gray-500 mt-0.5">{promo.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.name
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Foods */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="font-bold text-gray-900">Popular Foods</span>
          </div>
          <button className="text-xs text-red-500 font-medium flex items-center gap-1">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {popularFoods.map((food) => (
            <button
              key={food.id}
              onClick={() => navigate(`/customer/restaurants/${food.restaurantId}`)}
              className="flex-shrink-0 w-40 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
            >
              <img src={food.image} alt={food.name} className="w-full h-24 object-cover" />
              <div className="p-2.5">
                <div className="text-sm font-semibold text-gray-900 truncate">{food.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-red-500 font-bold text-sm">${food.price.toFixed(2)}</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{food.rating}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Restaurants */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="font-bold text-gray-900">
              {selectedCategory === "All" ? "Nearby Restaurants" : selectedCategory}
            </span>
          </div>
          <span className="text-xs text-gray-500">{filteredRestaurants.length} found</span>
        </div>
        <div className="space-y-4">
          {filteredRestaurants.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() => navigate(`/customer/restaurants/${restaurant.id}`)}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-44 object-cover" />
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-700 rounded-full px-4 py-1.5 font-bold text-sm">Closed</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700">
                  {restaurant.category}
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-gray-900">{restaurant.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{restaurant.address}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-gray-700">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <span>•</span>
                  <span>Delivery: ${restaurant.deliveryFee.toFixed(2)}</span>
                  <span>•</span>
                  <span>Min: ${restaurant.minOrder}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
