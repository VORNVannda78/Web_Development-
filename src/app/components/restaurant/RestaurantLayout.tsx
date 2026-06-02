import { Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, TrendingUp, Store } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/restaurant" },
  { icon: UtensilsCrossed, label: "Foods", path: "/restaurant/foods" },
  { icon: ClipboardList, label: "Orders", path: "/restaurant/orders" },
  { icon: TrendingUp, label: "Earnings", path: "/restaurant/earnings" },
];

export function RestaurantLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-gray-900 text-sm leading-tight">Malis Restaurant</div>
              <div className="text-xs text-green-500 font-medium">● Open</div>
            </div>
          </button>
          <div className="text-xs text-gray-400">Restaurant Panel</div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full">
        <Outlet />
      </main>

      <nav className="bg-white border-t border-gray-100 sticky bottom-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/restaurant" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center py-3 gap-1 relative transition-colors ${
                  isActive ? "text-red-500" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
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
