import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Star, RotateCcw, FileText, AlertTriangle, Clock,
  CheckCircle, XCircle, ChevronDown, Gift
} from "lucide-react";
import { useLoyalty } from "../../context/LoyaltyContext";
import { useToast } from "../../context/ToastContext";

const PINK = "#D70F64";

type OrderStatus = "delivered" | "cancelled" | "processing";

interface HistoryOrder {
  id: string;
  orderId: string;
  restaurant: string;
  restaurantImage: string;
  items: string[];
  total: number;
  date: string;
  status: OrderStatus;
  pointsEarned: number;
  paymentMethod: string;
  reviewed: boolean;
}

const mockOrders: HistoryOrder[] = [
  {
    id: "1", orderId: "ORD-2026-001", restaurant: "Malis Restaurant",
    restaurantImage: "https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?w=80&h=80&fit=crop",
    items: ["Amok Fish", "Crispy Chicken Burger × 2"], total: 19.0,
    date: "June 2, 2026 · 10:12 AM", status: "delivered", pointsEarned: 190, paymentMethod: "ABA Pay", reviewed: false,
  },
  {
    id: "2", orderId: "ORD-2026-000", restaurant: "KFC Cambodia",
    restaurantImage: "https://images.unsplash.com/photo-1766589221522-d5beae155124?w=80&h=80&fit=crop",
    items: ["Zinger Burger", "Original Chicken × 2", "Pepsi"], total: 12.5,
    date: "May 28, 2026 · 7:45 PM", status: "delivered", pointsEarned: 125, paymentMethod: "Cash on Delivery", reviewed: true,
  },
  {
    id: "3", orderId: "ORD-2026-999", restaurant: "Pizza Company",
    restaurantImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop",
    items: ["Margherita Pizza (Large)"], total: 14.0,
    date: "May 22, 2026 · 12:30 PM", status: "cancelled", pointsEarned: 0, paymentMethod: "KHQR", reviewed: false,
  },
];

