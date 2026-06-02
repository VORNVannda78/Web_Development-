import { useNavigate } from "react-router";
import { User, MapPin, Phone, Mail, ShoppingBag, Heart, Bell, HelpCircle, LogOut, ChevronRight, Star } from "lucide-react";

const menuItems = [
  { icon: ShoppingBag, label: "My Orders", badge: "3", path: "/customer/tracking" },
  { icon: Heart, label: "Favorites", badge: null, path: null },
  { icon: MapPin, label: "Addresses", badge: null, path: null },
  { icon: Bell, label: "Notifications", badge: "2", path: null },
  { icon: HelpCircle, label: "Help & Support", badge: null, path: null },
];

export function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="pb-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-red-500 to-orange-500 px-4 pt-8 pb-16 text-white relative">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-black">Sophea Mao</h1>
            <div className="flex items-center gap-1 text-orange-100 text-sm mt-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>Gold Member</span>
            </div>
            <div className="text-orange-100 text-xs mt-0.5">Member since Jan 2025</div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-4">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="text-center px-3">
              <div className="text-2xl font-black text-gray-900">24</div>
              <div className="text-xs text-gray-400 mt-0.5">Orders</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-gray-900">$142</div>
              <div className="text-xs text-gray-400 mt-0.5">Spent</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-gray-900">500</div>
              <div className="text-xs text-gray-400 mt-0.5">Points</div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Contact Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-red-500" />
              <span className="text-gray-700">012 345 678</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-red-500" />
              <span className="text-gray-700">sophea@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-gray-700">BKK1, Phnom Penh</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className={`w-full flex items-center px-4 py-4 gap-3 hover:bg-gray-50 transition-colors ${
                index > 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                <item.icon className="w-4 h-4 text-red-500" />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-800 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>

        {/* Loyalty Points */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-4 text-white mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">Loyalty Points</span>
            <span className="text-xl font-black">500 pts</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 mb-2">
            <div className="bg-white rounded-full h-2 w-1/2" />
          </div>
          <p className="text-xs text-orange-100">500 more points to reach Platinum!</p>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
