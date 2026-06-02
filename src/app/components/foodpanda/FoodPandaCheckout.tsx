import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, MapPin, Phone, Banknote, CreditCard, QrCode,
  Check, ChevronRight, Tag, Clock, Calendar, Gift, Zap
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLoyalty } from "../../context/LoyaltyContext";
import { useToast } from "../../context/ToastContext";

const PINK = "#D70F64";
type PM = "cod" | "aba" | "khqr";
type DeliveryType = "asap" | "scheduled";

const PROMOS = [
  { code: "PANDA20", desc: "20% off (min $10)", discount: 20, type: "percent" as const, min: 10 },
  { code: "FREEDEL", desc: "Free delivery", discount: 1.5, type: "fixed" as const, min: 5 },
  { code: "KHMER15", desc: "15% off Khmer food", discount: 15, type: "percent" as const, min: 8 },
];

const TIME_SLOTS = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
];

const DATES = [
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "Jun 5", value: "jun5" },
];

export function FoodPandaCheckout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, restaurantId } = useCart();
  const { points, redeemPoints, earnPoints, pointsToDiscount } = useLoyalty();
  const { showToast } = useToast();

  const [pm, setPm] = useState<PM>("cod");
  const [placing, setPlacing] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("asap");
  const [scheduleDate, setScheduleDate] = useState("today");
  const [scheduleTime, setScheduleTime] = useState("12:00 PM");

  // Promo
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<typeof PROMOS[0] | null>(null);
  const [promoError, setPromoError] = useState("");

  // Loyalty points
  const [usePoints, setUsePoints] = useState(false);
  const MAX_REDEEM = Math.min(points, 500); // max redeem per order
  const [redeemAmt, setRedeemAmt] = useState(0);
  const pointsDiscount = usePoints ? pointsToDiscount(redeemAmt) : 0;

  // Calculations
  const fee = 1.50;
  const promoDisc = applied
    ? applied.type === "percent" ? (totalPrice * applied.discount) / 100 : applied.discount
    : 0;
  const subtotalAfterPromo = totalPrice + fee - promoDisc;
  const vat = +(subtotalAfterPromo * 0.1).toFixed(2);
  const total = +(subtotalAfterPromo + vat - pointsDiscount).toFixed(2);

  const applyPromo = () => {
    const p = PROMOS.find((x) => x.code === coupon.trim().toUpperCase());
    if (!p) { setPromoError("Invalid promo code"); setApplied(null); return; }
    if (totalPrice < p.min) { setPromoError(`Min order $${p.min} required`); setApplied(null); return; }
    setApplied(p); setPromoError("");
    showToast(`Promo ${p.code} applied! 🎉`, "success");
  };

  const place = () => {
    setPlacing(true);
    if (usePoints && redeemAmt > 0) redeemPoints(redeemAmt);
    const orderRestaurant = items[0]?.restaurantName ?? "Restaurant";
    const orderId = "ORD-" + Date.now();
    earnPoints(totalPrice, orderId, orderRestaurant);
    setTimeout(() => {
      clearCart();
      navigate("/food/tracking");
    }, 1600);
  };

  const methods = [
    { id: "cod" as PM, label: "Cash on Delivery", desc: "Pay when your order arrives", Icon: Banknote },
    { id: "aba" as PM, label: "ABA Pay", desc: "Pay securely with ABA Mobile", Icon: CreditCard },
    { id: "khqr" as PM, label: "KHQR", desc: "Scan & pay with any Cambodian bank", Icon: QrCode },
  ];

  return (
    <div style={{ backgroundColor: "#f8f8f8" }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </button>
        <h1 className="text-2xl font-black text-gray-900 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 space-y-4">

            {/* ── Delivery Address ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: PINK }} />
                <span className="font-bold text-gray-900">Delivery Address</span>
              </div>
              <textarea defaultValue="House 12, Street 271, BKK1, Phnom Penh" rows={2}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none border border-transparent focus:border-pink-300 transition-all" />
              <div className="flex gap-2 mt-3 flex-wrap">
                {["Home 🏠", "Office 🏢", "Hotel 🏨", "Other 📍"].map((l) => (
                  <button key={l} className="text-xs border border-gray-200 rounded-full px-3 py-1.5 font-medium text-gray-600 hover:border-pink-400 hover:text-pink-600 transition-colors">{l}</button>
                ))}
              </div>
            </div>

            {/* ── Phone ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-4 h-4" style={{ color: PINK }} />
                <span className="font-bold text-gray-900">Phone Number</span>
              </div>
              <input type="tel" defaultValue="012 345 678"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-transparent focus:border-pink-300 transition-all" />
            </div>

            {/* ── Schedule Delivery ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4" style={{ color: PINK }} />
                <span className="font-bold text-gray-900">Delivery Time</span>
              </div>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setDeliveryType("asap")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all"
                  style={deliveryType === "asap"
                    ? { borderColor: PINK, backgroundColor: "#fff0f6", color: PINK }
                    : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                  <Zap className="w-4 h-4" /> ASAP (35 min)
                </button>
                <button onClick={() => setDeliveryType("scheduled")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all"
                  style={deliveryType === "scheduled"
                    ? { borderColor: PINK, backgroundColor: "#fff0f6", color: PINK }
                    : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                  <Clock className="w-4 h-4" /> Schedule
                </button>
              </div>

              {deliveryType === "scheduled" && (
                <div className="space-y-3 animate-fade-in">
                  {/* Date selector */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Select Date</label>
                    <div className="flex gap-2">
                      {DATES.map((d) => (
                        <button key={d.value} onClick={() => setScheduleDate(d.value)}
                          className="flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                          style={scheduleDate === d.value
                            ? { borderColor: PINK, backgroundColor: "#fff0f6", color: PINK }
                            : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Time selector */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Select Time</label>
                    <div className="grid grid-cols-5 gap-2">
                      {TIME_SLOTS.map((t) => (
                        <button key={t} onClick={() => setScheduleTime(t)}
                          className="py-2 rounded-xl border-2 text-xs font-bold transition-all"
                          style={scheduleTime === t
                            ? { borderColor: PINK, backgroundColor: "#fff0f6", color: PINK }
                            : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                    <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-blue-700 font-semibold">
                      Your order will arrive on {DATES.find(d => d.value === scheduleDate)?.label} at <span className="font-black">{scheduleTime}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Payment ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4" style={{ color: PINK }} />
                <span className="font-bold text-gray-900">Payment Method</span>
              </div>
              <div className="space-y-2.5">
                {methods.map(({ id, label, desc, Icon }) => (
                  <button key={id} onClick={() => setPm(id)}
                    className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 transition-all text-left"
                    style={pm === id ? { borderColor: PINK, backgroundColor: "#fff0f6" } : { borderColor: "#e5e7eb", backgroundColor: "#fafafa" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: pm === id ? PINK : "#f3f4f6" }}>
                      <Icon className={`w-5 h-5 ${pm === id ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm" style={pm === id ? { color: PINK } : { color: "#111827" }}>{label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={pm === id ? { borderColor: PINK, backgroundColor: PINK } : { borderColor: "#d1d5db" }}>
                      {pm === id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
              {pm === "khqr" && (
                <div className="mt-4 p-5 bg-gray-50 rounded-xl flex flex-col items-center gap-3 border border-gray-200">
                  <div className="w-36 h-36 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-800" />
                  </div>
                  <p className="text-xs text-gray-500 text-center">Scan with ABA, Wing, ACLEDA, or any Cambodian bank app</p>
                </div>
              )}
            </div>

            {/* ── Promo Code ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4" style={{ color: PINK }} />
                <span className="font-bold text-gray-900">Promo Code</span>
              </div>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Enter promo code" value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setPromoError(""); }}
                  className="flex-1 h-10 bg-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                <button onClick={applyPromo} className="px-5 h-10 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: PINK }}>Apply</button>
              </div>
              {promoError && <p className="text-red-500 text-xs mb-2">{promoError}</p>}
              {applied && <p className="text-green-600 text-xs font-semibold mb-2">✓ {applied.desc} applied!</p>}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-gray-400">Try:</span>
                {PROMOS.map((p) => (
                  <button key={p.code} onClick={() => { setCoupon(p.code); setPromoError(""); }}
                    className="text-xs font-bold border rounded-full px-2.5 py-1 transition-colors hover:bg-pink-50"
                    style={{ borderColor: PINK, color: PINK }}>{p.code}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Loyalty Points Redemption ── */}
            {points > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4" style={{ color: PINK }} />
                    <span className="font-bold text-gray-900">Reward Points</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: PINK }}>
                      {points} pts
                    </span>
                  </div>
                  <button onClick={() => setUsePoints(!usePoints)}
                    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                    style={{ backgroundColor: usePoints ? PINK : "#e5e7eb" }}>
                    <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                      style={{ left: usePoints ? "calc(100% - 1.375rem)" : "0.125rem" }} />
                  </button>
                </div>
                {usePoints && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Use up to {MAX_REDEEM} points on this order</p>
                    <input type="range" min={0} max={MAX_REDEEM} step={10} value={redeemAmt}
                      onChange={(e) => setRedeemAmt(parseInt(e.target.value))}
                      className="w-full accent-pink-600" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Redeeming <span className="font-bold">{redeemAmt} pts</span></span>
                      <span className="font-bold" style={{ color: "#198754" }}>−${pointsDiscount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Order Note ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <span className="font-bold text-gray-900 block mb-3">Order Note <span className="font-normal text-gray-400 text-sm">(optional)</span></span>
              <textarea placeholder="e.g. No MSG, extra spicy, ring doorbell twice..." rows={3}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none border border-transparent focus:border-pink-300 transition-all" />
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <div className="px-5 py-3.5 border-b border-gray-50" style={{ backgroundColor: "#fff0f6" }}>
                <span className="font-bold text-gray-900 text-sm">Order Summary</span>
              </div>
              <div className="p-5 space-y-1.5 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span className="line-clamp-1 flex-1 pr-2">{item.name} × {item.qty}</span>
                    <span className="flex-shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-500 mt-1"><span>Delivery fee</span><span>${fee.toFixed(2)}</span></div>
                  {promoDisc > 0 && (
                    <div className="flex justify-between mt-1 font-semibold" style={{ color: "#198754" }}>
                      <span>Promo ({applied?.code})</span><span>−${promoDisc.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 mt-1">
                    <span>VAT (10%)</span><span>${vat.toFixed(2)}</span>
                  </div>
                  {pointsDiscount > 0 && (
                    <div className="flex justify-between mt-1 font-semibold" style={{ color: PINK }}>
                      <span>Points ({redeemAmt} pts)</span><span>−${pointsDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-black text-gray-900 text-base">
                  <span>Total</span><span style={{ color: PINK }}>${total.toFixed(2)}</span>
                </div>
                {deliveryType === "scheduled" && (
                  <div className="flex items-center gap-1.5 mt-1 p-2 bg-blue-50 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-blue-700 font-semibold">
                      Arrives {DATES.find(d => d.value === scheduleDate)?.label} · {scheduleTime}
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">* Includes 10% VAT</p>
              </div>
              <div className="px-5 pb-5">
                <button onClick={place} disabled={placing}
                  className="w-full py-3.5 rounded-xl font-black text-white flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
                  style={{ backgroundColor: PINK }}>
                  {placing
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Placing...</>
                    : <>Place Order — ${total.toFixed(2)}<ChevronRight className="w-4 h-4" /></>
                  }
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                  By placing your order you agree to our <span className="underline cursor-pointer">Terms & Conditions</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
