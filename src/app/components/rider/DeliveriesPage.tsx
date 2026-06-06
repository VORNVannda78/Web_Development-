import { MapPin, Clock, DollarSign, XCircle } from "lucide-react";

const deliveryHistory = [
  { id: "ORD001", restaurant: "Malis Restaurant", address: "BKK1, Phnom Penh", amount: 2.5, status: "Completed", time: "09:30 AM", distance: "3.2 km" },
  { id: "ORD009", restaurant: "KFC Cambodia", address: "Toul Kork, Phnom Penh", amount: 2.0, status: "Completed", time: "10:15 AM", distance: "2.1 km" },
  { id: "ORD011", restaurant: "Num Banh Chok", address: "Riverside, Phnom Penh", amount: 1.5, status: "Completed", time: "11:00 AM", distance: "4.5 km" },
  {
    id: "ORD015",
    restaurant: "Bai Cha House",
    address: "Russian Market, Phnom Penh",
    amount: 0,
    status: "Canceled",
    time: "12:30 PM",
    distance: "1.8 km",
    cancelReason: "Customer refused pickup after rider arrived",
  },
  { id: "ORD018", restaurant: "Pizza Company", address: "Daun Penh, Phnom Penh", amount: 3.0, status: "Completed", time: "01:45 PM", distance: "5.6 km" },
  { id: "ORD022", restaurant: "Boeng Kak BBQ", address: "Sen Sok, Phnom Penh", amount: 3.5, status: "Completed", time: "03:20 PM", distance: "6.1 km" },
];

export function DeliveriesPage() {
  const totalEarnings = deliveryHistory.reduce((sum, d) => sum + d.amount, 0);
  const completed = deliveryHistory.filter((d) => d.status === "Completed").length;
  const canceled = deliveryHistory.filter((d) => d.status === "Canceled").length;

  return (
    <div className="pb-4">
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <h1 className="font-black text-lg text-gray-900">Delivery History</h1>
      </div>

      {/* Summary */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 text-white mb-4 grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-2xl font-black">{deliveryHistory.length}</div>
            <div className="text-xs opacity-80">Total</div>
          </div>
          <div className="text-center border-x border-white/20">
            <div className="text-2xl font-black">{completed}</div>
            <div className="text-xs opacity-80">Completed</div>
          </div>
          <div className="text-center border-r border-white/20">
            <div className="text-2xl font-black">{canceled}</div>
            <div className="text-xs opacity-80">Canceled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black">${totalEarnings.toFixed(1)}</div>
            <div className="text-xs opacity-80">Earned</div>
          </div>
        </div>

        {/* Delivery List */}
        <div className="space-y-3">
          {deliveryHistory.map((delivery) => (
            <div
              key={delivery.id}
              className={`rounded-2xl p-4 shadow-sm border ${
                delivery.status === "Canceled" ? "bg-red-50 border-red-200" : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className={`font-bold text-sm ${delivery.status === "Canceled" ? "text-red-900" : "text-gray-900"}`}>#{delivery.id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{delivery.restaurant}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  delivery.status === "Completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}>
                  {delivery.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{delivery.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{delivery.time}</span>
                </div>
              </div>
              {delivery.status === "Canceled" && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-100 p-3 text-red-700">
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black">Canceled evidence</div>
                    <div className="text-xs font-semibold">{delivery.cancelReason}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400">{delivery.distance}</span>
                {delivery.status === "Completed" ? (
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    +${delivery.amount.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-xs text-red-400">No earnings</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
