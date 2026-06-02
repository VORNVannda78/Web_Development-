import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Phone, CreditCard, FileText, ChevronRight, Banknote, QrCode, Check } from "lucide-react";

type PaymentMethod = "Cash On Delivery" | "ABA" | "KHQR";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("House 12, Street 271, BKK1, Phnom Penh");
  const [phone, setPhone] = useState("012 345 678");
  const [payment, setPayment] = useState<PaymentMethod>("Cash On Delivery");
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);

  const subtotal = 17.5;
  const deliveryFee = 1.5;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      navigate("/customer/tracking");
    }, 1500);
  };

  const paymentMethods: { method: PaymentMethod; icon: any; label: string; desc: string }[] = [
    { method: "Cash On Delivery", icon: Banknote, label: "Cash on Delivery", desc: "Pay when you receive" },
    { method: "ABA", icon: CreditCard, label: "ABA Pay", desc: "Pay via ABA Mobile" },
    { method: "KHQR", icon: QrCode, label: "KHQR", desc: "Scan QR to pay" },
  ];

  return (
    <div className="pb-36">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="font-black text-lg text-gray-900">Checkout</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="font-bold text-gray-900 text-sm">Delivery Address</span>
          </div>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
          />
          <div className="flex gap-2 mt-2">
            {["Home", "Office", "Friend's Place"].map((loc) => (
              <button
                key={loc}
                onClick={() => setAddress(`${loc}, Phnom Penh`)}
                className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-medium"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 text-red-500" />
            <span className="font-bold text-gray-900 text-sm">Phone Number</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-red-500" />
            <span className="font-bold text-gray-900 text-sm">Payment Method</span>
          </div>
          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <button
                key={pm.method}
                onClick={() => setPayment(pm.method)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  payment === pm.method
                    ? "border-red-400 bg-red-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  payment === pm.method ? "bg-red-500" : "bg-gray-200"
                }`}>
                  <pm.icon className={`w-5 h-5 ${payment === pm.method ? "text-white" : "text-gray-500"}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm font-semibold ${payment === pm.method ? "text-red-700" : "text-gray-800"}`}>
                    {pm.label}
                  </div>
                  <div className="text-xs text-gray-400">{pm.desc}</div>
                </div>
                {payment === pm.method && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* KHQR QR Preview */}
          {payment === "KHQR" && (
            <div className="mt-3 p-4 bg-gray-50 rounded-xl flex flex-col items-center gap-2">
              <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center">
                <QrCode className="w-20 h-20 text-gray-700" />
              </div>
              <p className="text-xs text-gray-500">Scan with any Cambodian banking app</p>
            </div>
          )}
        </div>

        {/* Order Note */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-red-500" />
            <span className="font-bold text-gray-900 text-sm">Order Note (Optional)</span>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. No MSG, extra spicy, ring doorbell..."
            rows={2}
            className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Amok Fish × 1</span>
              <span>$6.50</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Crispy Chicken Burger × 2</span>
              <span>$11.00</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>$1.50</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-red-500">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl py-4 flex items-center justify-between px-5 shadow-2xl font-bold disabled:opacity-80"
        >
          <span>{placing ? "Placing Order..." : "Place Order"}</span>
          <span className="flex items-center gap-1">
            <span>${total.toFixed(2)}</span>
            {!placing && <ChevronRight className="w-5 h-5" />}
            {placing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          </span>
        </button>
      </div>
    </div>
  );
}
