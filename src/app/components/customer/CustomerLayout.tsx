import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Store, ShoppingCart, MapPin, User, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface CustomerLayoutProps {
  cartCount: number;
}

const navItems = [
  { icon: Home, label: "Home", path: "/customer" },
  { icon: Store, label: "Restaurants", path: "/customer/restaurants" },
  { icon: ShoppingCart, label: "Cart", path: "/customer/cart" },
  { icon: MapPin, label: "Track", path: "/customer/tracking" },
  { icon: User, label: "Profile", path: "/customer/profile" },
];

export function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount] = useState(2);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg">NhamNow</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>BKK1, Phnom Penh</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full">
        <Outlet context={{ cartCount }} />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 sticky bottom-0 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/customer" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center py-3 gap-1 relative transition-colors ${
                  isActive ? "text-red-500" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.label === "Cart" && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
