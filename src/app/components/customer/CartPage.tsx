import { useState } from "react";
import { useNavigate } from "react-router";
import { Minus, Plus, Trash2, Tag, ShoppingCart, ChevronRight } from "lucide-react";
import { foods, restaurants, promotions } from "../../data/mockData";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantName: string;
}

const initialCart: CartItem[] = [
  { id: "f1", name: "Amok Fish", price: 6.5, quantity: 1, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop", restaurantName: "Malis Restaurant" },
  { id: "f4", name: "Crispy Chicken Burger", price: 5.5, quantity: 2, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop", restaurantName: "KFC Cambodia" },
];

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [couponCode, setCouponCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<typeof promotions[0] | null>(null);
  const [couponError, setCouponError] = useState("");

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const remove = (id: string) => setCart((prev) => prev.filter((item) => item.id !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 1.5;
  const discount = appliedPromo
    ? appliedPromo.type === "percent"
      ? (subtotal * appliedPromo.discount) / 100
      : appliedPromo.discount
    : 0;
  const total = subtotal + deliveryFee - discount;

  const applyPromo = () => {
    const promo = promotions.find((p) => p.code === couponCode.toUpperCase());
    if (!promo) {
      setCouponError("Invalid coupon code");
      setAppliedPromo(null);
    } else if (subtotal < promo.minOrder) {
      setCouponError(`Minimum order $${promo.minOrder} required`);
      setAppliedPromo(null);
    } else {
      setAppliedPromo(promo);
      setCouponError("");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 px-8 text-center">
        <div className="text-6xl">🛒</div>
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 text-sm">Add some delicious food to get started!</p>
        <button
          onClick={() => navigate("/customer")}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-black text-gray-900 mb-4">Your Cart</h1>

        {/* Cart Items */}
        <div className="space-y-3 mb-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-100">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                <div className="text-xs text-gray-400 mb-2">{item.restaurantName}</div>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => remove(item.id)}
                className="self-start p-1.5 text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-gray-900 text-sm">Promo Code</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
              className="flex-1 bg-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button
              onClick={applyPromo}
              className="bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
          {appliedPromo && (
            <div className="mt-2 flex items-center gap-2 text-green-600 text-xs font-medium">
              <span>✓</span>
              <span>{appliedPromo.description} applied!</span>
            </div>
          )}
          {/* Quick apply codes */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {promotions.map((p) => (
              <button
                key={p.id}
                onClick={() => { setCouponCode(p.code); setCouponError(""); }}
                className="text-xs bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-2 py-1 font-medium"
              >
                {p.code}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-red-500">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
        <button
          onClick={() => navigate("/customer/checkout")}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl py-4 flex items-center justify-between px-5 shadow-2xl font-bold"
        >
          <span>{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
          <span className="flex items-center gap-2">
            Proceed to Checkout
            <ChevronRight className="w-5 h-5" />
          </span>
          <span>${total.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
}
