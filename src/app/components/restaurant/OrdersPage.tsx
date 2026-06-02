import { useState } from "react";
import { CheckCircle, XCircle, ChefHat, Bike, Clock, ShoppingBag } from "lucide-react";
import { orders as initialOrders, type Order, type OrderStatus } from "../../data/mockData";

const statusTabs: OrderStatus[] = ["Pending", "Confirmed", "Cooking", "Rider Picking", "Delivering", "Completed"];
const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Cooking: "bg-orange-100 text-orange-700",
  "Rider Picking": "bg-purple-100 text-purple-700",
  Delivering: "bg-indigo-100 text-indigo-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  Pending: "Confirmed",
  Confirmed: "Cooking",
  Cooking: "Rider Picking",
};

export function OrdersPage() {
  const restaurantOrders = initialOrders.filter((o) => o.restaurantId === "r1");
  const [orders, setOrders] = useState<Order[]>([
    ...restaurantOrders,
    {
      id: "ORD004",
      customerId: "u3",
      restaurantId: "r1",
      restaurantName: "Malis Restaurant",
      items: [{ foodName: "Amok Fish", quantity: 2, price: 6.5 }, { foodName: "Bai Sach Chrouk", quantity: 1, price: 3.5 }],
      status: "Pending",
      totalAmount: 16.5,
      deliveryFee: 1.5,
      deliveryAddress: "Street 51, Phnom Penh",
      paymentMethod: "Cash On Delivery",
      createdAt: "2026-05-13T10:30:00",
    },
  ]);
  const [activeTab, setActiveTab] = useState<"All" | OrderStatus>("All");

  const filteredOrders = activeTab === "All" ? orders : orders.filter((o) => o.status === activeTab);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "Cancelled" } : o));
  };

  return (
    <div className="pb-4">
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <h1 className="font-black text-lg text-gray-900">Orders</h1>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto no-scrollbar px-4 py-2 gap-2">
          <button
            onClick={() => setActiveTab("All")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
              activeTab === "All" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            All ({orders.length})
          </button>
          {statusTabs.map((tab) => {
            const count = orders.filter((o) => o.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  activeTab === tab ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 pt-4 space-y-3">
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No orders in this category</p>
          </div>
        )}
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-900">#{order.id}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-0.5">
                  <span className="text-gray-700">{item.foodName} × {item.quantity}</span>
                  <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                <span>Total</span>
                <span className="text-red-500">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Address & Payment */}
            <div className="text-xs text-gray-500 space-y-1 mb-3">
              <div>📍 {order.deliveryAddress}</div>
              <div>💳 {order.paymentMethod}</div>
              {order.note && <div>📝 {order.note}</div>}
            </div>

            {/* Action Buttons */}
            {order.status === "Pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(order.id, "Confirmed")}
                  className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl text-sm font-bold border border-red-200 flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
            {order.status === "Confirmed" && (
              <button
                onClick={() => updateStatus(order.id, "Cooking")}
                className="w-full bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <ChefHat className="w-4 h-4" />
                Start Cooking
              </button>
            )}
            {order.status === "Cooking" && (
              <button
                onClick={() => updateStatus(order.id, "Rider Picking")}
                className="w-full bg-blue-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <Bike className="w-4 h-4" />
                Ready for Pickup
              </button>
            )}
            {order.status === "Rider Picking" && (
              <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl">
                <Bike className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-purple-700">Rider is on the way to pickup</span>
              </div>
            )}
            {(order.status === "Delivering" || order.status === "Completed") && (
              <div className={`flex items-center gap-2 p-2.5 rounded-xl ${order.status === "Completed" ? "bg-green-50" : "bg-indigo-50"}`}>
                <Clock className={`w-4 h-4 ${order.status === "Completed" ? "text-green-500" : "text-indigo-500"}`} />
                <span className={`text-xs font-medium ${order.status === "Completed" ? "text-green-700" : "text-indigo-700"}`}>
                  {order.status === "Completed" ? "Order delivered successfully!" : "Out for delivery"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
