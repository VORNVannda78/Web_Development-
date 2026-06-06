import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bike,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  ShoppingBag,
  Star,
  Store,
  ThumbsUp,
  Utensils,
} from "lucide-react";

const PINK = "#D70F64";

const trackingSteps = [
  { key: "restaurant", label: "Restaurant", sub: "Preparing now", icon: Store, state: "done" },
  { key: "rider", label: "Rider", sub: "Heading to pickup", icon: Bike, state: "active" },
  { key: "home", label: "Home", sub: "8:50 - 9:00 PM", icon: Home, state: "todo" },
];

const waitOffers = [
  {
    title: "Iced Passion Tea",
    merchant: "Brown Coffee",
    price: "$1.80",
    accent: "#0f766e",
  },
  {
    title: "Mango Sticky Rice",
    merchant: "Sweet Corner",
    price: "$2.50",
    accent: "#9333ea",
  },
];

export function FoodPandaTracking() {
  const navigate = useNavigate();
  const [upsellSeconds, setUpsellSeconds] = useState(260);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setUpsellSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const minutes = Math.floor(upsellSeconds / 60).toString().padStart(2, "0");
  const seconds = (upsellSeconds % 60).toString().padStart(2, "0");

  return (
    <div style={{ backgroundColor: "#f8f8f8" }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div
          className="rounded-2xl p-6 mb-5 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${PINK} 0%, #ff5ca0 100%)` }}
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/15 flex items-center justify-center">
            <ThumbsUp className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black">Order Confirmed!</h1>
          <p className="text-white/80 text-sm mt-1">
            Order <span className="font-bold">#ORD-2026-001</span> is on its way
          </p>
        </div>

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
          <div className="min-w-0">
            <div className="text-xs text-gray-400 mb-0.5">Estimated arrival</div>
            <div className="text-3xl font-black text-gray-900 leading-tight">
              8:50 - 9:00 <span className="text-base font-semibold text-gray-500">PM</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Rider pickup in progress</div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 mb-4"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-gray-900">Order Status</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "#ffe0ed", color: PINK }}>
              Preparing
            </span>
          </div>

          <div className="relative px-1">
            <div className="absolute left-10 right-10 top-5 h-1.5 rounded-full bg-gray-100" />
            <div
              className="absolute left-10 top-5 h-1.5 w-[50%] max-w-[calc(100%-5rem)] rounded-full"
              style={{ backgroundColor: PINK }}
            />
            <div className="relative grid grid-cols-3 gap-2">
              {trackingSteps.map((step) => {
                const Icon = step.icon;
                const isDone = step.state === "done";
                const isActive = step.state === "active";

                return (
                  <div key={step.key} className="min-w-0 text-center">
                    <div
                      className="w-11 h-11 mx-auto rounded-full flex items-center justify-center border-4 border-white"
                      style={
                        isActive
                          ? { backgroundColor: PINK, boxShadow: `0 0 0 5px #ffe0ed` }
                          : isDone
                          ? { backgroundColor: "#198754" }
                          : { backgroundColor: "#f3f4f6" }
                      }
                    >
                      <Icon className={`w-5 h-5 ${isDone || isActive ? "text-white" : "text-gray-300"}`} />
                    </div>
                    <div
                      className="mt-3 text-sm font-bold truncate"
                      style={isActive ? { color: PINK } : isDone ? { color: "#111827" } : { color: "#9ca3af" }}
                    >
                      {step.label}
                    </div>
                    <div className={`text-xs mt-1 leading-tight ${isDone || isActive ? "text-gray-400" : "text-gray-300"}`}>
                      {step.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 mb-4"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
        >
          <h3 className="font-bold text-gray-900 text-sm mb-3">Your rider</h3>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
              style={{ backgroundColor: PINK }}
            >
              DS
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900">Dara Sok</div>
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-xs text-gray-400 ml-1 truncate">4.8 - 342 deliveries</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 truncate">Honda Wave 100 - PV-1T-0050</div>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm flex-shrink-0 border"
              style={{ borderColor: "#f5b4cf", color: PINK, backgroundColor: "#fff5f9" }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-white text-sm flex-shrink-0"
              style={{ backgroundColor: PINK }}
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </button>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl border border-gray-100 p-4 mb-4"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: PINK }} />
            <span>House 12, Street 271, BKK1, Phnom Penh</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-4 text-white" style={{ background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-black text-sm">Grab More, save on delivery</div>
              <div className="text-xs text-white/80 mt-0.5">Add drinks or dessert before Dara leaves the restaurant.</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-black text-lg tabular-nums">{minutes}:{seconds}</div>
              <div className="text-[10px] font-semibold uppercase text-white/75">left</div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-gray-900 text-sm">Check this out while you wait</h3>
            <span className="text-xs font-bold" style={{ color: PINK }}>Sponsored</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {waitOffers.map((offer) => (
              <button
                key={offer.title}
                className="bg-white rounded-2xl border border-gray-100 p-3 text-left hover:border-pink-200 transition-colors"
                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
              >
                <div className="h-16 rounded-xl mb-3 flex items-center justify-center text-white" style={{ backgroundColor: offer.accent }}>
                  <Utensils className="w-6 h-6" />
                </div>
                <div className="font-bold text-gray-900 text-sm truncate">{offer.title}</div>
                <div className="text-xs text-gray-400 mt-0.5 truncate">{offer.merchant}</div>
                <div className="text-xs font-black mt-2" style={{ color: PINK }}>
                  {offer.price}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => navigate("/food/invoice/ORD-2026-001")}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-gray-200 bg-white text-xs font-bold text-gray-600 hover:border-pink-300 hover:text-pink-600 transition-all"
          >
            <ReceiptText className="w-5 h-5" />
            Invoice
          </button>
          <button
            onClick={() => navigate("/food/review/ORD-2026-001")}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold text-white transition-all"
            style={{ backgroundColor: PINK, borderColor: PINK }}
          >
            <Star className="w-5 h-5 fill-white" />
            Rate Order
          </button>
          <button
            onClick={() => navigate("/food/orders")}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-gray-200 bg-white text-xs font-bold text-gray-600 hover:border-pink-300 hover:text-pink-600 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
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
