import { useNavigate } from "react-router";
import { CheckCircle, ChefHat, Bike, Package, MapPin, Phone, Star, Clock } from "lucide-react";

const PINK = "#D70F64";

const steps = [
  { key: "placed", label: "Order placed", sub: "We've received your order", icon: Package, done: true },
  { key: "confirmed", label: "Restaurant confirmed", sub: "Malis Restaurant accepted", icon: CheckCircle, done: true },
  { key: "cooking", label: "Preparing your food", sub: "Your food is being cooked", icon: ChefHat, done: true },
  { key: "pickup", label: "Rider on the way", sub: "Dara is heading to the restaurant", icon: Bike, active: true, done: false },
  { key: "delivering", label: "Out for delivery", sub: "On the way to you", icon: Bike, done: false },
  { key: "delivered", label: "Delivered!", sub: "Enjoy your meal 🎉", icon: CheckCircle, done: false },
];

export function FoodPandaTracking() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#f8f8f8" }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Confirmed banner */}
        <div
          className="rounded-2xl p-6 mb-5 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${PINK} 0%, #ff5ca0 100%)` }}
        >
          <div className="text-4xl mb-2">🎉</div>
          <h1 className="text-xl font-black">Order Confirmed!</h1>
          <p className="text-white/80 text-sm mt-1">Order <span className="font-bold">#ORD-2026-001</span> is on its way</p>
        </div>

        {/* ETA card */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 flex items-center gap-5"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
            style={{ backgroundColor: PINK }}
          >
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-0.5">Estimated arrival</div>
            <div className="text-3xl font-black text-gray-900">35 <span className="text-base font-semibold text-gray-500">min</span></div>
            <div className="text-xs text-gray-400 mt-0.5">Arriving around 10:45 AM</div>
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <h3 className="font-black text-gray-900 mb-5">Order Status</h3>
          <div>
            {steps.map((step, i) => (
              <div key={step.key} className="flex gap-4">
                {/* Icon + line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={
                      (step as any).active
                        ? { backgroundColor: PINK, boxShadow: `0 0 0 5px #ffe0ed` }
                        : step.done
                        ? { backgroundColor: "#198754" }
                        : { backgroundColor: "#f3f4f6" }
                    }
                  >
                    <step.icon className={`w-4 h-4 ${step.done || (step as any).active ? "text-white" : "text-gray-300"}`} />
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-0.5 flex-1 my-1.5"
                      style={{ backgroundColor: step.done ? "#198754" : "#e5e7eb", minHeight: 24 }}
                    />
                  )}
                </div>
                {/* Text */}
                <div className="pb-5 pt-1 min-w-0">
                  <div
                    className="text-sm font-bold"
                    style={(step as any).active ? { color: PINK } : step.done ? { color: "#111827" } : { color: "#d1d5db" }}
                  >
                    {step.label}
                    {(step as any).active && (
                      <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: PINK }}>
                        Now
                      </span>
                    )}
                  </div>
                  <div className={`text-xs mt-0.5 ${step.done || (step as any).active ? "text-gray-400" : "text-gray-200"}`}>
                    {step.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rider card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <h3 className="font-bold text-gray-900 text-sm mb-3">Your rider</h3>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
              style={{ backgroundColor: PINK }}
            >
              DS
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900">Dara Sok</div>
              <div className="flex items-center gap-1 mt-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-xs text-gray-400 ml-1">4.8 · 342 deliveries</span>
              </div>
            </div>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white text-sm flex-shrink-0"
              style={{ backgroundColor: PINK }}
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </button>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: PINK }} />
            <span>House 12, Street 271, BKK1, Phnom Penh</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => navigate("/food/invoice/ORD-2026-001")}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-gray-200 bg-white text-xs font-bold text-gray-600 hover:border-pink-300 hover:text-pink-600 transition-all"
          >
            <span className="text-lg">🧾</span>
            Invoice
          </button>
          <button
            onClick={() => navigate("/food/review/ORD-2026-001")}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold text-white transition-all"
            style={{ backgroundColor: PINK, borderColor: PINK }}
          >
            <span className="text-lg">⭐</span>
            Rate Order
          </button>
          <button
            onClick={() => navigate("/food/orders")}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-gray-200 bg-white text-xs font-bold text-gray-600 hover:border-pink-300 hover:text-pink-600 transition-all"
          >
            <span className="text-lg">📋</span>
            My Orders
          </button>
        </div>

        <button
          onClick={() => navigate("/food")}
          className="w-full py-3.5 rounded-xl font-bold text-sm border-2 hover:bg-pink-50 transition-colors"
          style={{ borderColor: PINK, color: PINK }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