const TIER_CONFIG = {
  Bronze: { color: "#cd7f32", bg: "#fdf3e7", next: "Silver", nextAt: 500 },
  Silver: { color: "#9ca3af", bg: "#f3f4f6", next: "Gold", nextAt: 2000 },
  Gold: { color: "#f59e0b", bg: "#fffbeb", next: "Platinum", nextAt: 5000 },
  Platinum: { color: "#6366f1", bg: "#eef2ff", next: null, nextAt: null },
};

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const { points, tier, tierProgress, transactions } = useLoyalty();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"orders" | "points">("orders");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [disputeModal, setDisputeModal] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const tierCfg = TIER_CONFIG[tier];

  const statusIcon = (s: OrderStatus) => {
    if (s === "delivered") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (s === "cancelled") return <XCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };
  const statusLabel = (s: OrderStatus) => ({
    delivered: "Delivered",
    cancelled: "Cancelled",
    processing: "Processing",
  }[s]);

  return (
    <div style={{ backgroundColor: "#f8f8f8" }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-5">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-black text-gray-900 mb-5">My Orders & Rewards</h1>

        {/* ── LOYALTY CARD ── */}
        <div className="rounded-2xl overflow-hidden mb-5 relative"
          style={{ background: `linear-gradient(135deg, ${PINK} 0%, #ff5ca0 100%)`, boxShadow: "0 4px 20px rgba(215,15,100,0.3)" }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white" />
          <div className="p-5 relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-white/70 text-xs mb-0.5">Reward Points</div>
                <div className="text-white font-black text-3xl">{points.toLocaleString()}</div>
                <div className="text-white/80 text-xs mt-0.5">≈ ${(points * 0.01).toFixed(2)} discount value</div>
              </div>
              <div className="text-right">
                <span className="inline-block text-xs font-black px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: tierCfg.bg, color: tierCfg.color }}>
                  {tier} Member 🏆
                </span>
              </div>
            </div>
            {/* Tier progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-white/70 text-xs mb-1.5">
                <span>{tier}</span>
                {tierCfg.next && <span>{tierCfg.next} at {tierCfg.nextAt?.toLocaleString()} pts</span>}
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${Math.min(tierProgress, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-5 border border-gray-100">
          {(["orders", "points"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize"
              style={activeTab === t ? { backgroundColor: PINK, color: "#fff" } : { color: "#6b7280" }}>
              {t === "orders" ? "Order History" : "Points History"}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100"
                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="flex items-center gap-3">
                    <img src={order.restaurantImage} alt={order.restaurant}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm">{order.restaurant}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{order.items.join(", ")}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{order.date}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-gray-900">${order.total.toFixed(2)}</div>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        {statusIcon(order.status)}
                        <span className={`text-xs font-semibold ${
                          order.status === "delivered" ? "text-green-600" :
                          order.status === "cancelled" ? "text-red-400" : "text-amber-500"
                        }`}>{statusLabel(order.status)}</span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1 transition-transform"
                      style={{ transform: expanded === order.id ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </div>
                </button>

                {expanded === order.id && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Order ID</span><span className="font-bold text-gray-700">#{order.orderId}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Payment</span><span className="font-semibold text-gray-700">{order.paymentMethod}</span>
                    </div>
                    {order.status === "delivered" && order.pointsEarned > 0 && (
                      <div className="flex justify-between text-xs" style={{ color: "#059669" }}>
                        <span>Points earned</span>
                        <span className="font-bold">+{order.pointsEarned} pts 🎁</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2 flex-wrap">
                      <button onClick={() => navigate(`/food/invoice/${order.orderId}`)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </button>

                      {order.status === "delivered" && !order.reviewed && (
                        <button onClick={() => navigate(`/food/review/${order.orderId}`)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors hover:bg-amber-50"
                          style={{ borderColor: "#f59e0b", color: "#d97706" }}>
                          <Star className="w-3.5 h-3.5" /> Rate Order
                        </button>
                      )}
                      {order.status === "delivered" && order.reviewed && (
                        <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 text-gray-400">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Reviewed
                        </span>
                      )}

                      <button onClick={() => navigate(`/food/restaurants/r3`)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors hover:bg-pink-50"
                        style={{ borderColor: PINK, color: PINK }}>
                        <RotateCcw className="w-3.5 h-3.5" /> Reorder
                      </button>

                      {order.status === "delivered" && (
                        <button onClick={() => setDisputeModal(order.orderId)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors ml-auto">
                          <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── POINTS TAB ── */}
        {activeTab === "points" && (
          <div className="space-y-3">
            {/* Redeem box */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4" style={{ color: PINK }} />
                <span className="font-bold text-gray-900 text-sm">Redeem Points</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 200].map((amt) => (
                  <button key={amt}
                    onClick={() => {
                      if (points >= amt) { showToast(`${amt} pts redeemed = $${(amt * 0.01).toFixed(2)} off! 🎉`, "success"); }
                      else showToast("Insufficient points", "error");
                    }}
                    className={`py-3 rounded-xl border-2 text-center transition-all ${points >= amt ? "hover:bg-pink-50" : "opacity-50 cursor-not-allowed"}`}
                    style={points >= amt ? { borderColor: PINK } : { borderColor: "#e5e7eb" }}>
                    <div className="font-black text-sm" style={points >= amt ? { color: PINK } : { color: "#9ca3af" }}>{amt} pts</div>
                    <div className="text-xs text-gray-400 mt-0.5">= ${(amt * 0.01).toFixed(2)} off</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-50">
                <span className="font-bold text-gray-900 text-sm">Points History</span>
              </div>
              {transactions.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">No transactions yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: t.type === "earn" ? "#d1fae5" : "#fff0f6" }}>
                        <span style={{ fontSize: 16 }}>{t.type === "earn" ? "🎁" : "💸"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 line-clamp-1">{t.description}</div>
                        <div className="text-xs text-gray-400">{t.date}</div>
                      </div>
                      <div className={`font-black text-sm flex-shrink-0 ${t.type === "earn" ? "text-green-600" : ""}`}
                        style={t.type === "redeem" ? { color: PINK } : {}}>
                        {t.type === "earn" ? "+" : "−"}{t.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── DISPUTE MODAL ── */}
      {disputeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Report an Issue</div>
                <div className="text-xs text-gray-400">Order #{disputeModal}</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {["Wrong item received", "Missing item", "Food was cold", "Packaging damaged", "Other"].map((r) => (
                <button key={r} onClick={() => setDisputeReason(r)}
                  className="w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                  style={disputeReason === r
                    ? { borderColor: PINK, backgroundColor: "#fff0f6", color: PINK }
                    : { borderColor: "#e5e7eb", color: "#374151" }}>
                  {r}
                </button>
              ))}
            </div>

            <textarea placeholder="Describe the issue in detail..." rows={3}
              className="w-full bg-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none mb-4" />

            <div className="flex gap-2">
              <button onClick={() => setDisputeModal(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => {
                  setDisputeModal(null);
                  showToast("Issue reported! Our team will contact you within 2 hours 🙏", "success");
                }}
                className="flex-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-90"
                style={{ backgroundColor: "#dc2626" }}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
