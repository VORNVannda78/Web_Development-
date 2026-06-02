import { useState } from "react";
import { MapPin, Phone, CheckCircle, Navigation, Package, DollarSign, Star, ToggleRight, ToggleLeft, Bike } from "lucide-react";
import { orders } from "../../data/mockData";

const activeDelivery = orders.find((o) => o.status === "Delivering");

export function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentDelivery, setCurrentDelivery] = useState(activeDelivery);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);

  const handleComplete = () => {
    setDeliveryCompleted(true);
    setTimeout(() => {
      setCurrentDelivery(undefined);
      setDeliveryCompleted(false);
    }, 2000);
  };

  return (
    <div className="pb-4 px-4 pt-4">
      {/* Online Toggle */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
        <div>
          <div className="font-bold text-gray-900">Availability</div>
          <div className={`text-sm font-medium mt-0.5 ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? "● You are Online" : "○ You are Offline"}
          </div>
        </div>
        <button onClick={() => setIsOnline(!isOnline)} className={isOnline ? "text-green-500" : "text-gray-300"}>
          {isOnline ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12" />}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Today", value: "$18.50", icon: DollarSign, color: "from-amber-400 to-orange-500" },
          { label: "Deliveries", value: "6", icon: Package, color: "from-red-500 to-red-600" },
          { label: "Rating", value: "4.8★", icon: Star, color: "from-green-400 to-green-600" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-3 text-white text-center`}>
            <stat.icon className="w-5 h-5 mx-auto mb-1 opacity-80" />
            <div className="font-black">{stat.value}</div>
            <div className="text-xs opacity-70">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Current Delivery */}
      {currentDelivery && isOnline && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 flex items-center gap-2">
            <Bike className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">Active Delivery</span>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-900">#{currentDelivery.id}</div>
                <div className="text-sm text-gray-500 mt-0.5">{currentDelivery.restaurantName}</div>
              </div>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                {currentDelivery.status}
              </span>
            </div>

            {/* Pickup & Delivery */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-orange-700">Pickup From</div>
                  <div className="text-sm text-gray-700 font-medium">136 Norodom Blvd, Phnom Penh</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-green-700">Deliver To</div>
                  <div className="text-sm text-gray-700 font-medium">{currentDelivery.deliveryAddress}</div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="text-xs font-semibold text-gray-500 mb-2">Order Items</div>
              {currentDelivery.items.map((item, i) => (
                <div key={i} className="text-sm text-gray-700">{item.foodName} × {item.quantity}</div>
              ))}
              <div className="text-sm font-bold text-red-500 mt-1">Total: ${currentDelivery.totalAmount}</div>
              <div className="text-xs text-gray-400 mt-0.5">Payment: {currentDelivery.paymentMethod}</div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700">
                <Phone className="w-4 h-4" />
                Call Customer
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700">
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
            </div>
            <button
              onClick={handleComplete}
              className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {deliveryCompleted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Completed!
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Mark as Delivered
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* No delivery */}
      {(!currentDelivery || !isOnline) && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bike className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-700">{isOnline ? "Waiting for Delivery..." : "You're Offline"}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {isOnline ? "We'll notify you when a delivery is available" : "Go online to start receiving deliveries"}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3">Today's Summary</h3>
        <div className="space-y-2">
          {[
            { label: "Total Deliveries", value: "6" },
            { label: "Completed", value: "5" },
            { label: "Cancelled", value: "1" },
            { label: "Total Distance", value: "24.5 km" },
            { label: "Earnings", value: "$18.50" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm py-1 border-b border-gray-50">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
