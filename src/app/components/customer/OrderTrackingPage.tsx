import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Phone, Star, CheckCircle, Clock, ChefHat, Bike, Package } from "lucide-react";
import { orders } from "../../data/mockData";

const statusSteps = [
  { key: "Pending", label: "Order Placed", icon: Package, desc: "Waiting for restaurant" },
  { key: "Confirmed", label: "Confirmed", icon: CheckCircle, desc: "Restaurant accepted" },
  { key: "Cooking", label: "Cooking", icon: ChefHat, desc: "Preparing your food" },
  { key: "Rider Picking", label: "Rider Picking", icon: Bike, desc: "Rider heading to restaurant" },
  { key: "Delivering", label: "On the Way", icon: Bike, desc: "Rider heading to you" },
  { key: "Completed", label: "Delivered", icon: CheckCircle, desc: "Enjoy your meal!" },
];

function getStepIndex(status: string) {
  return statusSteps.findIndex((s) => s.key === status);
}

export function OrderTrackingPage() {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(orders[0]);
  const activeStep = getStepIndex(selectedOrder.status);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="font-black text-lg text-gray-900">Track Order</h1>
      </div>

      {/* Order Selector */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                selectedOrder.id === order.id
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              #{order.id}
            </button>
          ))}
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-bold text-gray-900">{selectedOrder.restaurantName}</div>
              <div className="text-xs text-gray-400 mt-0.5">#{selectedOrder.id}</div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              selectedOrder.status === "Completed" ? "bg-green-100 text-green-700" :
              selectedOrder.status === "Cancelled" ? "bg-red-100 text-red-700" :
              "bg-orange-100 text-orange-700"
            }`}>
              {selectedOrder.status}
            </span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{selectedOrder.deliveryAddress}</span>
            </div>
            {selectedOrder.estimatedDelivery && (
              <div className="flex gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>Est. {new Date(selectedOrder.estimatedDelivery).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Map Placeholder */}
        {(selectedOrder.status === "Delivering" || selectedOrder.status === "Rider Picking") && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
            <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-50">
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Bike className="w-8 h-8 text-red-500" />
                </div>
                <div className="bg-white rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-md">
                  🛵 Dara is on the way!
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-white rounded-xl p-2 flex items-center gap-2 shadow-sm">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">DS</div>
                <div>
                  <div className="text-xs font-bold text-gray-800">Dara Sok</div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
                <button className="ml-auto bg-red-500 text-white rounded-full p-2">
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-0">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= activeStep;
              const isActive = index === activeStep;
              return (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive ? "bg-red-500 shadow-lg shadow-red-200" :
                      isCompleted ? "bg-green-500" : "bg-gray-100"
                    }`}>
                      <step.icon className={`w-4 h-4 ${isCompleted || isActive ? "text-white" : "text-gray-300"}`} />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 mb-1 ${isCompleted ? "bg-green-300" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className={`pb-4 ${index < statusSteps.length - 1 ? "" : ""}`}>
                    <div className={`text-sm font-semibold ${isActive ? "text-red-600" : isCompleted ? "text-gray-800" : "text-gray-300"}`}>
                      {step.label}
                    </div>
                    <div className={`text-xs ${isActive ? "text-orange-500" : isCompleted ? "text-gray-400" : "text-gray-200"}`}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-2">
            {selectedOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.foodName} × {item.quantity}</span>
                <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm">
              <span>Total</span>
              <span className="text-red-500">${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {selectedOrder.status === "Completed" && (
            <button className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-bold text-sm">
              Rate & Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
