import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Minus, Plus, Trash2, Tag, MapPin, ChevronRight, LogIn, Store, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

const PINK = "#D70F64";

const PROMOS = [
  { code: "PANDA20", desc: "20% off (min $10)", discount: 20, type: "percent" as const, min: 10 },
  { code: "FREEDEL", desc: "Free delivery", discount: 1.5, type: "fixed" as const, min: 5 },
  { code: "KHMER15", desc: "15% off Khmer food", discount: 15, type: "percent" as const, min: 8 },
];

export function FoodPandaCart() {
  const navigate = useNavigate();
  const { user, openAuthModal, deliveryMode } = useAuth();
  const { items, updateQty, removeItem, totalPrice, restaurantId } = useCart();
  const { showToast } = useToast();
  const isPickup = deliveryMode === "pickup";

  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<typeof PROMOS[0] | null>(null);
  const [error, setError] = useState("");

  const restaurantName = items[0]?.restaurantName ?? "";
  const fee = isPickup ? 0 : 1.5;
  const disc = applied
    ? applied.type === "percent" ? (totalPrice * applied.discount) / 100 : applied.discount
    : 0;
  const total = totalPrice + fee - disc;

  const apply = () => {
    const p = PROMOS.find((x) => x.code === coupon.trim().toUpperCase());
    if (!p) { setError("Invalid promo code"); setApplied(null); return; }
    if (totalPrice < p.min) { setError(`Min order $${p.min} required`); setApplied(null); return; }
    setApplied(p);
    setError("");
    showToast(`Promo ${p.code} applied! 🎉`, "success");
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    showToast(`${name} removed`, "info");
  };

  if (items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: "#fff0f6" }}>
        <ShoppingBag className="w-10 h-10" style={{ color: PINK }} />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6 text-sm">Browse restaurants and add items to start your order</p>
      <button onClick={() => navigate("/food")} className="px-8 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: PINK }}>
        Browse Restaurants
      </button>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f8f8f8" }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-black text-gray-900 mb-6">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left */}
          <div className="flex-1 space-y-4">

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">
                  {restaurantName} ({items.reduce((s, i) => s + i.qty, 0)} items)
                </span>
                <button onClick={() => navigate(`/food/restaurants/${restaurantId}`)}
                  className="text-xs font-bold hover:underline" style={{ color: PINK }}>
                  + Add more
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                      <div className="font-bold text-gray-900 mt-1 text-sm">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors hover:bg-pink-50"
                        style={{ borderColor: PINK, color: PINK }}>
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-black text-gray-900 text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                        style={{ backgroundColor: PINK }}>
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleRemove(item.id, item.name)}
                        className="ml-1 text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4" style={{ color: PINK }} />
                <span className="font-bold text-gray-900 text-sm">Promo Code</span>
              </div>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Enter promo code" value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setError(""); }}
                  className="flex-1 h-10 bg-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                <button onClick={apply} className="px-5 h-10 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: PINK }}>Apply</button>
              </div>
              {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
              {applied && <p className="text-green-600 text-xs font-semibold mb-2">✓ {applied.desc} applied!</p>}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-gray-400 mr-1">Try:</span>
                {PROMOS.map((p) => (
                  <button key={p.code} onClick={() => { setCoupon(p.code); setError(""); }}
                    className="text-xs font-bold border rounded-full px-2.5 py-1 transition-colors hover:bg-pink-50"
                    style={{ borderColor: PINK, color: PINK }}>
                    {p.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery address / Pickup */}
            {isPickup ? (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-900 text-sm">Pick Up Location</span>
                  <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Free</span>
                </div>
                <div className="text-sm font-semibold text-blue-900">{restaurantName}</div>
                <div className="text-xs text-blue-600 mt-0.5">Street 178, Daun Penh, Phnom Penh</div>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-700 bg-blue-100 rounded-xl px-3 py-2">
                  <span>⏱️</span>
                  <span>Ready in <span className="font-bold">15–20 min</span></span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4" style={{ color: PINK }} />
                  <span className="font-bold text-gray-900 text-sm">Deliver to</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">House 12, Street 271, BKK1</div>
                    <div className="text-xs text-gray-400 mt-0.5">Phnom Penh, Cambodia</div>
                  </div>
                  <button className="text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-colors hover:bg-pink-50"
                    style={{ borderColor: PINK, color: PINK }}>Change</button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <div className="px-5 py-3.5 border-b border-gray-50" style={{ backgroundColor: "#fff0f6" }}>
                <span className="font-bold text-gray-900 text-sm">Order Summary</span>
              </div>
              <div className="p-5 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery fee</span>
                  {isPickup ? (
                    <span className="flex items-center gap-1 font-semibold" style={{ color: "#198754" }}>
                      <span className="line-through text-gray-400 font-normal">$1.50</span> FREE
                    </span>
                  ) : (
                    <span>${fee.toFixed(2)}</span>
                  )}
                </div>
                {disc > 0 && (
                  <div className="flex justify-between font-semibold" style={{ color: "#198754" }}>
                    <span>Discount ({applied?.code})</span>
                    <span>−${disc.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="px-5 pb-5 space-y-2">
                <button
                  onClick={() => {
                    if (user) navigate("/food/checkout");
                    else openAuthModal(() => navigate("/food/checkout"));
                  }}
                  className="w-full py-3 rounded-xl font-black text-white flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: PINK }}
                >
                  {!user && <LogIn className="w-4 h-4" />}
                  {user ? "Checkout" : "Log in to Checkout"}
                  {user && <ChevronRight className="w-4 h-4" />}
                </button>
                {!user && (
                  <p className="text-center text-xs text-gray-400">
                    You need to log in before placing an order
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
