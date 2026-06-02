import { useNavigate } from "react-router";
import { ArrowLeft, Download, Share2, CheckCircle, Clock } from "lucide-react";
import { useCart } from "../../context/CartContext";

const PINK = "#D70F64";

// Mock invoice data (in real app, driven by order ID from params)
const mockInvoice = {
  orderId: "ORD-2026-001",
  date: "June 2, 2026",
  time: "10:12 AM",
  status: "Paid" as "Paid" | "Pending",
  paymentMethod: "ABA Pay",
  restaurant: {
    name: "Malis Restaurant",
    address: "Street 178, Daun Penh, Phnom Penh",
    phone: "023 221 022",
  },
  customer: {
    name: "Sokha Pich",
    phone: "012 345 678",
    address: "House 12, Street 271, BKK1, Phnom Penh",
    type: "Home 🏠",
  },
  items: [
    { name: "Amok Fish", qty: 1, unitPrice: 6.50 },
    { name: "Crispy Chicken Burger", qty: 2, unitPrice: 5.50 },
    { name: "Jasmine Rice", qty: 1, unitPrice: 1.50 },
  ],
  deliveryFee: 1.50,
  promoCode: "PANDA20",
  discount: 2.76,
  vatRate: 10,
  orderNote: "No MSG please, extra napkins",
};

export function InvoicePage() {
  const navigate = useNavigate();
  const subtotal = mockInvoice.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const beforeVat = subtotal + mockInvoice.deliveryFee - mockInvoice.discount;
  const vat = +(beforeVat * (mockInvoice.vatRate / 100)).toFixed(2);
  const grandTotal = +(beforeVat + vat).toFixed(2);

  const TIER_COLORS: Record<string, string> = { Bronze: "#cd7f32", Silver: "#9ca3af", Gold: "#f59e0b", Platinum: "#6366f1" };

  return (
    <div style={{ backgroundColor: "#f8f8f8" }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: PINK }}>
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>

        {/* Invoice card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>

          {/* ── HEADER ── */}
          <div className="relative overflow-hidden px-6 pt-7 pb-6"
            style={{ background: `linear-gradient(135deg, ${PINK} 0%, #ff5ca0 100%)` }}>
            {/* decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-10 bg-white" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-lg" style={{ color: PINK }}>E</div>
                  <div>
                    <div className="font-black text-white text-lg leading-tight">EatZone</div>
                    <div className="text-white/70 text-xs">Food Delivery Cambodia</div>
                  </div>
                </div>
                <div className="text-white/60 text-xs space-y-0.5">
                  <div>📞 +855 23 123 456</div>
                  <div>✉️ support@eatzone.kh</div>
                  <div>🌐 www.eatzone.kh</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-xs mb-1">INVOICE</div>
                <div className="text-white font-black text-lg">#{mockInvoice.orderId}</div>
                <div className="mt-2">
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${mockInvoice.status === "Paid"
                    ? "bg-green-400/30 text-green-100"
                    : "bg-yellow-400/30 text-yellow-100"}`}>
                    {mockInvoice.status === "Paid" ? "✓ PAID" : "⏳ PENDING"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── DATE & INFO ROW ── */}
          <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Date & Time</div>
              <div className="text-sm font-bold text-gray-800">{mockInvoice.date}</div>
              <div className="text-xs text-gray-500">{mockInvoice.time}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Payment</div>
              <div className="text-sm font-bold text-gray-800">{mockInvoice.paymentMethod}</div>
              <div className="flex items-center gap-1 mt-0.5">
                {mockInvoice.status === "Paid"
                  ? <><CheckCircle className="w-3 h-3 text-green-500" /><span className="text-xs text-green-600 font-semibold">Paid</span></>
                  : <><Clock className="w-3 h-3 text-yellow-500" /><span className="text-xs text-yellow-600 font-semibold">Pending</span></>}
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* ── RESTAURANT & CUSTOMER ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">From Restaurant</div>
                <div className="font-black text-gray-900 text-sm">{mockInvoice.restaurant.name}</div>
                <div className="text-xs text-gray-500 mt-1 leading-relaxed">{mockInvoice.restaurant.address}</div>
                <div className="text-xs text-gray-400 mt-1">{mockInvoice.restaurant.phone}</div>
              </div>
              <div className="bg-pink-50 rounded-2xl p-4" style={{ border: "1px solid #fce7f3" }}>
                <div className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: PINK }}>Deliver To</div>
                <div className="font-black text-gray-900 text-sm">{mockInvoice.customer.name}</div>
                <div className="text-xs text-gray-500 mt-1">{mockInvoice.customer.phone}</div>
                <div className="text-xs text-gray-500 mt-1 leading-relaxed">{mockInvoice.customer.address}</div>
                <span className="inline-block text-xs font-bold mt-1.5 px-2 py-0.5 rounded-full bg-pink-100"
                  style={{ color: PINK }}>{mockInvoice.customer.type}</span>
              </div>
            </div>

            {/* ── ITEMS TABLE ── */}
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Order Items</div>
              <div className="rounded-2xl overflow-hidden border border-gray-100">
                {/* table header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-xs font-black text-gray-400 uppercase bg-gray-50">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Unit</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>
                {mockInvoice.items.map((item, i) => (
                  <div key={i}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center ${i < mockInvoice.items.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <div className="col-span-5 font-semibold text-gray-800">{item.name}</div>
                    <div className="col-span-2 text-center text-gray-500">{item.qty}</div>
                    <div className="col-span-2 text-right text-gray-500">${item.unitPrice.toFixed(2)}</div>
                    <div className="col-span-3 text-right font-bold text-gray-900">${(item.qty * item.unitPrice).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FINANCIAL BREAKDOWN ── */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span><span>${mockInvoice.deliveryFee.toFixed(2)}</span>
              </div>
              {mockInvoice.discount > 0 && (
                <div className="flex justify-between font-semibold" style={{ color: "#198754" }}>
                  <span>Discount ({mockInvoice.promoCode})</span>
                  <span>−${mockInvoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 border-t border-gray-200 pt-2">
                <span>Subtotal (excl. VAT)</span><span>${beforeVat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>VAT ({mockInvoice.vatRate}%)</span><span>${vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 text-base border-t-2 border-gray-200 pt-2.5 mt-1">
                <span>Grand Total</span>
                <span style={{ color: PINK }}>${grandTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">* Price includes {mockInvoice.vatRate}% VAT as required by Cambodian tax law</p>
            </div>

            {/* ── ORDER NOTE ── */}
            {mockInvoice.orderNote && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1.5">📝 Order Note</div>
                <p className="text-sm text-amber-800 italic">"{mockInvoice.orderNote}"</p>
              </div>
            )}

            {/* ── FOOTER ── */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-sm font-bold text-gray-700 mb-1">🙏 Thank you for ordering with EatZone!</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                For any issues with your order, contact our support team:<br />
                <span className="font-semibold text-gray-600">📞 +855 23 123 456 &nbsp;|&nbsp; ✉️ support@eatzone.kh</span>
              </p>
              <p className="text-xs text-gray-300 mt-3">
                This is a computer-generated invoice. No signature required.<br />
                EatZone Cambodia · TIN: 123-456-789
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate("/food/review/ORD-2026-001")}
            className="flex-1 py-3 rounded-xl font-bold border-2 text-sm transition-colors hover:bg-pink-50"
            style={{ borderColor: PINK, color: PINK }}>
            ⭐ Write a Review
          </button>
          <button
            onClick={() => navigate("/food")}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: PINK }}>
            Order Again
          </button>
        </div>
      </div>
    </div>
  );
}
