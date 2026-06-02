import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Star, Clock, Heart, Share2, Search,
  Plus, Minus, ShoppingCart, ChevronRight, Info
} from "lucide-react";
import { fpRestaurants } from "../../data/foodpandaData";
import { foods } from "../../data/mockData";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useToast } from "../../context/ToastContext";

const PINK = "#D70F64";

const sections = [
  { id: "bestsellers", title: "🔥 Best Sellers" },
  { id: "mains", title: "Main Dishes" },
  { id: "sides", title: "Sides & Extras" },
  { id: "drinks", title: "Drinks" },
];

export function FoodPandaRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addItem, updateQty, totalItems, totalPrice, restaurantId } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState("bestsellers");
  const [menuSearch, setMenuSearch] = useState("");

  const r = fpRestaurants.find((x) => x.id === id) ?? fpRestaurants[0];
  const liked = isFavorited(r.id);
  const allFoods = foods.slice(0, 7);
  const displayedFoods = menuSearch
    ? allFoods.filter((f) => f.name.toLowerCase().includes(menuSearch.toLowerCase()))
    : allFoods;

  // Cart items for THIS restaurant only (for sidebar display)
  const myCartItems = items.filter((i) => i.restaurantId === r.id);
  const myTotal = myCartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const myQty = myCartItems.reduce((s, i) => s + i.qty, 0);

  const getQty = (fid: string) => myCartItems.find((i) => i.id === fid)?.qty ?? 0;

  const handleAdd = (food: typeof allFoods[0]) => {
    // Warn if switching restaurant
    if (restaurantId && restaurantId !== r.id) {
      if (!window.confirm(`Your cart has items from another restaurant. Start a new cart from ${r.name}?`)) return;
    }
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      restaurantId: r.id,
      restaurantName: r.name,
    });
    showToast(`${food.name} added to cart 🛒`, "success");
  };

  const handleToggleFav = () => {
    toggleFavorite(r.id);
    showToast(
      liked ? `Removed ${r.name} from saved` : `${r.name} saved! ❤️`,
      liked ? "info" : "success"
    );
  };

  return (
    <div style={{ backgroundColor: "#f8f8f8" }}>
      {/* ── Hero image ── */}
      <div className="relative h-52 md:h-64 overflow-hidden bg-gray-200">
        <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate("/food")} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleToggleFav}
              className="bg-white rounded-full p-2 shadow-md transition-all hover:scale-110"
              style={liked ? { color: PINK } : { color: "#9ca3af" }}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            </button>
            <button className="bg-white rounded-full p-2 shadow-md text-gray-500 hover:text-gray-700">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Restaurant Info Card ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-1">{r.name}</h1>
              <p className="text-sm text-gray-500 mb-3">{r.cuisines.join(" · ")}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded text-white text-xs font-bold"
                    style={{ backgroundColor: r.rating >= 4.5 ? "#198754" : "#5cb85c" }}>
                    <Star className="w-3 h-3 fill-white" />
                    {r.rating.toFixed(1)}
                  </div>
                  <span className="text-gray-400 text-xs">{r.reviewCount.toLocaleString()}+ ratings</span>
                </div>
                <span className="text-gray-200">|</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{r.deliveryTime} min</span>
                </div>
                <span className="text-gray-200">|</span>
                <span className="text-gray-600">
                  {r.deliveryFee === 0
                    ? <span className="font-semibold text-green-600">Free delivery</span>
                    : `$${r.deliveryFee.toFixed(2)} delivery`}
                </span>
                <span className="text-gray-200">|</span>
                <span className="text-gray-500">Min. ${r.minOrder}</span>
              </div>
              {(r.badge || r.isNew) && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {r.badge && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: r.badge.color }}>
                      {r.badge.text}
                    </span>
                  )}
                  {r.isNew && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#e8f5e9", color: "#198754" }}>
                      New on EatZone
                    </span>
                  )}
                  {r.isOpen && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#e8f5e9", color: "#198754" }}>
                      ● Open
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <div className="flex rounded-xl border-2 overflow-hidden" style={{ borderColor: PINK }}>
                <button className="px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: PINK }}>Delivery</button>
                <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-pink-50">Pick up</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section tabs ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto no-scrollbar">
            {sections.map((sec) => (
              <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                className="flex-shrink-0 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap"
                style={activeSection === sec.id
                  ? { borderColor: PINK, color: PINK }
                  : { borderColor: "transparent", color: "#6b7280" }
                }>
                {sec.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Menu + Cart ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">

          {/* Menu list */}
          <div className="flex-1 min-w-0">
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search menu items..." value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 transition-colors" />
            </div>

            <div className="space-y-3">
              {displayedFoods.map((food) => {
                const qty = getQty(food.id);
                return (
                  <div key={food.id}
                    className="bg-white rounded-2xl flex gap-0 overflow-hidden border border-gray-100 hover:border-pink-200 hover:shadow-sm transition-all"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div className="flex-1 p-4">
                      <div className="font-bold text-gray-900 text-sm mb-0.5">{food.name}</div>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-2 leading-relaxed">{food.description}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-400">{food.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-gray-900">${food.price.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          {qty > 0 && (
                            <>
                              <button onClick={() => updateQty(food.id, -1)}
                                className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors hover:bg-pink-50"
                                style={{ borderColor: PINK, color: PINK }}>
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center font-black text-gray-900 text-sm">{qty}</span>
                            </>
                          )}
                          <button onClick={() => handleAdd(food)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-85"
                            style={{ backgroundColor: PINK }}>
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 w-28 h-28 self-center mr-3 rounded-xl overflow-hidden">
                      <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Cart sidebar (desktop) ── */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <div className="px-4 py-3.5 flex items-center gap-2 border-b border-gray-100" style={{ backgroundColor: "#fff0f6" }}>
                  <ShoppingCart className="w-4 h-4 flex-shrink-0" style={{ color: PINK }} />
                  <span className="font-bold text-gray-900 text-sm">Your order from {r.name}</span>
                  {totalItems > 0 && (
                    <span className="ml-auto text-xs font-black text-white rounded-full w-5 h-5 flex items-center justify-center"
                      style={{ backgroundColor: PINK }}>{totalItems}</span>
                  )}
                </div>

                {myCartItems.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <div className="text-4xl mb-3">🛒</div>
                    <p className="font-semibold text-gray-700 text-sm mb-1">Your cart is empty</p>
                    <p className="text-xs text-gray-400">Add items to start your order</p>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      {myCartItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-2">
                          <span className="text-xs font-bold text-gray-500 mt-0.5 w-4 flex-shrink-0">{item.qty}×</span>
                          <span className="text-sm text-gray-800 flex-1">{item.name}</span>
                          <span className="text-sm font-bold text-gray-900 flex-shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm mb-4">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span><span>${myTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Delivery fee</span>
                        <span>{r.deliveryFee === 0
                          ? <span className="text-green-600 font-semibold">Free</span>
                          : `$${r.deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-black text-gray-900 text-base pt-1.5 border-t border-gray-100">
                        <span>Total</span>
                        <span>${(myTotal + r.deliveryFee).toFixed(2)}</span>
                      </div>
                    </div>

                    {myTotal < r.minOrder && (
                      <div className="flex items-center gap-2 mb-3 p-2.5 bg-orange-50 rounded-xl">
                        <Info className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                        <p className="text-xs text-orange-700">Add ${(r.minOrder - myTotal).toFixed(2)} more to reach minimum</p>
                      </div>
                    )}

                    <button
                      onClick={() => navigate("/food/cart")}
                      disabled={myTotal < r.minOrder}
                      className="w-full py-3 rounded-xl font-black text-white text-sm flex items-center justify-between px-4 disabled:opacity-50 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: PINK }}
                    >
                      <span className="bg-white/20 rounded-lg px-2 py-0.5 text-xs">{myQty}</span>
                      <span>Go to checkout</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile cart bar ── */}
      {myQty > 0 && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 p-3 z-40">
          <button
            onClick={() => navigate("/food/cart")}
            className="w-full py-3.5 rounded-xl font-black text-white flex items-center justify-between px-5 shadow-2xl"
            style={{ backgroundColor: PINK }}
          >
            <span className="bg-white/20 rounded-lg px-2.5 py-0.5 text-sm">{myQty}</span>
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              View order
            </span>
            <span>${(myTotal + r.deliveryFee).toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
