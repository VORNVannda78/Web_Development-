import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Star, Clock, MapPin, Phone, Plus, Minus, ShoppingCart, ChevronDown } from "lucide-react";
import { restaurants, foods, type Food, type Addon } from "../../data/mockData";

interface CartItem {
  food: Food;
  quantity: number;
  selectedAddons: Addon[];
}

export function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [activeTab, setActiveTab] = useState("Menu");

  const restaurant = restaurants.find((r) => r.id === id);
  const restaurantFoods = foods.filter((f) => f.restaurantId === id);

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Restaurant not found
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, item) => {
    const addonTotal = item.selectedAddons.reduce((a, ad) => a + ad.price, 0);
    return sum + (item.food.price + addonTotal) * item.quantity;
  }, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (food: Food) => {
    setSelectedFood(food);
    setSelectedAddons([]);
  };

  const confirmAddToCart = () => {
    if (!selectedFood) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === selectedFood.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === selectedFood.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { food: selectedFood, quantity: 1, selectedAddons }];
    });
    setSelectedFood(null);
  };

  const updateQuantity = (foodId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.food.id === foodId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getItemQuantity = (foodId: string) =>
    cart.find((item) => item.food.id === foodId)?.quantity || 0;

  const reviews = [
    { name: "Sophea M.", rating: 5, text: "Amazing food! Will order again.", date: "2 days ago" },
    { name: "Borey C.", rating: 4, text: "Good taste, delivery was a bit slow.", date: "1 week ago" },
    { name: "Dara K.", rating: 5, text: "Best Amok Fish in Phnom Penh!", date: "2 weeks ago" },
  ];

  return (
    <div className="pb-24">
      {/* Hero Image */}
      <div className="relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-52 object-cover" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
          restaurant.isOpen ? "bg-green-500 text-white" : "bg-gray-500 text-white"
        }`}>
          {restaurant.isOpen ? "Open" : "Closed"}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm">
        <h1 className="text-xl font-black text-gray-900">{restaurant.name}</h1>
        <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>{restaurant.address}</span>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-800">{restaurant.rating}</span>
            <span className="text-gray-400 text-xs">({restaurant.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="text-gray-600 text-sm">
            Delivery: <span className="font-semibold">${restaurant.deliveryFee}</span>
          </div>
          <div className="text-gray-600 text-sm">
            Min: <span className="font-semibold">${restaurant.minOrder}</span>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <Phone className="w-3.5 h-3.5" />
          <span>{restaurant.phone}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
        <div className="flex">
          {["Menu", "Reviews", "Info"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Tab */}
      {activeTab === "Menu" && (
        <div className="px-4 pt-4 space-y-3">
          {restaurantFoods.map((food) => {
            const qty = getItemQuantity(food.id);
            return (
              <div key={food.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex">
                <img src={food.image} alt={food.name} className="w-28 h-28 object-cover" />
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{food.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{food.description}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">{food.rating}</span>
                      {food.addons && food.addons.length > 0 && (
                        <span className="text-xs text-orange-500 ml-1">+ Add-ons</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-red-500 font-bold">${food.price.toFixed(2)}</span>
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(food)}
                        className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(food.id, -1)}
                          className="bg-gray-100 rounded-full p-1"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{qty}</span>
                        <button
                          onClick={() => updateQuantity(food.id, 1)}
                          className="bg-red-500 text-white rounded-full p-1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "Reviews" && (
        <div className="px-4 pt-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-6 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="text-5xl font-black text-gray-900">{restaurant.rating}</div>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(restaurant.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-1">{restaurant.reviews} reviews</div>
            </div>
            <div className="flex-1 space-y-1">
              {[5,4,3,2,1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{star}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {reviews.map((review, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <span className="font-semibold text-sm text-gray-800">{review.name}</span>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
              <p className="text-sm text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Info Tab */}
      {activeTab === "Info" && (
        <div className="px-4 pt-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-xs text-gray-400">Address</div>
                <div className="text-sm font-medium text-gray-800">{restaurant.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-xs text-gray-400">Phone</div>
                <div className="text-sm font-medium text-gray-800">{restaurant.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-xs text-gray-400">Delivery Time</div>
                <div className="text-sm font-medium text-gray-800">{restaurant.deliveryTime}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
          <button
            onClick={() => navigate("/customer/cart")}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl py-4 flex items-center justify-between px-5 shadow-2xl"
          >
            <div className="bg-white/20 rounded-xl px-2 py-0.5 text-sm font-bold">{cartCount}</div>
            <div className="flex items-center gap-2 font-bold">
              <ShoppingCart className="w-5 h-5" />
              <span>View Cart</span>
            </div>
            <div className="font-bold">${cartTotal.toFixed(2)}</div>
          </button>
        </div>
      )}

      {/* Addon Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedFood(null)}>
          <div
            className="bg-white w-full max-w-2xl mx-auto rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg text-gray-900">{selectedFood.name}</h3>
              <span className="text-red-500 font-bold">${selectedFood.price.toFixed(2)}</span>
            </div>
            {selectedFood.addons && selectedFood.addons.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Add-ons (Optional)</p>
                <div className="space-y-2">
                  {selectedFood.addons.map((addon) => (
                    <label key={addon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddons.some((a) => a.id === addon.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAddons((prev) => [...prev, addon]);
                            } else {
                              setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id));
                            }
                          }}
                          className="w-4 h-4 accent-red-500"
                        />
                        <span className="text-sm text-gray-700">{addon.name}</span>
                      </div>
                      <span className="text-sm text-orange-500 font-medium">+${addon.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={confirmAddToCart}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-bold text-base"
            >
              Add to Cart — ${(selectedFood.price + selectedAddons.reduce((s, a) => s + a.price, 0)).toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
